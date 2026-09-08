'use client';

import { useEffect, useState } from 'react';
import SignOutButton from '@/components/SignOutButton';
import { supabase } from '@/lib/supabaseClient';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-line last:border-0">
      <span className="text-sm">{label}</span>
      <span className="text-xs font-mono text-muted">{value}</span>
    </div>
  );
}

export default function SettingsPage() {
  const [accountCount, setAccountCount] = useState<number | null>(null);
  const [keywordCount, setKeywordCount] = useState<number | null>(null);

  useEffect(() => {
    async function loadCounts() {
      const [{ count: accCount }, { count: kwCount }] = await Promise.all([
        supabase.from('tracked_accounts').select('id', { count: 'exact', head: true }),
        supabase.from('keywords').select('id', { count: 'exact', head: true }),
      ]);
      setAccountCount(accCount ?? 0);
      setKeywordCount(kwCount ?? 0);
    }
    loadCounts();
  }, []);

  return (
    <div>
      <h1 className="text-lg font-bold mb-4">Settings</h1>

      <h2 className="text-xs font-bold text-muted mb-1 mt-5">Data source</h2>
      <div className="rounded-lg border border-line bg-panel px-3.5">
        <Row label="X data provider" value="Demo Mode" />
        <Row label="Refresh interval" value="60s" />
      </div>

      <h2 className="text-xs font-bold text-muted mb-1 mt-5">Alerts</h2>
      <div className="rounded-lg border border-line bg-panel px-3.5">
        <Row label="Telegram" value="Not connected" />
        <Row label="Momentum threshold" value="80" />
      </div>

      <h2 className="text-xs font-bold text-muted mb-1 mt-5">Tracking</h2>
      <div className="rounded-lg border border-line bg-panel px-3.5">
        <Row
          label="Tracked accounts"
          value={accountCount === null ? '...' : String(accountCount)}
        />
        <Row
          label="Keywords"
          value={keywordCount === null ? '...' : String(keywordCount)}
        />
      </div>

      <h2 className="text-xs font-bold text-muted mb-1 mt-5">Appearance</h2>
      <div className="rounded-lg border border-line bg-panel px-3.5">
        <Row label="Theme" value="Dark" />
      </div>

      <SignOutButton />
    </div>
  );
}
