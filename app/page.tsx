import Link from 'next/link';
import SectionRow from '@/components/SectionRow';
import { demoCoins } from '@/lib/demoData';

export default function DashboardPage() {
  const hotNow = [...demoCoins].sort((a, b) => b.score - a.score);
  const fastestGrowing = [...demoCoins].sort((a, b) => b.growth5m - a.growth5m);
  const newlyDetected = [...demoCoins].sort(
    (a, b) => a.firstSeenMinutesAgo - b.firstSeenMinutesAgo
  );
  const kolActivity = demoCoins.filter((c) => c.kolMentions > 0);

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
      <SectionRow glyph="🔥" title="Hot Now" coins={hotNow} />
      <SectionRow glyph="🚀" title="Fastest Growing" coins={fastestGrowing} />
      <SectionRow glyph="🆕" title="Newly Detected" coins={newlyDetected} />
      <SectionRow glyph="🐳" title="KOL Activity" coins={kolActivity} />
    </div>
  );
}
