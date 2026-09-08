import { NextResponse } from 'next/server';

export async function GET() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return NextResponse.json({ error: 'Bot token not configured' }, { status: 500 });
  }

  const res = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates`);
  const data = await res.json();
  const messages = data.result ?? [];
  const last = messages[messages.length - 1];

  if (!last) {
    return NextResponse.json(
      { error: 'No messages found yet. Send /start to your bot on Telegram first, then try again.' },
      { status: 404 }
    );
  }

  const chat = last.message?.chat ?? last.channel_post?.chat;
  if (!chat) {
    return NextResponse.json({ error: 'Could not read chat info from bot updates.' }, { status: 404 });
  }

  return NextResponse.json({
    chatId: String(chat.id),
    username: chat.username ?? chat.first_name ?? 'unknown',
  });
}
