import { BLACKJACK_RANK_VALUE_MAP, CARD_DECK } from '../cards/constants.js';
import { CardRanks, type CardDeck } from '../cards/types.js';
import { PAYOUTS, PLAYER_TURN_OVER_ACTIONS } from './constants.js';
import { BlackjackActions } from './types';
import type {
  DealerGameState,
  PlayerGameState,
  BlackjackGameState,
} from './types';

const convertFloatsToGameEvents = (floats: number[] | undefined) => {
  if (!floats || floats.length === 0) {
    return [];
  }
  return floats.map(float => Math.floor(float * 52));
};

const calculateHandValue = (cards: CardDeck[]) => {
  let value = cards.reduce(
    (sum, card) => sum + BLACKJACK_RANK_VALUE_MAP[card.rank],
    0
  );
  let aces = cards.filter(card => card.rank === CardRanks.ACE).length;

  // Adjust for Aces one at a time (convert from 11 to 1 when value exceeds 21)
  // This ensures optimal value: 2 Aces = 12 (A,A = 11+1), 3 Aces = 13 (A,A,A = 11+1+1)
  while (value > 21 && aces > 0) {
    value -= 10; // Convert one Ace from 11 to 1 (difference of 10)
    aces--;
  }
  return value;
};

const getIsBlackjack = (cards: CardDeck[], value: number) => {
  return cards.length === 2 && value === 21;
};

const getIsPlayerTurnOver = (playerActions: BlackjackActions[][]) => {
  return playerActions.every(action =>
    PLAYER_TURN_OVER_ACTIONS.some(playerAction => action.includes(playerAction))
  );
};

const getCurrentActiveHand = (
  playerHands?: PlayerGameState[]
): PlayerGameState | undefined => {
  return playerHands?.find(
    hand =>
      !hand.actions.some(action =>
        [
          BlackjackActions.STAND,
          BlackjackActions.BUST,
          BlackjackActions.FULL,
          BlackjackActions.BLACKJACK,
        ].includes(action)
      )
  );
};

const createInitialGameState = (gameEvents: number[]): BlackjackGameState => {
  const playerCards = [CARD_DECK[gameEvents[0]], CARD_DECK[gameEvents[1]]];
  const dealerCards = [CARD_DECK[gameEvents[2]], CARD_DECK[gameEvents[3]]];

  const playerValue = calculateHandValue(playerCards);
  const dealerValue = calculateHandValue(dealerCards);

  const dealerState: DealerGameState = {
    actions: [BlackjackActions.DEAL],
    cards: dealerCards,
    value: dealerValue,
  };

  const playerState: PlayerGameState = {
    actions: [BlackjackActions.DEAL],
    cards: playerCards,
    value: playerValue,
  };

  return processInitialBlackjacks(playerState, dealerState);
};

