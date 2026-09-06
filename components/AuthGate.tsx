'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
      if (!data.session && pathname !== '/login') {
        router.replace('/login');
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (!s && pathname !== '/login') router.replace('/login');
    });

    return () => listener.subscription.unsubscribe();
  }, [pathname, router]);

  if (pathname === '/login') return <>{children}</>;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] text-muted text-sm font-mono">
        Loading...
      </div>
    );
  }

  if (!session) return null;

  return <>{children}</>;
}
