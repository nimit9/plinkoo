import { create } from 'zustand';

interface RouletteStore {
  betAmount: number;
  setBetAmount: (betAmount: number) => void;
}

const useRouletteStore = create<RouletteStore>((set) => ({
  betAmount: 0,
  setBetAmount: (betAmount) => {
    set({ betAmount });
  },
}));

export default useRouletteStore;
