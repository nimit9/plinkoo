import type {
  // MinesGameOverResponse,
  BlackjackPlayRoundResponse,
} from '@repo/common/game-utils/blackjack/types.js';
import { create } from 'zustand';

interface BlackjackStore {
  betAmount: number;
  setBetAmount: (betAmount: number) => void;

  gameState: BlackjackPlayRoundResponse | null;
  prevGameState: BlackjackPlayRoundResponse | null;
  setGameState: (
    gameState: BlackjackPlayRoundResponse | null,
    flipped: boolean
  ) => void;

  flippedCards: Record<string, Set<string>>;
  incomingCards: Record<string, Set<string>>;

  clearTransientCards: () => void;
}

const useBlackjackStore = create<BlackjackStore>((set, get) => ({
  betAmount: 0,
  setBetAmount: betAmount => {
    set({ betAmount });
  },
  gameState: null,
  prevGameState: null,

  flippedCards: {},
  incomingCards: {},
  setGameState: () => {},

  clearTransientCards: () => {
    set({ incomingCards: {} });
  },
}));

export default useBlackjackStore;
