import { CARD_DECK, RANK_VALUE_MAP } from 'game-utils/cards/constants';
import { CardRanks, type CardDeck } from 'game-utils/cards/types';
import { BlackjackActions, type BlackjackGameState } from './types';

const convertFloatsToGameEvents = (floats: number[] | undefined) => {
  if (!floats || floats.length === 0) {
    return [];
  }
  return floats.map(float => Math.floor(float * 52));
};

function calculateHandValue(cards: CardDeck[]) {
  let value = cards.reduce((sum, card) => sum + RANK_VALUE_MAP[card.rank], 0);
  let aces = cards.filter(card => card.rank === CardRanks.ACE).length;

  // Adjust for Aces (count them as 1 if the value is over 21)
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }
  return value;
}

const dealGame = (gameEvents: number[]): BlackjackGameState => {
  const playerCards = [CARD_DECK[gameEvents[0]], CARD_DECK[gameEvents[1]]];
  const dealerCards = [CARD_DECK[gameEvents[2]], CARD_DECK[gameEvents[3]]];
  return {
    dealer: {
      actions: [BlackjackActions.DEAL],
      cards: dealerCards,
      value: calculateHandValue(dealerCards),
    },
    player: {
      actions: [BlackjackActions.DEAL],
      cards: playerCards,
      value: calculateHandValue(playerCards),
    },
  };
};

const getSafeGameState = (
  gameState: BlackjackGameState
): BlackjackGameState => {
  return {
    ...gameState,
    dealer: {
      value: calculateHandValue([gameState.dealer.cards[0]]),
      actions: [BlackjackActions.DEAL],
      cards: [gameState.dealer.cards[0]],
    },
  };
};

export { convertFloatsToGameEvents, dealGame, getSafeGameState };
