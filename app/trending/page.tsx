import CoinCard from '@/components/CoinCard';
import { demoCoins } from '@/lib/demoData';

const filters = ['All', 'KOLs', 'CA Detected', 'High Engagement', 'Fastest Growing'];

export default function TrendingPage() {
  return (
    <div>
      <h1 className="text-lg font-bold mb-3">Trending</h1>
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 mb-5">
        {filters.map((f, i) => (
          <button
            key={f}
            className={`shrink-0 text-xs font-mono px-3 py-1.5 rounded-full border ${
              i === 0
                ? 'border-signal text-signal'
                : 'border-line text-muted'
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {demoCoins.map((coin) => (
          <CoinCard key={coin.ticker} coin={coin} />
        ))}
      </div>
    </div>
  );
}
