export type AccountCategory =
  | 'KOL'
  | 'Degen Caller'
  | 'Developer'
  | 'Meme Page'
  | 'Influencer'
  | 'Community'
  | 'Other';

export type XPost = {
  id: string;
  username: string;
  displayName: string;
  category: AccountCategory;
  avatarColor: string;
  content: string;
  postedAt: string; // ISO timestamp
  likes: number;
  reposts: number;
  replies: number;
  tickers: string[];
  contractAddresses: string[];
};

/**
 * XDataProvider is the abstraction the rest of the app talks to.
 * Swap DemoXDataProvider for a real X-API-backed provider later
 * (Stage 9) without touching any UI code — everything downstream
 * only ever calls these two methods.
 */
export interface XDataProvider {
  /** Returns a fresh batch of recent posts across the whole feed. */
  fetchRecentPosts(): Promise<XPost[]>;
  /** Returns recent posts filtered to a specific tracked username. */
  fetchPostsForAccount(username: string): Promise<XPost[]>;
}
