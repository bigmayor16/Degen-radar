import type { Coin } from '@/lib/demoData';
import CoinCard from './CoinCard';

export default function SectionRow({
  glyph,
  title,
  coins,
}: {
  glyph: string;
  title: string;
  coins: Coin[];
}) {
  return (
    <section className="mb-6">
      <div className="flex items-baseline gap-2 mb-2.5">
        <span className="text-signal">{glyph}</span>
        <h2 className="text-sm font-bold tracking-tight">{title}</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4">
        {coins.map((coin) => (
          <CoinCard key={coin.ticker} coin={coin} className="w-[240px] shrink-0" />
        ))}
      </div>
    </section>
  );
}
