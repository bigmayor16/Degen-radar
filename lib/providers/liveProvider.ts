import type { XDataProvider, XPost } from './types';

export class LiveXDataProvider implements XDataProvider {
  async fetchRecentPosts(): Promise<XPost[]> {
    const res = await fetch('/api/x/live-feed');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Failed to fetch live X data');
    return data.posts as XPost[];
  }

  async fetchPostsForAccount(username: string): Promise<XPost[]> {
    const res = await fetch(`/api/x/live-feed?account=${encodeURIComponent(username)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Failed to fetch live X data');
    return data.posts as XPost[];
  }
}
