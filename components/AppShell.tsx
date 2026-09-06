'use client';

import { usePathname } from 'next/navigation';
import BottomNav from './BottomNav';
import RadarMark from './RadarMark';
import AuthGate from './AuthGate';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === '/login';

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
        <span className="text-[10px] font-mono px-2 py-1 rounded border border-signal/40 text-signal">
          DEMO
        </span>
      </header>
      <main className="pb-24 px-4 pt-4 max-w-md mx-auto">{children}</main>
      <BottomNav />
    </AuthGate>
  );
}
