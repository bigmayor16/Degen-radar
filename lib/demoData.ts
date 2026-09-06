export type MomentumComponent = { label: string; value: number };

export type Coin = {
  ticker: string;
  score: number;
  mentions: number;
  uniqueAccounts: number;
  growth5m: number;
  kolMentions: number;
  caDetected: boolean;
  contractAddress?: string;
  firstSeenMinutesAgo: number;
  breakdown: MomentumComponent[];
  history: { t: string; mentions: number }[];
};

export const demoCoins: Coin[] = [
  {
    ticker: '$FROGE',
    score: 91,
    mentions: 184,
    uniqueAccounts: 63,
    growth5m: 47,
    kolMentions: 5,
    caDetected: true,
    contractAddress: '7xKXtg2CW8...pump',
    firstSeenMinutesAgo: 14,
    breakdown: [
      { label: 'Mention velocity', value: 25 },
      { label: 'Unique accounts', value: 20 },
      { label: 'Engagement', value: 18 },
      { label: 'KOL activity', value: 14 },
      { label: 'CA activity', value: 10 },
      { label: 'Acceleration', value: 4 },
    ],
    history: [
      { t: '-20m', mentions: 12 },
      { t: '-15m', mentions: 28 },
      { t: '-10m', mentions: 61 },
      { t: '-5m', mentions: 118 },
      { t: 'now', mentions: 184 },
    ],
  },
  {
    ticker: '$NUKEDOG',
    score: 76,
    mentions: 96,
    uniqueAccounts: 41,
    growth5m: 32,
    kolMentions: 2,
    caDetected: true,
    contractAddress: '9wLpMz4Fh...bonk',
    firstSeenMinutesAgo: 26,
    breakdown: [
      { label: 'Mention velocity', value: 20 },
      { label: 'Unique accounts', value: 16 },
      { label: 'Engagement', value: 14 },
      { label: 'KOL activity', value: 8 },
      { label: 'CA activity', value: 12 },
      { label: 'Acceleration', value: 6 },
    ],
    history: [
      { t: '-20m', mentions: 8 },
      { t: '-15m', mentions: 19 },
      { t: '-10m', mentions: 40 },
      { t: '-5m', mentions: 71 },
      { t: 'now', mentions: 96 },
    ],
  },
  {
    ticker: '$SOLKITTY',
    score: 58,
    mentions: 52,
    uniqueAccounts: 29,
    growth5m: 18,
    kolMentions: 1,
    caDetected: false,
    firstSeenMinutesAgo: 41,
    breakdown: [
      { label: 'Mention velocity', value: 14 },
      { label: 'Unique accounts', value: 12 },
      { label: 'Engagement', value: 10 },
      { label: 'KOL activity', value: 4 },
      { label: 'CA activity', value: 0 },
      { label: 'Acceleration', value: 18 },
    ],
    history: [
      { t: '-20m', mentions: 6 },
      { t: '-15m', mentions: 15 },
      { t: '-10m', mentions: 27 },
      { t: '-5m', mentions: 38 },
      { t: 'now', mentions: 52 },
    ],
  },
];
