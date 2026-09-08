import Link from 'next/link';
import type { ScoredToken } from '@/lib/momentum';

function timeAgo(iso: string) {
  const mins = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  return mins < 60 ? `${mins}m ago` : `${Math.floor(mins / 60)}h ago`;
}

function scoreColor(score: number) {
  if (score >= 60) return 'text-signal border-signal/50';
  if (score >= 30) return 'text-growth border-growth/50';
  return 'text-muted border-line';
}

export default function DetectedTokenCard({ token }: { token: ScoredToken }) {
  return (
    <Link
      href={`/trending/${token.ticker.replace('$', '')}`}
      className="block rounded-lg border border-line bg-panel p-3.5 active:bg-panelhi"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="font-mono font-bold text-sm">{token.ticker}</span>
        <span
          className={`font-mono text-xs font-bold rounded-full border px-2 py-0.5 ${scoreColor(
            token.score
          )}`}
        >
          {token.score}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-y-1.5 text-[11px] font-mono text-muted tabular">
        <span>Mentions</span>
        <span className="text-right text-fog">{token.totalMentions}</span>
        <span>Unique accts</span>
        <span className="text-right text-fog">{token.uniqueAccounts}</span>
        <span>Velocity</span>
        <span className="text-right text-growth">{token.mentionsPerMinute}/min</span>
        <span>KOLs</span>
        <span className="text-right text-kol">{token.kolMentions}</span>
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] font-mono">
        <span className={token.contractAddresses.length ? 'text-growth' : 'text-muted'}>
          {token.contractAddresses.length ? 'CA detected' : 'No CA yet'}
        </span>
        <span className="text-muted">{timeAgo(token.firstSeen)}</span>
      </div>
    </Link>
  );
}
