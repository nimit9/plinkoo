import { create } from 'zustand';

interface BalanceState {
  balance: number;
  setBalance: (balance: number) => void;
  updateBalance: (amount: number) => void;
}

export const useBalanceStore = create<BalanceState>((set) => ({
  balance: 0,
  setBalance: (balance) => {
    set({ balance });
  },
  updateBalance: (amount) => {
    set((state) => ({ balance: state.balance + amount }));
  },
}));
