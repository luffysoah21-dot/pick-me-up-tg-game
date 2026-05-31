import create from 'zustand';
import { availableHeroes, Hero } from '../data/heroes';
import { fetchPlayerHeroes, savePlayerHero, saveUserTeam, PlayerHeroEntry } from '../api/gameApi';
import { queryClient } from '../queryClient';

interface GameState {
  gems: number;
  tickets: number;
  party: string[];
  activeHeroId: string | null;
  playerHeroes: PlayerHeroEntry[];
  isLoading: boolean;
  toastMessage: string | null;
  toastType: 'success' | 'error' | null;
  loadPlayerHeroes: () => Promise<void>;
  summonHero: (heroId: string) => Promise<PlayerHeroEntry | undefined>;
  setToast: (message: string, type?: 'success' | 'error') => void;
  clearToast: () => void;
  addGems: (amount: number) => void;
  useTicket: () => boolean;
  togglePartyMember: (heroId: string) => void;
  setActiveHero: (heroId: string) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  gems: 420,
  tickets: 28,
  party: [],
  activeHeroId: null,
  playerHeroes: [],
  isLoading: false,
  toastMessage: null,
  toastType: null,

  loadPlayerHeroes: async () => {
    set({ isLoading: true });
    try {
      const heroes = await fetchPlayerHeroes();
      set({ playerHeroes: heroes, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, toastMessage: error.message || 'فشل تحميل الأبطال', toastType: 'error' });
    }
  },

  summonHero: async (heroId: string) => {
    set({ isLoading: true });
    try {
      const newHero = await savePlayerHero(heroId);
      set((state) => ({
        playerHeroes: [...state.playerHeroes, newHero],
        isLoading: false,
      }));
      queryClient.invalidateQueries(['userHeroes']);
      return newHero;
    } catch (error: any) {
      set({ isLoading: false, toastMessage: error.message || 'فشل حفظ البطل', toastType: 'error' });
      return undefined;
    }
  },

  setToast: (message, type = 'success') => set({ toastMessage: message, toastType: type }),
  clearToast: () => set({ toastMessage: null, toastType: null }),

  addGems: (amount: number) => set((state) => ({ gems: state.gems + amount })),

  useTicket: () => {
    const tickets = get().tickets;
    if (tickets <= 0) return false;
    set({ tickets: tickets - 1 });
    return true;
  },

  togglePartyMember: (heroId: string) => {
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

  setActiveHero: (heroId: string) => {
    set((state) => ({
      activeHeroId: heroId,
      party: state.party.includes(heroId) ? state.party : [...state.party, heroId],
    }));
    saveUserTeam('default', heroId, 0).catch((error: any) => {
      set({ toastMessage: error.message || 'فشل حفظ الفريق', toastType: 'error' });
    });
  },
}));
