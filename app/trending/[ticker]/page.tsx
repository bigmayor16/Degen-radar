'use client';

import { notFound } from 'next/navigation';
import { demoCoins } from '@/lib/demoData';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from 'recharts';

export default function CoinDetailPage({
  params,
}: {
  params: { ticker: string };
}) {
  const coin = demoCoins.find(
    (c) => c.ticker.replace('$', '').toLowerCase() === params.ticker.toLowerCase()
  );
  if (!coin) return notFound();

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-bold font-mono">{coin.ticker}</h1>
        <span className="font-mono text-lg font-bold text-signal">
          {coin.score}
          <span className="text-muted text-xs">/100</span>
        </span>
      </div>
      <p className="text-xs text-muted font-mono mb-5">
        First seen {coin.firstSeenMinutesAgo}m ago · demo data
      </p>

      <div className="rounded-lg border border-line bg-panel p-4 mb-5">
        <h2 className="text-xs font-bold text-muted mb-3">Mentions over time</h2>
        <div className="h-32 -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={coin.history}>
              <defs>
                <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFB020" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#FFB020" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="t"
                tick={{ fill: '#7B8794', fontSize: 10 }}
                axisLine={{ stroke: '#232C3B' }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: '#121821',
                  border: '1px solid #232C3B',
                  fontSize: 11,
                }}
              />
              <Area
                type="monotone"
                dataKey="mentions"
                stroke="#FFB020"
                fill="url(#fill)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg border border-line bg-panel p-4 mb-5">
        <h2 className="text-xs font-bold text-muted mb-3">
          Why this score — momentum breakdown
        </h2>
        <div className="space-y-2">
          {coin.breakdown.map((c) => (
            <div key={c.label} className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-muted w-32 shrink-0">
                {c.label}
              </span>
              <div className="flex-1 h-1.5 rounded-full bg-line overflow-hidden">
                <div
                  className="h-full bg-signal"
                  style={{ width: `${(c.value / 25) * 100}%` }}
                />
              </div>
              <span className="text-[11px] font-mono text-fog w-6 text-right">
                +{c.value}
              </span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted font-mono mt-3">
          This score reflects X attention, not a price or profit prediction.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5 text-[11px] font-mono">
        <div className="rounded-lg border border-line bg-panel p-3">
          <p className="text-muted mb-1">Unique accounts</p>
          <p className="text-fog text-base">{coin.uniqueAccounts}</p>
        </div>
        <div className="rounded-lg border border-line bg-panel p-3">
          <p className="text-muted mb-1">KOL mentions</p>
          <p className="text-kol text-base">{coin.kolMentions}</p>
        </div>
      </div>

      {coin.caDetected && coin.contractAddress && (
        <div className="rounded-lg border border-line bg-panel p-4 mb-5">
          <p className="text-[10px] text-muted font-mono mb-1">Contract address</p>
          <p className="font-mono text-xs break-all mb-3">{coin.contractAddress}</p>
          <div className="flex gap-2">
            <a className="flex-1 text-center text-xs font-mono border border-growth/50 text-growth rounded-lg py-2">
              DEX Screener
            </a>
            <a className="flex-1 text-center text-xs font-mono border border-line text-fog rounded-lg py-2">
              Solscan
            </a>
          </div>
        </div>
      )}

      <button className="w-full text-sm font-mono border border-signal/50 text-signal rounded-lg py-2.5">
        ★ Add to Watchlist
      </button>
    </div>
  );
}
