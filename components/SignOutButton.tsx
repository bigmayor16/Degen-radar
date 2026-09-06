'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace('/login');
  }

  return (
    <button
      onClick={handleSignOut}
      className="w-full text-sm font-mono border border-danger/50 text-danger rounded-lg py-2.5 mt-6"
    >
      Log out
    </button>
  );
}
