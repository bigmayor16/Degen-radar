'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) return setMessage(error.message);
      setMessage('Check your email to confirm your account, then log in.');
      setMode('login');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return setMessage(error.message);
      router.push('/');
      router.refresh();
    }
  }

  async function handleReset() {
    if (!email) return setMessage('Enter your email above first.');
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setMessage(error ? error.message : 'Password reset email sent.');
  }

  return (
    <div className="flex flex-col justify-center min-h-[70vh]">
      <h1 className="text-xl font-bold mb-1">Degen Radar</h1>
      <p className="text-sm text-muted mb-6 font-mono">
        {mode === 'login' ? 'Log in to your account' : 'Create an account'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-line bg-panel px-3.5 py-3 text-sm outline-none focus:border-signal"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-line bg-panel px-3.5 py-3 text-sm outline-none focus:border-signal"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-signal text-ink font-bold py-3 text-sm disabled:opacity-50"
        >
          {loading ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Sign up'}
        </button>
      </form>

      {message && (
        <p className="text-xs text-growth font-mono mt-3">{message}</p>
      )}

      <div className="flex items-center justify-between mt-5 text-xs font-mono">
        <button
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          className="text-signal"
        >
          {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
        </button>
        {mode === 'login' && (
          <button onClick={handleReset} className="text-muted">
            Forgot password?
          </button>
        )}
      </div>
    </div>
  );
}
