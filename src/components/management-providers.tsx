'use client';
import type { ReactNode } from 'react';
import { ThemeProvider } from './theme-provider';
import { Toaster } from './ui/toaster';
/** No Firebase provider, visitor tracker or consent banner on management hosts. */
export function ManagementProviders({ children }: { children: ReactNode }) {
  return <ThemeProvider attribute="class" defaultTheme="light">{children}<Toaster /></ThemeProvider>;
}
