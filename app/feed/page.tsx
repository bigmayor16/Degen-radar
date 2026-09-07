'use client';

import { useEffect, useMemo, useState } from 'react';
import { getXDataProvider } from '@/lib/providers';
import type { XPost } from '@/lib/providers/types';
import PostCard from '@/components/PostCard';

const filters = ['All', 'KOLs', 'CA Detected', 'High Engagement', 'Fastest Growing'] as const;
type Filter = (typeof filters)[number];

export default function FeedPage() {
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

  const filtered = useMemo(() => {
    switch (filter) {
      case 'KOLs':
        return posts.filter((p) => p.category === 'KOL');
      case 'CA Detected':
        return posts.filter((p) => p.contractAddresses.length > 0);
      case 'High Engagement':
        return [...posts].sort((a, b) => b.likes - a.likes);
      case 'Fastest Growing':
        return [...posts].sort((a, b) => b.reposts - a.reposts);
      default:
        return posts;
    }
  }, [posts, filter]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-lg font-bold">Live X Feed</h1>
        <span className="text-[10px] font-mono px-2 py-1 rounded border border-signal/40 text-signal">
          DEMO
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 mb-4">
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
          Scanning feed...
        </p>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
