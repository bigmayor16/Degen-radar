'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getXDataProvider } from '@/lib/providers';
import type { XPost } from '@/lib/providers/types';
import { aggregateTokens } from '@/lib/detection/aggregate';
import { scoreTokens, type ScoredToken } from '@/lib/momentum';
import DetectedTokenCard from '@/components/DetectedTokenCard';

function SectionRow({
  glyph,
  title,
  tokens,
}: {
  glyph: string;
  title: string;
  tokens: ScoredToken[];
}) {
  if (tokens.length === 0) return null;
  return (
    <section className="mb-6">
      <div className="flex items-baseline gap-2 mb-2.5">
        <span className="text-signal">{glyph}</span>
        <h2 className="text-sm font-bold tracking-tight">{title}</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4">
        {tokens.map((token) => (
          <div key={token.ticker} className="w-[240px] shrink-0">
            <DetectedTokenCard token={token} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function DashboardPage() {
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

  const hotNow = [...scored].sort((a, b) => b.score - a.score).slice(0, 6);
  const fastestGrowing = [...scored]
    .sort((a, b) => b.mentionsPerMinute - a.mentionsPerMinute)
    .slice(0, 6);
  const newlyDetected = [...scored]
    .sort((a, b) => new Date(b.firstSeen).getTime() - new Date(a.firstSeen).getTime())
    .slice(0, 6);
  const kolActivity = scored.filter((t) => t.kolMentions > 0).slice(0, 6);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs text-muted font-mono">
          Scanning demo feed · refreshes every 60s once live
        </p>
        <Link href="/feed" className="text-xs font-mono text-signal shrink-0 ml-2">
          Live Feed →
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-muted font-mono py-10 text-center">
          Scanning feed and scoring momentum...
        </p>
      ) : (
        <>
          <SectionRow glyph="🔥" title="Hot Now" tokens={hotNow} />
          <SectionRow glyph="🚀" title="Fastest Growing" tokens={fastestGrowing} />
          <SectionRow glyph="🆕" title="Newly Detected" tokens={newlyDetected} />
          <SectionRow glyph="🐳" title="KOL Activity" tokens={kolActivity} />
        </>
      )}
    </div>
  );
}
