import { DemoXDataProvider } from './demoProvider';
import type { XDataProvider } from './types';

let instance: XDataProvider | null = null;

/**
 * Single place the rest of the app asks for X data. Right now this
 * always returns the demo provider. In Stage 9, this becomes:
 *
 *   return process.env.NEXT_PUBLIC_X_PROVIDER === 'live'
 *     ? new LiveXDataProvider()
 *     : new DemoXDataProvider();
 *
 * No other file needs to change when that happens.
 */
export function getXDataProvider(): XDataProvider {
  if (!instance) instance = new DemoXDataProvider();
  return instance;
}

export * from './types';
