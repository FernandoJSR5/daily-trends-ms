import pluginJs from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintJest from 'eslint-plugin-jest';
import globals from 'globals';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    ignores: ['node_modules/**', 'public/api-explorer/**', 'dist/**'],
    languageOptions: {
      globals: {
        ...globals.node,
        jest: true,
        describe: true,
        it: true,
        test: true,
        expect: true,
        afterEach: true,
        beforeEach: true,
      },
      parser: tsParser,
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': ['warn'],
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: { sourceType: 'commonjs' },
  },
  {
    files: ['**/*.test.{js,ts}'],
    plugins: {
      jest: eslintJest,
    },
    rules: {
      'jest/consistent-test-it': 'warn',
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/valid-expect': 'error',
    },
  },
];
