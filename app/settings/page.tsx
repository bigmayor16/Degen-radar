'use client';

import { useEffect, useState } from 'react';
import SignOutButton from '@/components/SignOutButton';
import { supabase } from '@/lib/supabaseClient';
import { getProviderMode, setProviderMode, type ProviderMode } from '@/lib/providers';

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
  const [providerMode, setProviderModeState] = useState<ProviderMode>('demo');

  const [chatId, setChatId] = useState('');
  const [threshold, setThreshold] = useState(80);
  const [telegramSaved, setTelegramSaved] = useState(false);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setProviderModeState(getProviderMode());
  }, []);

  useEffect(() => {
    async function load() {
      const [{ count: accCount }, { count: kwCount }, telegram] = await Promise.all([
        supabase.from('tracked_accounts').select('id', { count: 'exact', head: true }),
        supabase.from('keywords').select('id', { count: 'exact', head: true }),
        supabase.from('telegram_connections').select('chat_id, momentum_threshold').maybeSingle(),
      ]);
      setAccountCount(accCount ?? 0);
      setKeywordCount(kwCount ?? 0);
      if (telegram.data) {
        setChatId(telegram.data.chat_id);
        setThreshold(telegram.data.momentum_threshold ?? 80);
        setTelegramSaved(true);
      }
    }
    load();
  }, []);

  async function findChatId() {
    setBusy(true);
    setStatus('');
    try {
      const res = await fetch('/api/telegram/find-chat-id');
      const data = await res.json();
      if (!res.ok) {
        setStatus(data.error ?? 'Could not find chat ID.');
      } else {
        setChatId(data.chatId);
        setStatus(`Found chat for @${data.username}. Tap Save to connect it.`);
      }
    } catch {
      setStatus('Something went wrong. Try again.');
    }
    setBusy(false);
  }

  async function saveTelegram() {
    if (!chatId.trim()) return setStatus('Enter or find a chat ID first.');
    setBusy(true);
    setStatus('');
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { error } = await supabase.from('telegram_connections').upsert(
      {
        user_id: userData.user.id,
        chat_id: chatId.trim(),
        momentum_threshold: threshold,
      },
      { onConflict: 'user_id' }
    );

    setBusy(false);
    if (error) return setStatus(error.message);
    setTelegramSaved(true);
    setStatus('Telegram connected.');
  }

  async function sendTestAlert() {
    setBusy(true);
    setStatus('');
    try {
      const res = await fetch('/api/telegram/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId }),
      });
      const data = await res.json();
      setStatus(res.ok ? 'Test alert sent — check Telegram.' : data.error);
    } catch {
      setStatus('Something went wrong sending the test alert.');
    }
    setBusy(false);
  }

  return (
    <div>
      <h1 className="text-lg font-bold mb-4">Settings</h1>

      <h2 className="text-xs font-bold text-muted mb-1 mt-5">Data source</h2>
      <div className="rounded-lg border border-line bg-panel p-3.5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm">X data provider</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => {
                setProviderMode('demo');
                setProviderModeState('demo');
              }}
              className={`text-[11px] font-mono px-2.5 py-1 rounded-full border ${
                providerMode === 'demo'
                  ? 'border-signal text-signal'
                  : 'border-line text-muted'
              }`}
            >
              Demo
            </button>
            <button
              onClick={() => {
                setProviderMode('live');
                setProviderModeState('live');
              }}
              className={`text-[11px] font-mono px-2.5 py-1 rounded-full border ${
                providerMode === 'live'
                  ? 'border-signal text-signal'
                  : 'border-line text-muted'
              }`}
            >
              Live
            </button>
          </div>
        </div>
        {providerMode === 'live' && (
          <p className="text-[10px] text-muted font-mono">
            Live mode uses your X API credits — each refresh costs a small amount.
          </p>
        )}
        <div className="mt-3">
          <Row label="Refresh interval" value="60s" />
        </div>
      </div>

      <h2 className="text-xs font-bold text-muted mb-1 mt-5">Telegram alerts</h2>
      <div className="rounded-lg border border-line bg-panel p-3.5 space-y-3">
        <Row label="Status" value={telegramSaved ? 'Connected' : 'Not connected'} />

        {!telegramSaved && (
          <p className="text-[11px] text-muted font-mono">
            1. Open Telegram, find your bot, and send it <span className="text-fog">/start</span>.
            2. Then tap Find Chat ID below.
          </p>
        )}

        <button
          onClick={findChatId}
          disabled={busy}
          className="w-full text-xs font-mono border border-line text-fog rounded-md py-2 disabled:opacity-50"
        >
          Find my Chat ID
        </button>

        <input
          value={chatId}
          onChange={(e) => setChatId(e.target.value)}
          placeholder="Chat ID"
          className="w-full rounded-md border border-line bg-ink px-3 py-2 text-sm font-mono outline-none focus:border-signal"
        />

        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-muted">Momentum threshold</span>
          <input
            type="number"
            min={0}
            max={100}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-16 rounded-md border border-line bg-ink px-2 py-1 text-right outline-none focus:border-signal"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={saveTelegram}
            disabled={busy}
            className="flex-1 text-xs font-mono bg-signal text-ink font-bold rounded-md py-2 disabled:opacity-50"
          >
            Save
          </button>
          {telegramSaved && (
            <button
              onClick={sendTestAlert}
              disabled={busy}
              className="flex-1 text-xs font-mono border border-signal/50 text-signal rounded-md py-2 disabled:opacity-50"
            >
              Send test alert
            </button>
          )}
        </div>

        {status && <p className="text-[11px] font-mono text-growth">{status}</p>}
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
