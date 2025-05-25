import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { text, username } = req.body;
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    res.status(500).json({ error: 'Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID' });
    return;
  }

  if (!text || !text.trim()) {
    res.status(400).json({ error: 'Missing message text' });
    return;
  }

  const message = `Message from ${username}:\n${text}`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message })
    });

    const data = await response.json();

    if (!data.ok) {
      res.status(500).json({ error: data.description || 'Telegram API error' });
      return;
    }

    res.status(200).json({ success: true, result: data.result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
