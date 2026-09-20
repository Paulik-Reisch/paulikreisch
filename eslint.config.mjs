import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });
export default [
  { ignores: ['.next/**', 'node_modules/**', '.agents/**', 'test-results/**', 'playwright-report/**'] },
  ...compat.extends('next/core-web-vitals'),
  { files: ['src/components/landing/header.tsx', 'src/components/landing/book-shop-header.tsx'], rules: { '@next/next/no-html-link-for-pages': 'off' } },
  {
    // Existing editorial copy contains literal quotation marks; JSX escapes aren't a quality metric.
    rules: { 'react/no-unescaped-entities': 'off' },
  },
];
