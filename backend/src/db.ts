import fs from 'fs/promises';
import path from 'path';

const filePath = path.resolve(new URL('../data/db.json', import.meta.url).pathname);

interface DatabaseModel {
  player_heroes: Array<Record<string, unknown>>;
  team_heroes: Array<{ user_id: string; hero_id: string; position: number }>;
}

const DEFAULT_DB: DatabaseModel = {
  player_heroes: [],
  team_heroes: [],
};

export async function readDb(): Promise<DatabaseModel> {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content) as DatabaseModel;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(DEFAULT_DB, null, 2), 'utf8');
      return DEFAULT_DB;
    }
    throw error;
  }
}

export async function saveDb(database: DatabaseModel): Promise<DatabaseModel> {
  await fs.writeFile(filePath, JSON.stringify(database, null, 2), 'utf8');
  return database;
}
