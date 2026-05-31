import { Hero } from '../data/heroes';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export interface PlayerHeroEntry {
  id: string;
  hero_id: string;
  createdAt: string;
  level: number;
  stars: number;
  hero: Hero;
}

const toJson = async (response: Response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'خطأ في الاتصال بالخادم');
  }
  return response.json();
};

export async function fetchHeroCatalog(): Promise<Hero[]> {
  const response = await fetch(`${BASE_URL}/api/hero-catalog`);
  const payload = await toJson(response);
  return payload.heroes as Hero[];
}

export async function fetchPlayerHeroes(): Promise<PlayerHeroEntry[]> {
  const response = await fetch(`${BASE_URL}/api/player-heroes`);
  const payload = await toJson(response);
  return payload.heroes as PlayerHeroEntry[];
}

export async function savePlayerHero(heroId: string): Promise<PlayerHeroEntry> {
  const response = await fetch(`${BASE_URL}/api/summon`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hero_id: heroId, user_id: 'default' }),
  });
  const payload = await toJson(response);
  return payload.hero as PlayerHeroEntry;
}

export async function fetchUserTeam(userId: string) {
  const response = await fetch(`${BASE_URL}/api/team/${encodeURIComponent(userId)}`);
  const payload = await toJson(response);
  return payload.team as Array<{ user_id: string; hero_id: string; position: number }>;
}

export async function saveUserTeam(userId: string, heroId: string, position: number) {
  const response = await fetch(`${BASE_URL}/api/team/${encodeURIComponent(userId)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hero_id: heroId, position }),
  });
  return toJson(response);
}
