import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { DemoXDataProvider } from '@/lib/providers/demoProvider';
import { aggregateTokens } from '@/lib/detection/aggregate';
import { scoreTokens } from '@/lib/momentum';

export async function GET() {
  const provider = new DemoXDataProvider();
  const posts = await provider.fetchRecentPosts();
  const scored = scoreTokens(aggregateTokens(posts));

  const { data: connections, error } = await supabaseAdmin
    .from('telegram_connections')
    .select('id, user_id, chat_id, momentum_threshold');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  let alertsSent = 0;

  for (const conn of connections ?? []) {
    const qualifying = scored.filter((t) => t.score >= (conn.momentum_threshold ?? 80));

    for (const token of qualifying) {
      const alertType = `${token.ticker} momentum`;

      // Dedupe: don't re-alert the same ticker to the same user within 30 min.
      const { data: recent } = await supabaseAdmin
        .from('alerts')
        .select('id')
        .eq('user_id', conn.user_id)
        .eq('alert_type', alertType)
        .gte('sent_at', new Date(Date.now() - 30 * 60 * 1000).toISOString())
        .limit(1);

      if (recent && recent.length > 0) continue;

      const minutesAgo = Math.max(
        1,
        Math.floor((Date.now() - new Date(token.firstSeen).getTime()) / 60000)
      );

      const message =
        `🚨 DEGEN RADAR ALERT\n\n${token.ticker}\n\n` +
        `🔥 Momentum: ${token.score}/100\n` +
        `X mentions: ${token.totalMentions}\n` +
        `Unique accounts: ${token.uniqueAccounts}\n` +
        `KOL mentions: ${token.kolMentions}\n` +
        `CA detected: ${token.contractAddresses.length ? 'YES' : 'NO'}\n\n` +
        `First seen: ${minutesAgo} minutes ago`;

      if (botToken) {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: conn.chat_id, text: message }),
        });
      }

      await supabaseAdmin.from('alerts').insert({
        user_id: conn.user_id,
        alert_type: alertType,
      });
      alertsSent++;
    }
  }

  return NextResponse.json({ checked: connections?.length ?? 0, alertsSent });
}
