import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { chatId } = await req.json();
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken) {
    return NextResponse.json({ error: 'Bot token not configured' }, { status: 500 });
  }
  if (!chatId) {
    return NextResponse.json({ error: 'Missing chat ID' }, { status: 400 });
  }

  const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: '🚨 DEGEN RADAR\n\nThis is a test alert. Your Telegram connection is working!',
    }),
  });

  const data = await res.json();
  if (!data.ok) {
    return NextResponse.json({ error: data.description ?? 'Telegram API error' }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
