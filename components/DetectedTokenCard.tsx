import type { TokenStat } from '@/lib/detection/aggregate';

function timeAgo(iso: string) {
  const mins = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  return mins < 60 ? `${mins}m ago` : `${Math.floor(mins / 60)}h ago`;
}

export default function DetectedTokenCard({ token }: { token: TokenStat }) {
  return (
    <div className="rounded-lg border border-line bg-panel p-3.5">
      <div className="flex items-start justify-between mb-3">
        <span className="font-mono font-bold text-sm">{token.ticker}</span>
        <span className="font-mono text-[10px] text-muted">
          first seen {timeAgo(token.firstSeen)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-y-1.5 text-[11px] font-mono text-muted tabular">
        <span>Mentions</span>
        <span className="text-right text-fog">{token.totalMentions}</span>
        <span>Unique accts</span>
        <span className="text-right text-fog">{token.uniqueAccounts}</span>
        <span>Velocity</span>
        <span className="text-right text-growth">{token.mentionsPerMinute}/min</span>
        <span>KOL mentions</span>
        <span className="text-right text-kol">{token.kolMentions}</span>
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] font-mono">
        <span className={token.contractAddresses.length ? 'text-growth' : 'text-muted'}>
          {token.contractAddresses.length ? 'CA detected' : 'No CA yet'}
        </span>
        <span className="text-muted">
          top: {token.topAccounts[0] ? `@${token.topAccounts[0].username}` : '—'}
        </span>
      </div>

      {token.contractAddresses.length > 0 && (
        <div className="mt-3 flex gap-2">
          <a className="flex-1 text-center text-[10px] font-mono border border-growth/50 text-growth rounded-md py-1.5">
            DEX Screener
          </a>
          <a className="flex-1 text-center text-[10px] font-mono border border-line text-fog rounded-md py-1.5">
            Solscan
          </a>
        </div>
      )}
    </div>
  );
}
