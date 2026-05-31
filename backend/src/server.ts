import dotenv from 'dotenv';
import crypto from 'crypto';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { availableHeroes } from './heroData.js';
import { readDb, saveDb } from './db.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4000);

const frontendDist = path.resolve(new URL('../frontend/dist', import.meta.url).pathname);
const DEFAULT_USER_ID = 'default';

app.use(cors());
app.use(express.json());

if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist, { extensions: ['html'] }));
}

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

app.get('/api/welcome', (_req, res) => {
  res.json({ message: 'Welcome to Pick Me Up TG Game backend!' });
});

app.get('/api/hero-catalog', async (_req, res) => {
  res.json({ heroes: availableHeroes });
});

app.get('/api/player-heroes', async (_req, res) => {
  const db = await readDb();
  const heroes = db.player_heroes.map((entry: any) => {
    const hero = availableHeroes.find((h) => h.id === entry.hero_id);
    return { ...entry, hero };
  });
  res.json({ heroes });
});

app.post('/api/player-heroes', async (req, res) => {
  const { hero_id } = req.body;
  if (!hero_id || typeof hero_id !== 'string') {
    return res.status(400).json({ error: 'hero_id is required' });
  }

  const hero = availableHeroes.find((h) => h.id === hero_id);
  if (!hero) {
    return res.status(400).json({ error: 'hero_id invalid' });
  }

  const db = await readDb();
  const newEntry = {
    id: `ph_${Date.now()}`,
    hero_id,
    createdAt: new Date().toISOString(),
    level: 1,
    stars: 1,
  };
  db.player_heroes.push(newEntry);
  await saveDb(db);

  res.status(201).json({ ...newEntry, hero });
});

app.post('/api/summon', async (req, res) => {
  const { hero_id, user_id = DEFAULT_USER_ID } = req.body;
  if (!hero_id || typeof hero_id !== 'string') {
    return res.status(400).json({ error: 'hero_id is required' });
  }

  const hero = availableHeroes.find((h) => h.id === hero_id);
  if (!hero) {
    return res.status(400).json({ error: 'hero_id invalid' });
  }

  const db = await readDb();
  const newEntry = {
    id: `ph_${Date.now()}`,
    hero_id,
    createdAt: new Date().toISOString(),
    level: 1,
    stars: 1,
  };
  db.player_heroes.push(newEntry);

  const existingTeam = db.team_heroes.filter((entry) => entry.user_id === user_id);
  const freePosition = [0, 1, 2, 3, 4].find((position) => !existingTeam.some((entry) => entry.position === position));
  if (freePosition !== undefined) {
    db.team_heroes.push({ user_id, hero_id, position: freePosition });
  }

  await saveDb(db);
  res.status(201).json({ hero: { ...newEntry, hero }, teamPosition: freePosition });
});

app.get('/api/team/:userId', async (req, res) => {
  const { userId } = req.params;
  const db = await readDb();
  const team = db.team_heroes
    .filter((entry) => entry.user_id === userId)
    .sort((a, b) => a.position - b.position);
  res.json({ team });
});

app.post('/api/team/:userId', async (req, res) => {
  const { userId } = req.params;
  const { hero_id, position } = req.body;

  if (!hero_id || typeof hero_id !== 'string') {
    return res.status(400).json({ error: 'hero_id is required' });
  }
  if (typeof position !== 'number' || position < 0 || position > 4) {
    return res.status(400).json({ error: 'position must be a number between 0 and 4' });
  }

  const db = await readDb();
  const existingIndex = db.team_heroes.findIndex(
    (entry) => entry.user_id === userId && entry.position === position
  );
  if (existingIndex >= 0) {
    db.team_heroes[existingIndex] = { user_id: userId, hero_id, position };
  } else {
    db.team_heroes.push({ user_id: userId, hero_id, position });
  }

  await saveDb(db);
  res.status(200).json({ userId, hero_id, position });
});

app.post('/auth', telegramInitMiddleware, (req, res) => {
  const { initData } = req.body;

  return res.json({
    message: 'Telegram initData validated successfully',
    initData,
  });
});

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  if (fs.existsSync(frontendDist)) {
    return res.sendFile(path.join(frontendDist, 'index.html'));
  }
  return res.status(404).send('Not found');
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
