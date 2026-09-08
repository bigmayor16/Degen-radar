'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type TrackedAccount = {
  id: string;
  username: string;
  category: string;
  followers: number | null;
  is_paused: boolean;
};

type Keyword = {
  id: string;
  keyword: string;
};

const CATEGORIES = [
  'KOL',
  'Degen Caller',
  'Developer',
  'Meme Page',
  'Influencer',
  'Community',
  'Other',
];

const categoryColor: Record<string, string> = {
  KOL: 'text-kol border-kol/40',
  'Degen Caller': 'text-signal border-signal/40',
  Developer: 'text-danger border-danger/40',
  'Meme Page': 'text-growth border-growth/40',
  Influencer: 'text-kol border-kol/40',
  Community: 'text-growth border-growth/40',
  Other: 'text-muted border-line',
};

export default function AccountsPage() {
  const [tab, setTab] = useState<'accounts' | 'keywords'>('accounts');
  const [accounts, setAccounts] = useState<TrackedAccount[]>([]);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newCategory, setNewCategory] = useState('KOL');
  const [saving, setSaving] = useState(false);

  const [newKeyword, setNewKeyword] = useState('');

  async function loadData() {
    setLoading(true);
    setError('');
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setLoading(false);
      return;
    }

    const [{ data: accs, error: accErr }, { data: kws, error: kwErr }] = await Promise.all([
      supabase
        .from('tracked_accounts')
        .select('id, username, category, followers, is_paused')
        .order('created_at', { ascending: false }),
      supabase
        .from('keywords')
        .select('id, keyword')
        .order('created_at', { ascending: false }),
    ]);

    if (accErr || kwErr) setError((accErr || kwErr)!.message);
    setAccounts(accs ?? []);
    setKeywords(kws ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function addAccount() {
    if (!newUsername.trim()) return;
    setSaving(true);
    setError('');
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { error: insertErr } = await supabase.from('tracked_accounts').insert({
      user_id: userData.user.id,
      username: newUsername.replace('@', '').trim(),
      category: newCategory,
      is_paused: false,
    });

    setSaving(false);
    if (insertErr) return setError(insertErr.message);
    setNewUsername('');
    setShowAddAccount(false);
    loadData();
  }

  async function removeAccount(id: string) {
    await supabase.from('tracked_accounts').delete().eq('id', id);
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  }

  async function togglePause(account: TrackedAccount) {
    await supabase
      .from('tracked_accounts')
      .update({ is_paused: !account.is_paused })
      .eq('id', account.id);
    setAccounts((prev) =>
      prev.map((a) => (a.id === account.id ? { ...a, is_paused: !a.is_paused } : a))
    );
  }

  async function addKeyword() {
    if (!newKeyword.trim()) return;
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { error: insertErr } = await supabase.from('keywords').insert({
      user_id: userData.user.id,
      keyword: newKeyword.trim().toLowerCase(),
    });

    if (insertErr) return setError(insertErr.message);
    setNewKeyword('');
    loadData();
  }

  async function removeKeyword(id: string) {
    await supabase.from('keywords').delete().eq('id', id);
    setKeywords((prev) => prev.filter((k) => k.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold">
          {tab === 'accounts' ? 'Accounts' : 'Keywords'}
        </h1>
        {tab === 'accounts' ? (
          <button
            onClick={() => setShowAddAccount((v) => !v)}
            className="text-xs font-mono border border-signal/50 text-signal rounded-full px-3 py-1.5"
          >
            + Add
          </button>
        ) : null}
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab('accounts')}
          className={`text-xs font-mono px-3 py-1.5 rounded-full border ${
            tab === 'accounts' ? 'border-signal text-signal' : 'border-line text-muted'
          }`}
        >
          Accounts
        </button>
        <button
          onClick={() => setTab('keywords')}
          className={`text-xs font-mono px-3 py-1.5 rounded-full border ${
            tab === 'keywords' ? 'border-signal text-signal' : 'border-line text-muted'
          }`}
        >
          Keywords
        </button>
      </div>

      {error && <p className="text-xs text-danger font-mono mb-3">{error}</p>}

      {loading ? (
        <p className="text-sm text-muted font-mono py-10 text-center">Loading...</p>
      ) : tab === 'accounts' ? (
        <>
          {showAddAccount && (
            <div className="rounded-lg border border-line bg-panel p-3.5 mb-3 space-y-2.5">
              <input
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="username (without @)"
                className="w-full rounded-md border border-line bg-ink px-3 py-2 text-sm outline-none focus:border-signal"
              />
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full rounded-md border border-line bg-ink px-3 py-2 text-sm outline-none focus:border-signal"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <button
                onClick={addAccount}
                disabled={saving}
                className="w-full rounded-md bg-signal text-ink font-bold py-2 text-sm disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Add account'}
              </button>
            </div>
          )}

          {accounts.length === 0 ? (
            <p className="text-sm text-muted font-mono py-10 text-center">
              No accounts tracked yet. Tap + Add to start.
            </p>
          ) : (
            <div className="space-y-2.5">
              {accounts.map((a) => (
                <div
                  key={a.id}
                  className="rounded-lg border border-line bg-panel p-3.5 flex items-center justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-sm truncate">
                      @{a.username}
                      {a.is_paused && (
                        <span className="ml-2 text-[10px] text-muted">paused</span>
                      )}
                    </p>
                    <span
                      className={`inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded-full border ${categoryColor[a.category]}`}
                    >
                      {a.category}
                    </span>
                  </div>
                  <div className="flex gap-2 shrink-0 ml-2">
                    <button
                      onClick={() => togglePause(a)}
                      className="text-[10px] font-mono border border-line text-muted rounded-md px-2 py-1.5"
                    >
                      {a.is_paused ? 'Resume' : 'Pause'}
                    </button>
                    <button
                      onClick={() => removeAccount(a.id)}
                      className="text-[10px] font-mono border border-danger/40 text-danger rounded-md px-2 py-1.5"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex gap-2 mb-4">
            <input
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
              placeholder="e.g. fair launch, stealth launch, CA"
              className="flex-1 rounded-md border border-line bg-panel px-3 py-2 text-sm outline-none focus:border-signal"
            />
            <button
              onClick={addKeyword}
              className="text-xs font-mono border border-signal/50 text-signal rounded-md px-3"
            >
              Add
            </button>
          </div>

          {keywords.length === 0 ? (
            <p className="text-sm text-muted font-mono py-10 text-center">
              No keywords yet. Add ones you want flagged, like &quot;fair launch&quot; or &quot;CTO&quot;.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {keywords.map((k) => (
                <span
                  key={k.id}
                  className="flex items-center gap-2 text-xs font-mono border border-line bg-panel rounded-full pl-3 pr-2 py-1.5"
                >
                  {k.keyword}
                  <button
                    onClick={() => removeKeyword(k.id)}
                    className="text-danger"
                    aria-label="Remove keyword"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
                       }
