import type { XPost } from '@/lib/providers/types';

function timeAgo(iso: string) {
  const mins = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  return mins < 60 ? `${mins}m ago` : `${Math.floor(mins / 60)}h ago`;
}

const categoryColor: Record<string, string> = {
  KOL: 'text-kol',
  'Degen Caller': 'text-signal',
  'Meme Page': 'text-growth',
  Developer: 'text-danger',
  Influencer: 'text-kol',
  Community: 'text-growth',
  Other: 'text-muted',
};

export default function PostCard({ post }: { post: XPost }) {
  return (
    <div className="rounded-lg border border-line bg-panel p-3.5">
      <div className="flex items-center gap-2 mb-2">
        <span
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-ink shrink-0"
          style={{ backgroundColor: post.avatarColor }}
        >
          {post.displayName.slice(0, 2).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold truncate">{post.displayName}</p>
          <p className="text-[10px] font-mono text-muted truncate">
            @{post.username} · {timeAgo(post.postedAt)}
          </p>
        </div>
        <span
          className={`ml-auto text-[9px] font-mono shrink-0 ${categoryColor[post.category]}`}
        >
          {post.category}
        </span>
      </div>

      <p className="text-sm mb-3">{post.content}</p>

      <div className="flex items-center justify-between text-[10px] font-mono text-muted">
        <span>♥ {post.likes}</span>
        <span>↻ {post.reposts}</span>
        <span>💬 {post.replies}</span>
        {post.contractAddresses.length > 0 && (
          <span className="text-growth">CA detected</span>
        )}
      </div>
    </div>
  );
}
