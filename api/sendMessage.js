export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { text, uid } = req.body;
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.ADMIN_CHAT_ID; // Add your Telegram ID here

  const message = `🆔 UID: ${uid}\n💬 ${text}`;

  const telegramRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
    }),
  });

  const data = await telegramRes.json();

  if (data.ok) {
    res.status(200).json({ success: true });
  } else {
    res.status(500).json({ success: false, error: data });
  }
}
