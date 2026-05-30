import dotenv from 'dotenv';
import crypto from 'crypto';
import cors from 'cors';
import express from 'express';

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors({ origin: ['https://localhost:4173', 'https://127.0.0.1:4173'] }));
app.use(express.json());

function parseInitData(initData: string) {
  return new URLSearchParams(initData);
}

function validateTelegramInitData(initData: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    throw new Error('Server environment missing TELEGRAM_BOT_TOKEN');
  }

  const params = parseInitData(initData);
  const hash = params.get('hash');

  if (!hash) {
    return false;
  }

  const secretKey = crypto.createHash('sha256').update(botToken).digest();
  const dataCheckString = Array.from(params.entries())
    .filter(([key]) => key !== 'hash')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const computedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
  return computedHash === hash;
}

function telegramInitMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const { initData } = req.body;

  if (typeof initData !== 'string' || !initData.trim()) {
    return res.status(400).json({ error: 'initData is required' });
  }

  try {
    const valid = validateTelegramInitData(initData);
    if (!valid) {
      return res.status(401).json({ error: 'Telegram initData validation failed' });
    }
    return next();
  } catch (error) {
    console.error('Telegram validation error:', error);
    return res.status(500).json({ error: 'Telegram validation failed' });
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'pick-me-up-tg-game backend' });
});

app.post('/auth', telegramInitMiddleware, (req, res) => {
  const { initData } = req.body;

  return res.json({
    message: 'Telegram initData validated successfully',
    initData,
  });
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
