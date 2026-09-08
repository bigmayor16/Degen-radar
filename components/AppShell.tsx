'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import BottomNav from './BottomNav';
import RadarMark from './RadarMark';
import AuthGate from './AuthGate';
import { getProviderMode, type ProviderMode } from '@/lib/providers';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === '/login';
  const [mode, setMode] = useState<ProviderMode>('demo');

  useEffect(() => {
    setMode(getProviderMode());
  }, [pathname]);

  if (isLogin) {
    return <main className="px-4 pt-4 max-w-md mx-auto">{children}</main>;
  }

  return (
    <AuthGate>
      <header className="sticky top-0 z-30 bg-ink/95 backdrop-blur border-b border-line px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RadarMark size={20} />
          <span className="font-bold tracking-tight">Degen Radar</span>
        </div>
        <span
          className={`text-[10px] font-mono px-2 py-1 rounded border ${
            mode === 'live'
              ? 'border-growth/40 text-growth'
              : 'border-signal/40 text-signal'
          }`}
        >
          {mode === 'live' ? 'LIVE' : 'DEMO'}
        </span>
      </header>
      <main className="pb-24 px-4 pt-4 max-w-md mx-auto">{children}</main>
      <BottomNav />
    </AuthGate>
  );
}
