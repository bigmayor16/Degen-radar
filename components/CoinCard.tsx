import Link from 'next/link';
import type { Coin } from '@/lib/demoData';

function scoreColor(score: number) {
  if (score >= 80) return 'text-signal border-signal/50';
  if (score >= 55) return 'text-growth border-growth/50';
  return 'text-muted border-line';
}

export default function CoinCard({
  coin,
  className = '',
}: {
  coin: Coin;
  className?: string;
}) {
  return (
    <Link
      href={`/trending/${coin.ticker.replace('$', '')}`}
      className={`block rounded-lg border border-line bg-panel p-3.5 active:bg-panelhi ${className}`}
    >
      <div className="flex items-start justify-between">
        <span className="font-mono font-bold text-sm">{coin.ticker}</span>
        <span
          className={`font-mono text-xs font-bold rounded-full border px-2 py-0.5 ${scoreColor(
            coin.score
          )}`}
        >
          {coin.score}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-y-1.5 text-[11px] font-mono text-muted tabular">
        <span>Mentions</span>
        <span className="text-right text-fog">{coin.mentions}</span>
        <span>Unique accts</span>
        <span className="text-right text-fog">{coin.uniqueAccounts}</span>
        <span>5m growth</span>
        <span className="text-right text-growth">+{coin.growth5m}%</span>
        <span>KOLs</span>
        <span className="text-right text-kol">{coin.kolMentions}</span>
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] font-mono">
        <span className={coin.caDetected ? 'text-growth' : 'text-muted'}>
          {coin.caDetected ? 'CA detected' : 'No CA yet'}
        </span>
        <span className="text-muted">{coin.firstSeenMinutesAgo}m ago</span>
      </div>
    </Link>
  );
}
