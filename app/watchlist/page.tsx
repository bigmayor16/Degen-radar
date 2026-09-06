import CoinCard from '@/components/CoinCard';
import { demoCoins } from '@/lib/demoData';

export default function WatchlistPage() {
  const watched = demoCoins.slice(0, 1);

  return (
    <div>
      <h1 className="text-lg font-bold mb-4">Watchlist</h1>
      {watched.length === 0 ? (
        <div className="text-center py-16 text-muted text-sm font-mono">
          Nothing starred yet. Tap ★ on a coin to track it here.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {watched.map((coin) => (
            <CoinCard key={coin.ticker} coin={coin} />
          ))}
        </div>
      )}
    </div>
  );
}
