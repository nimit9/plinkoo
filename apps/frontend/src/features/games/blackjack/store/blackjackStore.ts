import type {
  // MinesGameOverResponse,
  BlackjackPlayRoundResponse,
} from '@repo/common/game-utils/blackjack/types.js';
import { create } from 'zustand';

interface BlackjackStore {
  betAmount: number;
  setBetAmount: (betAmount: number) => void;
  gameState: BlackjackPlayRoundResponse | null;
  setGameState: (gameState: BlackjackPlayRoundResponse | null) => void;
}

const useBlackjackStore = create<BlackjackStore>(set => ({
  betAmount: 0,
  setBetAmount: betAmount => {
    set({ betAmount });
  },
  gameState: null,
  setGameState: (gameState: BlackjackPlayRoundResponse | null) => {
    set({ gameState });
  },
}));

export default useBlackjackStore;
