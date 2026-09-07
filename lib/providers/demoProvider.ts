import type { AccountCategory, XDataProvider, XPost } from './types';

// Deterministic seeded RNG (mulberry32) so the "live" feed looks
// consistent within a time window instead of re-randomizing on
// every render, but still changes as real time passes.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type FakeAccount = {
  username: string;
  displayName: string;
  category: AccountCategory;
  avatarColor: string;
};

const ACCOUNTS: FakeAccount[] = [
  { username: 'solwhale_alerts', displayName: 'Sol Whale Alerts', category: 'KOL', avatarColor: '#8B7CFF' },
  { username: 'degencaller_x', displayName: 'Degen Caller X', category: 'Degen Caller', avatarColor: '#FFB020' },
  { username: 'memepagesol', displayName: 'Meme Page SOL', category: 'Meme Page', avatarColor: '#2DD4BF' },
  { username: 'basedbuilder', displayName: 'Based Builder', category: 'Developer', avatarColor: '#FF5C5C' },
  { username: 'cryptonads_', displayName: 'Crypto Nads', category: 'Influencer', avatarColor: '#8B7CFF' },
  { username: 'degenhq', displayName: 'Degen HQ', category: 'Community', avatarColor: '#2DD4BF' },
  { username: 'pumpwatcher', displayName: 'Pump Watcher', category: 'KOL', avatarColor: '#FFB020' },
  { username: 'ratiogod', displayName: 'Ratio God', category: 'Degen Caller', avatarColor: '#FF5C5C' },
  { username: 'solstitiontrades', displayName: 'Solstition', category: 'Influencer', avatarColor: '#8B7CFF' },
  { username: 'anon_ape_sol', displayName: 'Anon Ape', category: 'Community', avatarColor: '#2DD4BF' },
];

const TICKER_POOL = [
  '$FROGE', '$NUKEDOG', '$SOLKITTY', '$MOONCAT', '$RUGKING',
  '$BONKZILLA', '$PEPESOL', '$GIGACHAD', '$SADHAMSTER', '$WOJAKX',
  '$LASERCAT', '$DEGENAPE', '$SOLPUPPY', '$CHADCOIN', '$FUDBEAR',
];

const CONTENT_TEMPLATES = [
  (t: string) => `${t} is about to send. chart looks primed 👀`,
  (t: string) => `just aped into ${t}, this feels different`,
  (t: string) => `${t} community is cooking rn, volume picking up fast`,
  (t: string) => `keep an eye on ${t} — mentions climbing every few minutes`,
  (t: string) => `${t} CA is spreading fast across CT, careful with size`,
  (t: string) => `not financial advice but ${t} chart is looking bullish`,
  (t: string) => `${t} fair launch was clean, no team allocation visible on chain`,
  (t: string) => `everyone's talking about ${t} today, early or late?`,
  (t: string) => `${t} liquidity locked, holders growing steadily`,
  (t: string) => `${t} just got picked up by a few bigger accounts`,
];

function fakeContractAddress(rand: () => number, ticker: string): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  let out = '';
  for (let i = 0; i < 10; i++) out += chars[Math.floor(rand() * chars.length)];
  const suffix = rand() > 0.5 ? 'pump' : 'bonk';
  return `${out}${suffix}`;
}

export class DemoXDataProvider implements XDataProvider {
  async fetchRecentPosts(): Promise<XPost[]> {
    // Bucket time into 5-minute windows so the feed feels "live"
    // (new posts appear every few minutes) without a real backend.
    const bucket = Math.floor(Date.now() / (5 * 60 * 1000));
    const rand = mulberry32(bucket);
    const postCount = 14 + Math.floor(rand() * 8);
    const posts: XPost[] = [];

    // A handful of "hot" tickers get reused across multiple posts
    // in this window so mention counts actually accumulate.
    const hotTickers = [...TICKER_POOL]
      .sort(() => rand() - 0.5)
      .slice(0, 4);

    for (let i = 0; i < postCount; i++) {
      const account = ACCOUNTS[Math.floor(rand() * ACCOUNTS.length)];
      const useHot = rand() > 0.35;
      const ticker = useHot
        ? hotTickers[Math.floor(rand() * hotTickers.length)]
        : TICKER_POOL[Math.floor(rand() * TICKER_POOL.length)];
      const template = CONTENT_TEMPLATES[Math.floor(rand() * CONTENT_TEMPLATES.length)];
      const hasCA = rand() > 0.5;
      const minutesAgo = Math.floor(rand() * 45);

      posts.push({
        id: `${bucket}-${i}`,
        username: account.username,
        displayName: account.displayName,
        category: account.category,
        avatarColor: account.avatarColor,
        content: template(ticker),
        postedAt: new Date(Date.now() - minutesAgo * 60 * 1000).toISOString(),
        likes: Math.floor(rand() * 400),
        reposts: Math.floor(rand() * 120),
        replies: Math.floor(rand() * 60),
        tickers: [ticker],
        contractAddresses: hasCA ? [fakeContractAddress(rand, ticker)] : [],
      });
    }

    return posts.sort(
      (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
    );
  }

  async fetchPostsForAccount(username: string): Promise<XPost[]> {
    const all = await this.fetchRecentPosts();
    return all.filter((p) => p.username === username);
  }
                      }
