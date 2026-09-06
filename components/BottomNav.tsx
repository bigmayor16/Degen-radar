'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/', label: 'Dashboard', glyph: '◆' },
  { href: '/trending', label: 'Trending', glyph: '▲' },
  { href: '/watchlist', label: 'Watchlist', glyph: '★' },
  { href: '/accounts', label: 'Accounts', glyph: '◎' },
  { href: '/alerts', label: 'Alerts', glyph: '▮' },
  { href: '/settings', label: 'Settings', glyph: '✦' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-panel border-t border-line">
      <ul className="max-w-md mx-auto grid grid-cols-6">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-mono ${
                  active ? 'text-signal' : 'text-muted'
                }`}
              >
                <span className="text-base leading-none">{item.glyph}</span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
