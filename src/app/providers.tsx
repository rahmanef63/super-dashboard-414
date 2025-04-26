"use client"
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/shared/providers/theme-provider';
import { ToastProvider } from '@/shared/providers/toast-provider';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
        <ToastProvider />
      </ThemeProvider>
    </SessionProvider>
  );
}
