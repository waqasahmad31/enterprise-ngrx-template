// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const boundariesPlugin = require('eslint-plugin-boundaries');
const importPlugin = require('eslint-plugin-import');
const prettierConfig = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');

/**
 * `eslint-plugin-boundaries` doesn't currently type itself as an `ESLint.Plugin`,
 * so under `// @ts-check` we cast it to keep editor type-checking happy.
 * @type {import('eslint').ESLint.Plugin}
 */
const boundaries = /** @type {import('eslint').ESLint.Plugin} */ (
  /** @type {any} */ (boundariesPlugin)
);

/** @type {import('eslint').ESLint.Plugin} */
const importEslintPlugin = /** @type {import('eslint').ESLint.Plugin} */ (
  /** @type {any} */ (importPlugin)
);

/** @type {import('eslint').ESLint.Plugin} */
const prettierEslintPlugin = /** @type {import('eslint').ESLint.Plugin} */ (
  /** @type {any} */ (prettierPlugin)
);

module.exports = defineConfig([
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
      prettierConfig,
    ],
    processor: angular.processInlineTemplates,
    plugins: {
      boundaries,
      import: importEslintPlugin,
      prettier: prettierEslintPlugin,
    },
    settings: {
      'boundaries/include': ['src/app/**/*.ts'],
      'boundaries/ignore': ['**/*.spec.ts', 'src/main.ts', 'src/main.server.ts'],
      'boundaries/elements': [
        {
          type: 'feature',
          pattern: 'src/app/features/(*)/**',
          mode: 'full',
          capture: ['feature'],
        },
        { type: 'shared', pattern: 'src/app/shared/**', mode: 'full' },
        { type: 'core', pattern: 'src/app/core/**', mode: 'full' },
        { type: 'domain', pattern: 'src/app/domain/**', mode: 'full' },
        { type: 'app', pattern: 'src/app/**', mode: 'full' },
      ],
    },
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      'prettier/prettier': 'error',
      'boundaries/no-unknown-files': 'error',
      'boundaries/no-private': 'error',
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            { from: ['app'], allow: ['core', 'shared', 'feature', 'domain', 'app'] },
            { from: ['domain'], allow: ['domain'] },
            { from: ['core'], allow: ['core', 'domain'] },
            { from: ['shared'], allow: ['shared', 'core', 'domain'] },
            {
              from: ['feature'],
              allow: ['shared', 'core', 'domain', ['feature', { feature: '${from.feature}' }]],
              message:
                'Features must not import other features directly (allowed: core/shared/domain or same feature).',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.spec.ts'],
    rules: {
      // Tests often need pragmatic mocking; keep app code strict.
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      angular.configs.templateRecommended,
      angular.configs.templateAccessibility,
      prettierConfig,
    ],
    plugins: {
      prettier: prettierEslintPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
]);
