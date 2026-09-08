'use client';

import { useEffect, useMemo, useState } from 'react';
import { getXDataProvider } from '@/lib/providers';
import type { XPost } from '@/lib/providers/types';
import { aggregateTokens } from '@/lib/detection/aggregate';
import { scoreTokens } from '@/lib/momentum';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from 'recharts';

function timeAgo(iso: string) {
  const mins = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  return mins < 60 ? `${mins}m ago` : `${Math.floor(mins / 60)}h ago`;
}

// Buckets raw mention timestamps into a handful of points for the chart.
function buildHistory(timestamps: string[]) {
  if (timestamps.length === 0) return [];
  const times = timestamps.map((t) => new Date(t).getTime()).sort((a, b) => a - b);
  const bucketCount = Math.min(6, times.length);
  const start = times[0];
  const end = times[times.length - 1];
  const span = Math.max(1, end - start);
  const buckets = Array.from({ length: bucketCount }, (_, i) => ({
    t: `${Math.round(((i + 1) / bucketCount) * (span / 60000))}m`,
    mentions: 0,
  }));
  times.forEach((time) => {
    const idx = Math.min(
      bucketCount - 1,
      Math.floor(((time - start) / span) * bucketCount)
    );
    buckets[idx].mentions += 1;
  });
  // Make it cumulative so the chart shows growth, not a flat histogram.
  let running = 0;
  return buckets.map((b) => {
    running += b.mentions;
    return { t: b.t, mentions: running };
  });
}

export default function CoinDetailPage({ params }: { params: { ticker: string } }) {
  const [posts, setPosts] = useState<XPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getXDataProvider()
      .fetchRecentPosts()
      .then((p) => {
        if (!cancelled) setPosts(p);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const scored = useMemo(() => scoreTokens(aggregateTokens(posts)), [posts]);
  const token = scored.find(
    (t) => t.ticker.replace('$', '').toLowerCase() === params.ticker.toLowerCase()
  );

  if (loading) {
    return (
      <p className="text-sm text-muted font-mono py-10 text-center">
        Loading token detail...
      </p>
    );
  }

  if (!token) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm text-muted font-mono mb-2">
          This ticker isn't in the current feed window.
        </p>
        <p className="text-xs text-muted font-mono">
          Demo data regenerates every few minutes — check Trending again shortly.
        </p>
      </div>
    );
  }

  const history = buildHistory(token.mentionTimestamps);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-bold font-mono">{token.ticker}</h1>
        <span className="font-mono text-lg font-bold text-signal">
          {token.score}
          <span className="text-muted text-xs">/100</span>
        </span>
      </div>
      <p className="text-xs text-muted font-mono mb-5">
        First seen {timeAgo(token.firstSeen)} · demo data
      </p>

      <div className="rounded-lg border border-line bg-panel p-4 mb-5">
        <h2 className="text-xs font-bold text-muted mb-3">Mentions over time</h2>
        <div className="h-32 -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
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
          {token.breakdown.map((c) => (
            <div key={c.label} className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-muted w-32 shrink-0">
                {c.label}
              </span>
              <div className="flex-1 h-1.5 rounded-full bg-line overflow-hidden">
                <div
                  className="h-full bg-signal"
                  style={{ width: `${Math.min(100, (c.value / 20) * 100)}%` }}
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
          <p className="text-fog text-base">{token.uniqueAccounts}</p>
        </div>
        <div className="rounded-lg border border-line bg-panel p-3">
          <p className="text-muted mb-1">KOL mentions</p>
          <p className="text-kol text-base">{token.kolMentions}</p>
        </div>
      </div>

      {token.topAccounts.length > 0 && (
        <div className="rounded-lg border border-line bg-panel p-4 mb-5">
          <p className="text-[10px] text-muted font-mono mb-2">Top accounts mentioning it</p>
          <div className="space-y-1.5">
            {token.topAccounts.map((a) => (
              <div key={a.username} className="flex items-center justify-between text-xs font-mono">
                <span>@{a.username}</span>
                <span className="text-muted">{a.count} posts</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {token.contractAddresses.length > 0 && (
        <div className="rounded-lg border border-line bg-panel p-4 mb-5">
          <p className="text-[10px] text-muted font-mono mb-1">Contract address</p>
          <p className="font-mono text-xs break-all mb-3">{token.contractAddresses[0]}</p>
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
