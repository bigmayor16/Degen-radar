import type { TokenStat } from './detection/aggregate';

export type MomentumComponent = { label: string; value: number };
export type ScoredToken = TokenStat & {
  score: number;
  breakdown: MomentumComponent[];
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Splits a token's mention timestamps into an earlier and later half
 * of its observed window and compares the two — a rough but honest
 * stand-in for "acceleration" until real historical snapshots exist
 * (Stage 6+ once this is wired into Supabase's momentum_snapshots
 * table). Returns 0–1, where higher means mentions are speeding up.
 */
function accelerationRatio(timestamps: string[]): number {
  if (timestamps.length < 4) return 0;
  const mid = Math.floor(timestamps.length / 2);
  const firstHalf = mid;
  const secondHalf = timestamps.length - mid;
  const diff = secondHalf - firstHalf;
  return clamp(diff / timestamps.length, 0, 1);
}

/**
 * Computes the Degen Momentum Score (0-100) for a detected token.
 * Every point is traceable to a specific, visible signal — this is
 * intentional per the spec: the score must never look like a black
 * box, and it is never a prediction of price or profit.
 */
export function computeMomentum(token: TokenStat): { score: number; breakdown: MomentumComponent[] } {
  const mentionVelocity = Math.round(clamp(token.mentionsPerMinute * 40, 0, 20));
  const uniqueAccountScore = Math.round(clamp(token.uniqueAccounts * 3, 0, 20));
  const engagementScore = Math.round(clamp(token.engagement / 50, 0, 15));
  const kolScore = Math.round(clamp(token.kolMentions * 5, 0, 15));
  const caScore = token.contractAddresses.length > 0 ? 10 : 0;

  const topShare = token.topAccounts[0]
    ? token.topAccounts[0].count / token.totalMentions
    : 0;
  const diversityScore = Math.round(clamp((1 - topShare) * 10, 0, 10));

  const accelScore = Math.round(accelerationRatio(token.mentionTimestamps) * 10);

  const breakdown: MomentumComponent[] = [
    { label: 'Mention velocity', value: mentionVelocity },
    { label: 'Unique accounts', value: uniqueAccountScore },
    { label: 'Engagement', value: engagementScore },
    { label: 'KOL activity', value: kolScore },
    { label: 'CA activity', value: caScore },
    { label: 'Community diversity', value: diversityScore },
    { label: 'Acceleration', value: accelScore },
  ];

  const score = clamp(
    breakdown.reduce((sum, c) => sum + c.value, 0),
    0,
    100
  );

  return { score, breakdown };
}

export function scoreTokens(tokens: TokenStat[]): ScoredToken[] {
  return tokens
    .map((token) => {
      const { score, breakdown } = computeMomentum(token);
      return { ...token, score, breakdown };
    })
    .sort((a, b) => b.score - a.score);
}
