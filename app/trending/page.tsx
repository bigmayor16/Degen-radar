'use client';

import { useEffect, useMemo, useState } from 'react';
import { getXDataProvider } from '@/lib/providers';
import type { XPost } from '@/lib/providers/types';
import { aggregateTokens, type TokenStat } from '@/lib/detection/aggregate';
import DetectedTokenCard from '@/components/DetectedTokenCard';

const filters = ['All', 'KOLs', 'CA Detected', 'High Engagement', 'Fastest Growing'] as const;
type Filter = (typeof filters)[number];

export default function TrendingPage() {
  const [posts, setPosts] = useState<XPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('All');

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

  const tokens = useMemo(() => aggregateTokens(posts), [posts]);

  const filtered = useMemo(() => {
    let list: TokenStat[] = tokens;
    if (filter === 'KOLs') list = list.filter((t) => t.kolMentions > 0);
    if (filter === 'CA Detected') list = list.filter((t) => t.contractAddresses.length > 0);
    if (filter === 'High Engagement') list = [...list].sort((a, b) => b.engagement - a.engagement);
    if (filter === 'Fastest Growing') list = [...list].sort((a, b) => b.mentionsPerMinute - a.mentionsPerMinute);
    return list;
  }, [tokens, filter]);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-lg font-bold">Trending</h1>
        <span className="text-[10px] font-mono px-2 py-1 rounded border border-signal/40 text-signal">
          DEMO
        </span>
      </div>
      <p className="text-[11px] text-muted font-mono mb-3">
        Live ticker &amp; CA detection from the demo feed
      </p>

      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 mb-5">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 text-xs font-mono px-3 py-1.5 rounded-full border ${
              filter === f ? 'border-signal text-signal' : 'border-line text-muted'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-muted font-mono py-10 text-center">
          Scanning feed for tickers and contract addresses...
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted font-mono py-10 text-center">
          Nothing detected in this filter yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((token) => (
            <DetectedTokenCard key={token.ticker} token={token} />
          ))}
        </div>
      )}
    </div>
  );
}
