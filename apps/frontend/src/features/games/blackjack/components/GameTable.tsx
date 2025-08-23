import { LayoutGroup } from 'motion/react';
import type { PlayerGameState } from '@repo/common/game-utils/blackjack/types.js';
import PlayingCard from '@/components/ui/playing-card';
import { Badge } from '@/components/ui/badge';
import useBlackjackStore from '../store/blackjackStore';
import { FACE_DOWN_HIDDEN_DEALER_CARD } from '../const';

interface GameTableProps {
  isGameActive?: boolean;
}

function GameTable({ isGameActive = false }: GameTableProps): JSX.Element {
  const { gameState, cardInDeck, flippedCards, incomingCards } =
    useBlackjackStore();

  // Show dealer's hole card only when game is not active
  const showDealerHoleCard = !isGameActive;

  const renderDealerHand = (): JSX.Element | null => {
    if (!gameState?.state.dealer.cards.length) return null;

    // Calculate center offset: -48 - (totalCards - 1) * 20
    const totalCards =
      gameState.state.dealer.cards.length + (!showDealerHoleCard ? 1 : 0);
    const centerOffset = -48 - (totalCards - 1) * 20;
    const rightmostCardLeft = (totalCards - 1) * 40 + centerOffset;
    const cardWidth = 96; // Assuming standard card width
    const rightmostCardRight = rightmostCardLeft + cardWidth;

    return (
      <div className="flex flex-col items-center">
        <div className="relative">
          <Badge
            className="absolute -top-6 transform rounded-full bg-brand-weakest text-primary px-4 font-bold text-sm hover:bg-brand-weakest"
            style={{
              right: -rightmostCardRight,
            }}
          >
            {gameState.state.dealer.value}
          </Badge>
          {gameState.state.dealer.cards.map((card, index) => {
            const isHoleCard = index === 1;
            const shouldShowCard = !isHoleCard || showDealerHoleCard;
            if (!incomingCards.has(card.id)) {
              return;
            }

            return (
              <div
                className="absolute"
                key={card.id}
                style={{
                  top: index * 20,
                  left: index * 40 + centerOffset,
                }}
              >
                <PlayingCard
                  faceDown={!flippedCards.has(card.id)}
                  layoutId={card.id}
                  rank={shouldShowCard ? card.rank : undefined}
                  suit={shouldShowCard ? card.suit : undefined}
                />
              </div>
            );
          })}
          {!showDealerHoleCard &&
          incomingCards.has(FACE_DOWN_HIDDEN_DEALER_CARD) ? (
            <div className="absolute" style={{ top: 20, left: -28 }}>
              <PlayingCard faceDown layoutId={FACE_DOWN_HIDDEN_DEALER_CARD} />
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  const renderPlayerHand = (
    hand: PlayerGameState,
    handIndex = 0
  ): JSX.Element => {
    const isMultipleHands = hand.cards.length > 1;

    const totalCards = hand.cards.length;
    const centerOffset = -48 - (totalCards - 1) * 20;
    const rightmostCardLeft = (totalCards - 1) * 40 + centerOffset;
    const cardWidth = 96; // Assuming standard card width
    const rightmostCardRight = rightmostCardLeft + cardWidth;

    return (
      <div
        className={`flex flex-col items-center ${isMultipleHands ? 'mx-8' : ''}`}
        key={`hand-${handIndex}`}
      >
        <div className="relative">
          <Badge
            className="absolute -top-6 transform rounded-full bg-brand-weakest text-primary px-4 font-bold text-sm hover:bg-brand-weakest"
            style={{
              right: -rightmostCardRight,
            }}
          >
            {hand.value}
          </Badge>
          {hand.cards.map((card, cardIndex) => {
            // Calculate center offset: -48 - (totalCards - 1) * 20

            if (!incomingCards.has(card.id)) {
              return;
            }

            return (
              <div
                className="absolute"
                key={card.id}
                style={{
                  top: cardIndex * 20,
                  left: cardIndex * 40 + centerOffset,
                }}
              >
                <PlayingCard
                  faceDown={!flippedCards.has(card.id)}
                  layoutId={card.id}
                  rank={card.rank}
                  suit={card.suit}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDeck = (): JSX.Element => (
    <div className="absolute -top-12 right-32 transform">
      <div className="relative">
        {/* Stack effect with multiple card backs */}
        {[0, 1, 2, 3].map(offset => (
          <div
            className="absolute"
            key={offset}
            style={{
              transform: `translateY(${offset * 2}px)`,
              zIndex: 10 - offset,
            }}
          >
            <PlayingCard faceDown />
          </div>
        ))}
        {cardInDeck ? (
          <div
            className="absolute"
            style={{
              transform: `translateY(8px)`,
              zIndex: 5,
            }}
          >
            <PlayingCard faceDown layoutId={cardInDeck} />
          </div>
        ) : null}
      </div>
    </div>
  );

  return (
    <LayoutGroup>
      <div
        className="relative w-full h-full min-h-[600px] flex flex-col items-center py-8 bg-[url('/games/blackjack/background.svg')] bg-center bg-no-repeat justify-evenly"
        style={{ backgroundSize: '40%' }}
      >
        {/* Deck positioned on the top right */}
        {renderDeck()}

        {/* Dealer's hand at the top */}
        <div className="flex h-full justify-center w-full pt-16">
          {renderDealerHand()}
        </div>

        {/* Player's hand(s) at the bottom */}
        <div className="flex justify-center pb-4 h-full w-full pt-16">
          <div
            className={`flex ${(gameState?.state.player.length || 0) > 1 ? 'gap-16' : ''} justify-center`}
          >
            {gameState?.state.player.map((hand, index) =>
              renderPlayerHand(hand, index)
            )}
          </div>
        </div>
      </div>
    </LayoutGroup>
  );
}

export default GameTable;
