"use client"
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { ThemeProvider } from '@/shared/providers/theme-provider';
import { ToastProvider } from '@/shared/providers/toast-provider';
import { useAuth } from '../hooks/use-auth';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <ToastProvider />
        </ThemeProvider>
      </AuthProvider>
    </SessionProvider>
  );
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading) {
      router.replace(user ? '/dashboard' : '/home');
    }
  }, [user, loading, router]);
  return <>{children}</>;
}
