// Cashtags that show up in casual conversation but are almost never
// the memecoin being talked about — filtering these out is exactly
// the "don't assume every $WORD is a cryptocurrency" requirement.
const NON_TICKER_BLOCKLIST = new Set([
  '$USD', '$EUR', '$GBP', '$JPY', '$CAD', '$AUD',
  '$SPX', '$NASDAQ', '$DOW', '$VIX',
]);

/**
 * Extracts likely ticker cashtags from a post's text.
 * Requires: starts with $, starts with a letter (not a number —
 * rules out "$100"), 2–10 characters, mostly uppercase (the
 * convention real memecoin tickers follow). Anything matching the
 * blocklist above is dropped as a known non-crypto cashtag.
 */
export function extractTickers(content: string): string[] {
  const matches = content.match(/\$[A-Z][A-Z0-9]{1,9}\b/g) ?? [];
  const unique = Array.from(new Set(matches));
  return unique.filter((t) => !NON_TICKER_BLOCKLIST.has(t));
}
