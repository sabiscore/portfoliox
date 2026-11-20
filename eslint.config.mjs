import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  // Ignore auto-generated and OG image files (Satori requires inline styles)
  {
    ignores: [
      'next-env.d.ts',
      '.next/**',
      '**/og/route.tsx',
      '**/og/route.ts',
      'components/OGImage.tsx',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  nextPlugin.flatConfig.recommended,
  {
    plugins: {
      'react-hooks': pluginReactHooks,
      'jsx-a11y': jsxA11y,
    },

    rules: {
      /**
       * CORE SAFETY
       * Note: base no-unused-vars is turned off in favour of the TypeScript-aware
       * version which correctly handles interface parameter names, overloads, etc.
       */
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',

      /**
       * REACT RULES
       */
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      /**
       * DESIGN SYSTEM ENFORCEMENT
       *
       * CSS custom-property tokens have no one-to-one Tailwind utility mapping.
       * Keep arbitrary inline styles visible as warnings rather than blocking
       * valid token-backed styling in the current design system.
       */
      'no-restricted-syntax': [
        'warn',
        {
          selector: "JSXAttribute[name.name='style']",
          message: 'Prefer Tailwind tokens over inline styles where possible.',
        },
      ],

      // Prevent arbitrary relative imports and enforce path aliases.
      'no-restricted-imports': ['error', { patterns: ['../*', '../../*', '../../../*'] }],

      /**
       * ACCESSIBILITY
       */
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/aria-role': 'error',

      /**
       * CODE QUALITY
       */
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  // These files execute in Node.js, not in the browser. Scope Node globals to
  // tooling and configuration so process/console/module are not accidentally
  // accepted in application components.
  {
    files: [
      'scripts/**/*.{js,mjs,cjs}',
      'eslint-rules/**/*.{js,mjs,cjs}',
      'tailwind.config.js',
      'postcss.config.mjs',
      'playwright.config.ts',
      'vitest.config.ts',
    ],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      // Console output is the CLI interface for build, audit, and generator scripts.
      'no-console': 'off',
    },
  },
  // This one interactive authoring CLI intentionally remains CommonJS. Keep
  // the exception local rather than disabling the rule for all Node scripts.
  {
    files: ['scripts/create-blog-post.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