const processInitialBlackjacks = (
  playerState: PlayerGameState,
  dealerState: DealerGameState
): BlackjackGameState => {
  const isPlayerBlackjack = getIsBlackjack(
    playerState.cards,
    playerState.value
  );
  const isDealerBlackjack = getIsBlackjack(
    dealerState.cards,
    dealerState.value
  );
  const isDealerAceUp = dealerState.cards[0].rank === CardRanks.ACE;

  if (isPlayerBlackjack) {
    playerState.actions.push(BlackjackActions.BLACKJACK);
    if (isDealerAceUp) {
      return {
        dealer: dealerState,
        player: [playerState],
      };
    }
    if (isDealerBlackjack) {
      dealerState.actions.push(BlackjackActions.BLACKJACK);
    }
  } else if (isDealerBlackjack && !isDealerAceUp) {
    playerState.actions.push(BlackjackActions.BUST);
  }

  return {
    dealer: dealerState,
    player: [playerState],
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

const getValidActionsFromState = ({
  state,
  active,
}: {
  state: BlackjackGameState | null;
  active: boolean;
}) => {
  const defaultActions = {
    [BlackjackActions.HIT]: false,
    [BlackjackActions.STAND]: false,
    [BlackjackActions.DOUBLE]: false,
    [BlackjackActions.SPLIT]: false,
    [BlackjackActions.INSURANCE]: false,
  };

  const currentHand = getCurrentActiveHand(state?.player);
  if (!currentHand || !state || !active) return defaultActions;

  const { cards, actions, value } = currentHand;
  const isFirstMove =
    actions.length === 1 && actions[0] === BlackjackActions.DEAL;
  const isBlackjack = getIsBlackjack(cards, value);
  const isPair = cards.length === 2 && cards[0].rank === cards[1].rank;
  const isDealerAceUp = state.dealer.cards[0]?.rank === CardRanks.ACE;

  if (isFirstMove && !isBlackjack) {
    return {
      [BlackjackActions.HIT]: true,
      [BlackjackActions.STAND]: true,
      [BlackjackActions.DOUBLE]: true,
      [BlackjackActions.SPLIT]: isPair,
      [BlackjackActions.INSURANCE]: isDealerAceUp,
    };
  }

  return {
    ...defaultActions,
    [BlackjackActions.HIT]: value < 21,
    [BlackjackActions.STAND]: true,
  };
};

const isActionValid = ({
  gameState,
  action,
  active,
}: {
  gameState: BlackjackGameState;
  action: BlackjackActions;
  active: boolean;
}): boolean => {
  const validActions = getValidActionsFromState({ state: gameState, active });

  if (
    [BlackjackActions.INSURANCE, BlackjackActions.NOINSURANCE].includes(action)
  ) {
    return validActions.insurance;
  }

  if (validActions.insurance) {
    return false; // Insurance is a special case, it should not be used with other actions
  }

  return validActions[action as keyof typeof validActions] || false;
};

interface ActionResult {
  drawIndex: number;
  amountMultiplier?: number;
}

const updateHandStatus = (hand: PlayerGameState): void => {
  if (hand.value > 21) {
    hand.actions.push(BlackjackActions.BUST);
  } else if (hand.value === 21) {
    hand.actions.push(BlackjackActions.FULL);
  }
};

const handleHit = ({
  hand,
  gameEvents,
  drawIndex,
  gameState,
}: {
  hand: PlayerGameState;
  gameEvents: number[];
  drawIndex: number;
  gameState: BlackjackGameState;
}): ActionResult => {
  const card = CARD_DECK[gameEvents[drawIndex]];
  hand.cards.push(card);
  hand.value = calculateHandValue(hand.cards);
  hand.actions.push(BlackjackActions.HIT);

  updateHandStatus(hand);

  let currentDrawIndex = drawIndex + 1;

  if (hand.actions.includes(BlackjackActions.FULL)) {
    const dealerHand = gameState.dealer;
    while (dealerHand.value < 17) {
      const nextCard = CARD_DECK[currentDrawIndex];
      dealerHand.cards.push(nextCard);
      dealerHand.value = calculateHandValue(dealerHand.cards);
      dealerHand.actions.push(BlackjackActions.HIT);
      currentDrawIndex++;
    }
  }

  return {
    drawIndex: currentDrawIndex,
  };
};

const handleStand = ({
  hand,
  dealerHand,
  drawIndex,
}: {
  hand: PlayerGameState;
  dealerHand: DealerGameState;
  drawIndex: number;
}): ActionResult => {
  hand.actions.push(BlackjackActions.STAND);
  // Dealer's turn logic
  let currentDrawIndex = drawIndex;
  while (dealerHand.value < 17) {
    const nextCard = CARD_DECK[currentDrawIndex];
    dealerHand.cards.push(nextCard);
    dealerHand.value = calculateHandValue(dealerHand.cards);
    dealerHand.actions.push(BlackjackActions.HIT);
    currentDrawIndex++;
  }
  updateHandStatus(dealerHand);
  return {
    drawIndex: currentDrawIndex,
  };
};

const handleDouble = ({
  hand,
  gameEvents,
  drawIndex,
  dealerHand,
  amountMultiplier,
}: {
  hand: PlayerGameState;
  gameEvents: number[];
  dealerHand: DealerGameState;
  drawIndex: number;
  amountMultiplier: number;
}): ActionResult => {
  const card = CARD_DECK[gameEvents[drawIndex]];
  hand.cards.push(card);
  hand.value = calculateHandValue(hand.cards);
  hand.actions.push(BlackjackActions.DOUBLE);

  updateHandStatus(hand);

  let currentDrawIndex = drawIndex + 1;
  while (dealerHand.value < 17) {
    const nextCard = CARD_DECK[currentDrawIndex];
    dealerHand.cards.push(nextCard);
    dealerHand.value = calculateHandValue(dealerHand.cards);
    dealerHand.actions.push(BlackjackActions.HIT);
    currentDrawIndex++;
  }

  updateHandStatus(dealerHand);

  return {
    drawIndex: currentDrawIndex,
    amountMultiplier: amountMultiplier + 1,
  };
};

const handleSplit = ({
  hand,
  gameEvents,
  drawIndex,
  gameState,
  amountMultiplier,
}: {
  hand: PlayerGameState;
  gameEvents: number[];
  drawIndex: number;
  gameState: BlackjackGameState;
  amountMultiplier: number;
}): ActionResult => {
  const [first, second] = hand.cards;
  const newCard1 = CARD_DECK[gameEvents[drawIndex]];
  const newCard2 = CARD_DECK[gameEvents[drawIndex + 1]];

  // Update current hand
  hand.cards = [first, newCard1];
  hand.value = calculateHandValue(hand.cards);
  hand.actions.push(BlackjackActions.SPLIT);

  // Create new hand
  const newHand: PlayerGameState = {
    actions: [BlackjackActions.DEAL, BlackjackActions.SPLIT],
    cards: [second, newCard2],
    value: calculateHandValue([second, newCard2]),
  };

  gameState.player.push(newHand);

  return {
    drawIndex: drawIndex + 2,
    amountMultiplier: amountMultiplier + 1,
  };
};

const handleInsurance = ({
  hand,
  gameState,
  amountMultiplier,
  drawIndex,
}: {
  hand: PlayerGameState;
  gameState: BlackjackGameState;
  amountMultiplier: number;
  drawIndex: number;
}): ActionResult => {
  hand.actions.push(BlackjackActions.INSURANCE);

  const isDealerBlackjack = getIsBlackjack(
    gameState.dealer.cards,
    gameState.dealer.value
  );
  if (isDealerBlackjack) {
    hand.actions.push(BlackjackActions.BUST);
  }

  return {
    drawIndex,
    amountMultiplier: amountMultiplier + 0.5,
  };
};

const handleNoInsurance = ({
  hand,
  gameState,
  drawIndex,
}: {
  hand: PlayerGameState;
  gameState: BlackjackGameState;
  drawIndex: number;
}): ActionResult => {
  hand.actions.push(BlackjackActions.NOINSURANCE);

  const isDealerBlackjack = getIsBlackjack(
    gameState.dealer.cards,
    gameState.dealer.value
  );
  if (isDealerBlackjack) {
    hand.actions.push(BlackjackActions.BUST);
  }

  return { drawIndex };
};

const playRoundAndUpdateState = ({
  gameEvents,
  drawIndex,
  gameState,
  action,
  amountMultiplier,
}: {
  gameEvents: number[];
  drawIndex: number;
  gameState: BlackjackGameState;
  action: BlackjackActions;
  amountMultiplier: number;
}): {
  drawIndex: number;
  amountMultiplier?: number;
} => {
  const currentHand = getCurrentActiveHand(gameState.player);

  if (!currentHand) {
    return { drawIndex, amountMultiplier };
  }
  const actionHandlers = {
    [BlackjackActions.HIT]: () =>
      handleHit({ hand: currentHand, gameEvents, drawIndex, gameState }),
    [BlackjackActions.STAND]: () =>
      handleStand({
        hand: currentHand,
        drawIndex,
        dealerHand: gameState.dealer,
      }),
    [BlackjackActions.DOUBLE]: () =>
      handleDouble({
        hand: currentHand,
        gameEvents,
        drawIndex,
        amountMultiplier,
        dealerHand: gameState.dealer,
      }),
    [BlackjackActions.SPLIT]: () =>
      handleSplit({
        hand: currentHand,
        gameEvents,
        drawIndex,
        gameState,
        amountMultiplier,
      }),
    [BlackjackActions.INSURANCE]: () =>
      handleInsurance({
        hand: currentHand,
        gameState,
        amountMultiplier,
        drawIndex,
      }),
    [BlackjackActions.NOINSURANCE]: () =>
      handleNoInsurance({ hand: currentHand, gameState, drawIndex }),
  };
  const handler = actionHandlers[action as keyof typeof actionHandlers];
  return handler();
};

const determineWinner = (
  gameState: BlackjackGameState,
  betAmount: number
): number => {
  let totalPayout = 0;
  gameState.player.forEach(hand => {
    const payout = calculateHandPayout({ hand, gameState, betAmount });
    totalPayout += payout;
  });
  return totalPayout;
};

const calculateHandPayout = ({
  gameState,
  hand,
  betAmount: amount,
}: {
  hand: PlayerGameState;
  gameState: BlackjackGameState;
  betAmount: number;
}): number => {
  let payout = 0;
  const betAmount = hand.actions.includes(BlackjackActions.DOUBLE)
    ? amount * 2
    : amount;
  const isDealerBlackjack = getIsBlackjack(
    gameState.dealer.cards,
    gameState.dealer.value
  );
  const isInsured = hand.actions.includes(BlackjackActions.INSURANCE);

  if (isDealerBlackjack && isInsured) {
    payout += betAmount; // Insurance payout
  }

  if (isInsured && !isDealerBlackjack) {
    payout -= betAmount / 2; // Insurance loss
  }

  if (hand.actions.includes(BlackjackActions.BUST)) {
    payout += betAmount * PAYOUTS.lose;
    return payout;
  }

  if (getIsBlackjack(hand.cards, hand.value)) {
    payout +=
      betAmount * (isDealerBlackjack ? PAYOUTS.push : PAYOUTS.blackjack);
    return payout;
  }

  // Compare hands
  if (
    hand.value > gameState.dealer.value ||
    gameState.dealer.actions.includes(BlackjackActions.BUST)
  ) {
    payout += betAmount * PAYOUTS.win;
    return payout;
  }
  if (hand.value < gameState.dealer.value) {
    payout += betAmount * PAYOUTS.lose;
    return payout;
  }
  return payout;
};

export {
  convertFloatsToGameEvents,
  createInitialGameState,
  determineWinner,
  getSafeGameState,
  getValidActionsFromState,
  isActionValid,
  getIsBlackjack,
  getIsPlayerTurnOver,
  playRoundAndUpdateState,
};
