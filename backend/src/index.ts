import express from 'express';

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'pick-me-up-tg-game backend' });
});

app.get('/api/welcome', (_req, res) => {
  res.json({ message: 'Welcome to Pick Me Up TG Game backend!' });
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
