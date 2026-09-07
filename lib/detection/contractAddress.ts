// Solana addresses are base58: no 0, O, I, or l, typically 32–44
// characters. This is a shape check, not a validity check — it
// flags "looks like a Solana CA" for a human to verify on
// DEX Screener / Solscan, it never interacts with the address.
const CA_PATTERN = /\b[1-9A-HJ-NP-Za-km-z]{32,44}\b/g;

export function extractContractAddresses(content: string): string[] {
  const matches = content.match(CA_PATTERN) ?? [];
  return Array.from(new Set(matches));
}
