import { create } from 'zustand';

interface RouletteStoreActions {
  setSelectedChip: (chip: number | null) => void;
  setBetAmount: (betAmount: number) => void;
  addBetHistory: (betHistory: string) => void;
  clearBets: () => void;
  undoBet: () => void;
  addBet: (betId: string) => void;
  updateBetAmount: (betAmount: number) => void;
}

interface RouletteStoreState {
  selectedChip: number | null;
  betAmount: number;
  betHistory: string[];
  bets: Record<string, number[] | undefined>;
}

const initialState: RouletteStoreState = {
  betAmount: 0,
  betHistory: [],
  bets: {},
  selectedChip: 1,
};

const useRouletteStore = create<RouletteStoreState & RouletteStoreActions>(
  (set) => ({
    ...initialState,
    setBetAmount: (betAmount) => {
      set({ betAmount });
    },
    updateBetAmount: (betAmount) => {
      set((state) => ({ betAmount: state.betAmount + betAmount }));
    },
    setSelectedChip: (chip) => {
      if (chip && chip < 1) {
        set({ selectedChip: null });
      }
      set({ selectedChip: chip });
    },
    addBetHistory: (betHistory) => {
      set((state) => ({ betHistory: [...state.betHistory, betHistory] }));
    },
    clearBets: () => {
      set(initialState);
    },
    undoBet: () => {
      set((state) => {
        if (state.betHistory.length === 0) return state;
        const lastBetId = state.betHistory[state.betHistory.length - 1];

        const lastChipOnBoardBetAmountArray = state.bets[lastBetId];

        const lastChipOnBoardBetAmount =
          lastChipOnBoardBetAmountArray?.[
            lastChipOnBoardBetAmountArray.length - 1
          ] || 0;

        return {
          betHistory: state.betHistory.slice(0, -1),
          bets: {
            ...state.bets,
            [lastBetId]: state.bets[lastBetId]?.slice(0, -1) || [],
          },
          betAmount: state.betAmount - lastChipOnBoardBetAmount,
        };
      });
    },
    addBet: (betId) => {
      set((state) => {
        if (!state.selectedChip) {
          return state;
        }

        if (state.selectedChip < 1) {
          return { selectedChip: null };
        }

        const updatedBets = { ...state.bets };

        if (!updatedBets[betId]) {
          updatedBets[betId] = [];
        }

        updatedBets[betId] = [...updatedBets[betId], state.selectedChip];

        return {
          bets: updatedBets,
          betAmount: state.betAmount + state.selectedChip,
          betHistory: [...state.betHistory, betId],
        };
      });
    },
  }),
);

export default useRouletteStore;
