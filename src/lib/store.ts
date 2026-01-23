import { create } from 'zustand';
import { Portfolio } from '@/types/investment';

interface AppState {
  portfolio: Portfolio | null;
  loading: boolean;
  error: string | null;
  filters: {
    platform: string;
    type: string;
    sortBy: 'pnl' | 'value' | 'symbol';
    sortOrder: 'asc' | 'desc';
  };
  setFilters: (filters: Partial<AppState['filters']>) => void;
  fetchPortfolio: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  portfolio: null,
  loading: false,
  error: null,
  filters: {
    platform: '',
    type: '',
    sortBy: 'symbol',
    sortOrder: 'asc',
  },
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters },
  })),
  fetchPortfolio: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/holdings');
      if (!response.ok) throw new Error('Failed to fetch');
      const data: Portfolio = await response.json();
      set({ portfolio: data, loading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Unknown error', loading: false });
    }
  },
}));