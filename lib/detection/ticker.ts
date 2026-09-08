// Cashtags that show up in casual conversation but are almost never
// the memecoin being talked about — filtering these out is exactly
// the "don't assume every $WORD is a cryptocurrency" requirement.
const NON_TICKER_BLOCKLIST = new Set([
  '$USD', '$EUR', '$GBP', '$JPY', '$CAD', '$AUD',
  '$SPX', '$NASDAQ', '$DOW', '$VIX', '$SPY', '$QQQ', '$DIA', '$IWM',
  '$MAG7', '$FAANG',
  // Common stock tickers that occasionally get swept up by loose
  // "meme"/"gem"/"launch" search queries — these are never the
  // Solana memecoin the app is trying to detect.
  '$MSFT', '$AAPL', '$GOOGL', '$GOOG', '$TSLA', '$AMZN', '$META',
  '$NVDA', '$NFLX', '$AMD', '$INTC', '$BABA', '$DIS', '$KO',
  // Common hype/filler words people write with a $ for emphasis —
  // these show up constantly in crypto-adjacent chatter but are
  // essentially never the name of an actual token.
  '$JUST', '$THIS', '$THAT', '$WOW', '$LOL', '$LMAO', '$IMO', '$NGL',
  '$FR', '$REAL', '$YOLO', '$WTF', '$OMG', '$BTW', '$IDK', '$ASAP',
  '$GM', '$GN', '$SOON', '$NOW', '$HERE', '$WHY', '$HOW', '$WHAT',
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
