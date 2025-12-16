import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { jwtVerify, SignJWT } from 'jose';
import { join } from 'node:path';
import crypto from 'node:crypto';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.disable('x-powered-by');

// Basic request hardening.
app.use(
  helmet({
    // Customize CSP directives per environment (CDNs, analytics, etc.).
    // Keep enabled by default so deployments start secure.
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        // Angular SSR apps commonly need inline styles from component rendering.
        // Prefer removing 'unsafe-inline' by using nonces/hashes if feasible.
        'style-src': ["'self'", "'unsafe-inline'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);

// Compress SSR + API responses.
app.use(compression());

// Reasonable payload limits (adjust if you accept large uploads).
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));

// Cookies (required for HttpOnly session auth).
app.use(cookieParser());

// Request IDs + minimal structured request logging.
app.use((req, res, next) => {
  const existing = req.get('X-Request-Id');
  const requestId = existing || crypto.randomUUID();

  res.setHeader('X-Request-Id', requestId);
  (req as unknown as { requestId?: string }).requestId = requestId;

  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    // Keep logs compact and machine-friendly.
    console.log(
      JSON.stringify({
        ts: new Date().toISOString(),
        requestId,
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        ms,
      }),
    );
  });

  next();
});

// Global rate limit baseline. Tighten and/or add route-specific limits for auth.
app.use(
  rateLimit({
    windowMs: 60_000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

// Health endpoint for container/orchestrator probes.
app.get('/healthz', (_req, res) => res.status(200).send('ok'));

// Readiness endpoint (extend with real checks: DB, upstream auth, etc.).
app.get('/readyz', (_req, res) => res.status(200).send('ready'));

/**
 * Cookie-based auth BFF (same-origin) for production.
 *
 * - Access token stored in HttpOnly cookie.
 * - Refresh token stored in HttpOnly cookie.
 * - CSRF protected using Angular's default double-submit cookie (XSRF-TOKEN).
 */

type UserRole = 'admin' | 'manager' | 'user';
type Permission =
  | 'users.read'
  | 'users.write'
  | 'settings.read'
  | 'settings.write'
  | 'reports.read'
  | 'audit.read'
  | 'teams.read'
  | 'roles.read'
  | 'billing.read'
  | 'integrations.read'
  | 'support.read';

interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  roles: UserRole[];
  permissions: Permission[];
}

const XSRF_COOKIE = 'XSRF-TOKEN';
const XSRF_HEADER = 'X-XSRF-TOKEN';
const ACCESS_COOKIE = 'access_token';
const REFRESH_COOKIE = 'refresh_token';

const isProd = process.env['NODE_ENV'] === 'production';
const cookieBaseOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: 'lax' as const,
  path: '/',
};

function getJwtSecret(): Uint8Array {
  const secret = process.env['AUTH_JWT_SECRET'];
  if (secret) return new TextEncoder().encode(secret);
  if (isProd) {
    throw new Error('Missing AUTH_JWT_SECRET in production');
  }

  return new TextEncoder().encode('dev-secret-change-me');
}

function ensureXsrfCookie(req: express.Request, res: express.Response): void {
  if (req.cookies?.[XSRF_COOKIE]) return;

  const token = crypto.randomBytes(32).toString('hex');
  res.cookie(XSRF_COOKIE, token, {
    httpOnly: false,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
  });
}

function requireCsrf(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): void {
  const method = req.method.toUpperCase();
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
    return next();
  }

  const cookieToken = req.cookies?.[XSRF_COOKIE];
  const headerToken = req.get(XSRF_HEADER);
  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    res.status(403).json({ message: 'CSRF validation failed' });
    return;
  }

  next();
}

async function signAccessToken(user: AuthUser): Promise<string> {
  const secret = getJwtSecret();
  return await new SignJWT({ user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .setSubject(user.id)
    .sign(secret);
}

async function signRefreshToken(user: AuthUser): Promise<string> {
  const secret = getJwtSecret();
  return await new SignJWT({ user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .setSubject(user.id)
    .sign(secret);
}

async function readUserFromAccessCookie(req: express.Request): Promise<AuthUser | null> {
  const token = req.cookies?.[ACCESS_COOKIE];
  if (!token) return null;

  try {
    const secret = getJwtSecret();
    const verified = await jwtVerify(token, secret);
    const payload = verified.payload as { user?: AuthUser };
    return payload.user ?? null;
  } catch {
    return null;
  }
}

async function readUserFromRefreshCookie(req: express.Request): Promise<AuthUser | null> {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (!token) return null;

  try {
    const secret = getJwtSecret();
    const verified = await jwtVerify(token, secret);
    const payload = verified.payload as { user?: AuthUser };
    return payload.user ?? null;
  } catch {
    return null;
  }
}

const authRateLimit = rateLimit({
  windowMs: 60_000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

app.get('/api/auth/csrf', (req, res) => {
  ensureXsrfCookie(req, res);
  res.status(204).end();
});

app.get('/api/auth/me', async (req, res) => {
  ensureXsrfCookie(req, res);

  const user = await readUserFromAccessCookie(req);
  if (!user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  res.status(200).json(user);
});

app.post('/api/auth/login', authRateLimit, requireCsrf, async (req, res) => {
  ensureXsrfCookie(req, res);

  const email = String(req.body?.email ?? '');
  const password = String(req.body?.password ?? '');
  if (!email || !password) {
    res.status(400).json({ message: 'Missing credentials' });
    return;
  }

  // Template user model; wire this to your real identity provider.
  const user: AuthUser = {
    id: crypto.randomUUID(),
    email,
    displayName: email.split('@')[0] || email,
    roles: ['user'],
    permissions: ['users.read'],
  };

  const access = await signAccessToken(user);
  const refresh = await signRefreshToken(user);

  res.cookie(ACCESS_COOKIE, access, { ...cookieBaseOptions, maxAge: 15 * 60 * 1000 });
  res.cookie(REFRESH_COOKIE, refresh, { ...cookieBaseOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

  res.status(200).json({ user });
});

app.post('/api/auth/refresh', authRateLimit, requireCsrf, async (req, res) => {
  ensureXsrfCookie(req, res);

  const user = await readUserFromRefreshCookie(req);
  if (!user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const access = await signAccessToken(user);
  res.cookie(ACCESS_COOKIE, access, { ...cookieBaseOptions, maxAge: 15 * 60 * 1000 });
  res.status(204).end();
});

app.post('/api/auth/logout', requireCsrf, (req, res) => {
  ensureXsrfCookie(req, res);

  res.clearCookie(ACCESS_COOKIE, { ...cookieBaseOptions });
  res.clearCookie(REFRESH_COOKIE, { ...cookieBaseOptions });
  res.status(204).end();
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
