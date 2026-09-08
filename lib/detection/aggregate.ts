import type { XPost } from '@/lib/providers/types';
import { extractTickers } from './ticker';
import { extractContractAddresses } from './contractAddress';

export type TokenStat = {
  ticker: string;
  totalMentions: number;
  uniqueAccounts: number;
  mentionsPerMinute: number;
  engagement: number;
  kolMentions: number;
  firstSeen: string;
  latestSeen: string;
  topAccounts: { username: string; count: number }[];
  contractAddresses: string[];
  mentionTimestamps: string[];
};

export type ContractStat = {
  address: string;
  linkedTickers: string[];
  totalMentions: number;
  uniqueAccounts: number;
  firstSeen: string;
  latestSeen: string;
  accounts: string[];
};

export function aggregateTokens(posts: XPost[]): TokenStat[] {
  const byTicker = new Map<
    string,
    {
      mentions: XPost[];
      accounts: Set<string>;
      accountCounts: Map<string, number>;
      cas: Set<string>;
      kolMentions: number;
      engagement: number;
    }
  >();

  for (const post of posts) {
    const tickers = extractTickers(post.content);
    const cas = extractContractAddresses(post.content);
    if (tickers.length === 0) continue;

    for (const ticker of tickers) {
      if (!byTicker.has(ticker)) {
        byTicker.set(ticker, {
          mentions: [],
          accounts: new Set(),
          accountCounts: new Map(),
          cas: new Set(),
          kolMentions: 0,
          engagement: 0,
        });
      }
      const entry = byTicker.get(ticker)!;
      entry.mentions.push(post);
      entry.accounts.add(post.username);
      entry.accountCounts.set(
        post.username,
        (entry.accountCounts.get(post.username) ?? 0) + 1
      );
      if (post.category === 'KOL') entry.kolMentions += 1;
      entry.engagement += post.likes + post.reposts + post.replies;
      cas.forEach((ca) => entry.cas.add(ca));
    }
  }

  const stats: TokenStat[] = [];
  byTicker.forEach((entry, ticker) => {
    const times = entry.mentions.map((p) => new Date(p.postedAt).getTime());
    const firstSeen = new Date(Math.min(...times)).toISOString();
    const latestSeen = new Date(Math.max(...times)).toISOString();
    const windowMinutes = Math.max(
      1,
      (Math.max(...times) - Math.min(...times)) / 60000
    );

    const topAccounts = Array.from(entry.accountCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([username, count]) => ({ username, count }));

    stats.push({
      ticker,
      totalMentions: entry.mentions.length,
      uniqueAccounts: entry.accounts.size,
      mentionsPerMinute: Number((entry.mentions.length / windowMinutes).toFixed(2)),
      engagement: entry.engagement,
      kolMentions: entry.kolMentions,
      firstSeen,
      latestSeen,
      topAccounts,
      contractAddresses: Array.from(entry.cas),
      mentionTimestamps: times.slice().sort((a, b) => a - b).map((t) => new Date(t).toISOString()),
    });
  });

  return stats.sort((a, b) => b.totalMentions - a.totalMentions);
}

export function aggregateContractAddresses(posts: XPost[]): ContractStat[] {
  const byCA = new Map<
    string,
    { mentions: XPost[]; accounts: Set<string>; tickers: Set<string> }
  >();

  for (const post of posts) {
    const cas = extractContractAddresses(post.content);
    const tickers = extractTickers(post.content);
    for (const ca of cas) {
      if (!byCA.has(ca)) {
        byCA.set(ca, { mentions: [], accounts: new Set(), tickers: new Set() });
      }
      const entry = byCA.get(ca)!;
      entry.mentions.push(post);
      entry.accounts.add(post.username);
      tickers.forEach((t) => entry.tickers.add(t));
    }
  }

  const stats: ContractStat[] = [];
  byCA.forEach((entry, address) => {
    const times = entry.mentions.map((p) => new Date(p.postedAt).getTime());
    stats.push({
      address,
      linkedTickers: Array.from(entry.tickers),
      totalMentions: entry.mentions.length,
      uniqueAccounts: entry.accounts.size,
      firstSeen: new Date(Math.min(...times)).toISOString(),
      latestSeen: new Date(Math.max(...times)).toISOString(),
      accounts: Array.from(entry.accounts),
    });
  });

  return stats.sort((a, b) => b.totalMentions - a.totalMentions);
}
