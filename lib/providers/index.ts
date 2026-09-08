import { DemoXDataProvider } from './demoProvider';
import { LiveXDataProvider } from './liveProvider';
import type { XDataProvider } from './types';

export type ProviderMode = 'demo' | 'live';
const STORAGE_KEY = 'degen-radar-x-provider-mode';

export function getProviderMode(): ProviderMode {
  if (typeof window === 'undefined') return 'demo';
  return (localStorage.getItem(STORAGE_KEY) as ProviderMode) || 'demo';
}

export function setProviderMode(mode: ProviderMode) {
  if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, mode);
}

/**
 * Single place the rest of the app asks for X data. Reads the saved
 * mode (Settings toggles this) and returns the matching provider —
 * everything downstream (Dashboard, Trending, Feed, detail page)
 * only ever calls fetchRecentPosts()/fetchPostsForAccount(), so
 * neither provider's internals leak into the UI code.
 */
export function getXDataProvider(): XDataProvider {
  return getProviderMode() === 'live' ? new LiveXDataProvider() : new DemoXDataProvider();
}

export * from './types';
