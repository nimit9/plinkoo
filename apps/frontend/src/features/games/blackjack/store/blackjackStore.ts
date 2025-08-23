import type { BlackjackPlayRoundResponse } from '@repo/common/game-utils/blackjack/types.js';
import { create } from 'zustand';
import { FACE_DOWN_HIDDEN_DEALER_CARD } from '../const';

interface BlackjackStore {
  betAmount: number;
  setBetAmount: (betAmount: number) => void;

  gameState: BlackjackPlayRoundResponse | null;
  setGameState: (
    gameState: BlackjackPlayRoundResponse | null,
    _flipped?: boolean
  ) => void;

  // Animation state management
  cardInDeck: string | null;
  dealingQueue: string[];

  flippedCards: Set<string>;
  incomingCards: Set<string>;

  // Actions
  initializeGame: (backendState: BlackjackPlayRoundResponse) => void;
  dealNextCard: () => Promise<void>;
  clearTransientCards: () => void;
  playNextRoundHandler: (data: BlackjackPlayRoundResponse) => void;
}

const delay = (ms: number): Promise<void> =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

const useBlackjackStore = create<BlackjackStore>((set, get) => ({
  betAmount: 0,
  setBetAmount: betAmount => {
    set({ betAmount });
  },
  gameState: null,

  // Animation state
  dealingQueue: [],
  cardInDeck: null,

  flippedCards: new Set(),
  incomingCards: new Set(),

  setGameState: gameState => {
    const currentState = get();
    set({
      gameState,
    });

    // If this is a new game state with cards, initialize the dealing sequence
    if (gameState && !currentState.gameState) {
      get().initializeGame(gameState);
    }
  },

  initializeGame: (backendState: BlackjackPlayRoundResponse) => {
    // Clear existing cards
    set({
      cardInDeck: null,
      flippedCards: new Set(),
      incomingCards: new Set(),
    });

    const { player, dealer } = backendState.state;

    const dealingQueue = [
      player[0].cards[0].id,
      dealer.cards[0].id,
      player[0].cards[1].id,
      FACE_DOWN_HIDDEN_DEALER_CARD,
    ];

    set({ dealingQueue });
    // Call dealNextCard but don't return the promise
    void get().dealNextCard();
  },

  dealNextCard: async () => {
    const state = get();

    if (state.dealingQueue.length === 0) {
      return;
    }

    // Step 1: Place card in deck
    const nextCard = state.dealingQueue[0];
    const remainingQueue = state.dealingQueue.slice(1);

    set({
      cardInDeck: nextCard,
      dealingQueue: remainingQueue,
    });

    await delay(200); // Wait for the card to be placed in deck

    set(currentState => ({
      incomingCards: new Set(currentState.incomingCards).add(nextCard),
      cardInDeck: null,
    }));

    await delay(600); // Wait for the card to be visible

    set(currentState => ({
      flippedCards: new Set(currentState.flippedCards).add(nextCard),
    }));

    // Step 4: Deal the next card
    await get().dealNextCard();
  },

  playNextRoundHandler: (data: BlackjackPlayRoundResponse) => {
    const { player, dealer } = data.state;

    const playerRoundCards = player.flatMap(hand =>
      hand.cards.map(card => card.id)
    );

    const dealerRoundCards = dealer.cards.map(card => card.id);

    const newPlayerCards = playerRoundCards.filter(
      cardId => !get().incomingCards.has(cardId)
    );
    const newDealerCards = dealerRoundCards.filter(
      cardId => !get().incomingCards.has(cardId)
    );

    const dealingQueue = [...newPlayerCards, ...newDealerCards];

    set({ dealingQueue });
    void get().dealNextCard();
  },

  clearTransientCards: () => {
    set({
      dealingQueue: [],
      cardInDeck: null,
    });
  },
}));

export default useBlackjackStore;
