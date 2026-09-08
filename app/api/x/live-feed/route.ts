import { NextResponse } from 'next/server';
import { extractTickers } from '@/lib/detection/ticker';
import { extractContractAddresses } from '@/lib/detection/contractAddress';

const DEFAULT_QUERY =
  '(solana OR pumpfun OR "pump.fun" OR "$SOL") (memecoin OR "meme coin" OR "fair launch" OR "stealth launch" OR CTO OR "contract address") lang:en -is:retweet';

export async function GET(req: Request) {
  const apiKey = process.env.TWITTERAPI_IO_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'X data provider not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const account = searchParams.get('account');
  const query = account ? `from:${account}` : DEFAULT_QUERY;

  const url = `https://api.twitterapi.io/twitter/tweet/advanced_search?query=${encodeURIComponent(
    query
  )}&queryType=Latest`;

  const res = await fetch(url, { headers: { 'X-API-Key': apiKey } });
  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { error: data?.message ?? 'X data provider request failed' },
      { status: 502 }
    );
  }

  const tweets = data.tweets ?? [];
  const posts = tweets.map((t: any) => {
    const username = t.author?.userName ?? t.author?.username ?? 'unknown';
    const displayName = t.author?.name ?? username;
    const text = t.text ?? '';
    return {
      id: t.id,
      username,
      displayName,
      category: 'Community',
      avatarColor: '#8B7CFF',
      content: text,
      postedAt: new Date(t.createdAt).toISOString(),
      likes: t.likeCount ?? 0,
      reposts: t.retweetCount ?? 0,
      replies: t.replyCount ?? 0,
      tickers: extractTickers(text),
      contractAddresses: extractContractAddresses(text),
    };
  });

  return NextResponse.json({ posts });
}
