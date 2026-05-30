import create from 'zustand';
import { availableHeroes, Hero } from '../data/heroes';

interface GameState {
  gems: number;
  tickets: number;
  collection: Hero[];
  party: string[];
  lastDailyClaim: string | null;
  dailyMessage: string;
  claimDailyReward: () => void;
  addHeroToCollection: (hero: Hero) => void;
  summonWithTickets: (hero: Hero) => boolean;
  summonWithGems: (hero: Hero) => boolean;
  togglePartyMember: (heroId: string) => void;
  removePartyMember: (heroId: string) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  gems: 420,
  tickets: 28,
  collection: [availableHeroes[0], availableHeroes[5]],
  party: [availableHeroes[0].id],
  lastDailyClaim: null,
  dailyMessage: '',

  claimDailyReward: () => {
    const today = new Date().toISOString().slice(0, 10);
    if (get().lastDailyClaim === today) {
      set(() => ({ dailyMessage: 'لقد حصلت على مكافئتك اليوم بالفعل.' }));
      return;
    }

    set((state) => ({
      gems: state.gems + 40,
      tickets: state.tickets + 4,
      lastDailyClaim: today,
      dailyMessage: 'حصلت على 4 تذاكر و40 جوهرة اليوم!'
    }));
  },

  addHeroToCollection: (hero) =>
    set((state) => ({
      collection: [...state.collection, hero],
    })),

  summonWithTickets: (hero) => {
    if (get().tickets < 10) {
      return false;
    }
    set((state) => ({
      tickets: state.tickets - 10,
      collection: [...state.collection, hero],
    }));
    return true;
  },

  summonWithGems: (hero) => {
    if (get().gems < 100) {
      return false;
    }
    set((state) => ({
      gems: state.gems - 100,
      collection: [...state.collection, hero],
    }));
    return true;
  },

  togglePartyMember: (heroId) => {
    set((state) => {
      if (state.party.includes(heroId)) {
        return { party: state.party.filter((id) => id !== heroId) };
      }
      if (state.party.length >= 5) {
        return state;
      }
      return { party: [...state.party, heroId] };
    });
  },

  removePartyMember: (heroId) =>
    set((state) => ({ party: state.party.filter((id) => id !== heroId) })),
}));
