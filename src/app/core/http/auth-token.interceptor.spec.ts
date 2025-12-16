import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { lastValueFrom } from 'rxjs';
import { vi } from 'vitest';

import { authTokenInterceptor } from './auth-token.interceptor';
import { AuthService } from '@core/auth/auth.service';

describe('authTokenInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  const authMock: Partial<AuthService> & { accessToken: string | null } = {
    accessToken: 'initial-token',
    refreshTokens: vi.fn(),
    logout: vi.fn(),
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authTokenInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authMock },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('adds Authorization header when access token is present', async () => {
    authMock.accessToken = 'abc123';

    const promise = lastValueFrom(http.get('/api/users'));

    const req = httpMock.expectOne('/api/users');
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc123');

    req.flush(new HttpResponse({ status: 200, body: [] } as any));

    await promise;
  });

  it('does not add Authorization header when access token is missing', async () => {
    authMock.accessToken = null;

    const promise = lastValueFrom(http.get('/api/users'));

    const req = httpMock.expectOne('/api/users');
    expect(req.request.headers.has('Authorization')).toBe(false);

    req.flush(new HttpResponse({ status: 200, body: [] } as any));

    await promise;
  });

  it('retries the request with a new token on 401 when refresh succeeds', async () => {
    authMock.accessToken = 'old-token';
    (authMock.refreshTokens as any).mockResolvedValue({ accessToken: 'new-token' });

    const promise = lastValueFrom(http.get('/api/users'));

    const first = httpMock.expectOne('/api/users');
    expect(first.request.headers.get('Authorization')).toBe('Bearer old-token');

    first.flush(null, { status: 401, statusText: 'Unauthorized' });

    // Allow the interceptor's Promise-based refresh flow to resolve.
    await Promise.resolve();

    const retried = httpMock.expectOne('/api/users');
    expect(retried.request.headers.get('Authorization')).toBe('Bearer new-token');

    retried.flush(new HttpResponse({ status: 200, body: [] } as any));

    await promise;

    expect(authMock.refreshTokens).toHaveBeenCalledTimes(1);
    expect(authMock.logout).not.toHaveBeenCalled();
  });

  it('calls logout and does not retry when refresh returns no token', async () => {
    authMock.accessToken = 'old-token';
    (authMock.refreshTokens as any).mockResolvedValue(null);

    const promise = lastValueFrom(http.get('/api/users'));

    const first = httpMock.expectOne('/api/users');
    first.flush(null, { status: 401, statusText: 'Unauthorized' });

    // Allow the interceptor's Promise-based refresh flow to resolve.
    await Promise.resolve();

    // No retried request expected.
    httpMock.expectNone('/api/users');

    await expect(promise).rejects.toBeInstanceOf(HttpErrorResponse);
    expect(authMock.refreshTokens).toHaveBeenCalledTimes(1);
    expect(authMock.logout).toHaveBeenCalledTimes(1);
  });
});
