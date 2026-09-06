import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import BottomNav from '@/components/BottomNav';
import RadarMark from '@/components/RadarMark';

const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '700'],
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'Degen Radar',
  description: 'X intelligence tracker for Solana memecoins — demo mode',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body className="font-display min-h-screen">
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
      </body>
    </html>
  );
}
