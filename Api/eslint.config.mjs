import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import sonarjs from 'eslint-plugin-sonarjs';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      '**/eslint.config.mjs',
      '**/node_modules',
      '**/dist',
      '**/coverage',
      '**/db',
      '**/e2e',
      '**/*spec.ts',
      '*/*jest.',
      '*/*test',
    ],
  },
  ...compat.extends(
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
    'plugin:sonarjs/recommended-legacy',
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      prettier,
      sonarjs,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parser: tsParser,
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        project: 'tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/unbound-method': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_$',
          argsIgnorePattern: '^_$',
          caughtErrorsIgnorePattern: '^_$',
        },
      ],
      'sonarjs/no-duplicate-string': ['error', { threshold: 20 }],
    },
  },
];
