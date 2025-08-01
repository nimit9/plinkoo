import { CardSuits } from '@repo/common/game-utils/cards/types.js';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

function PlayingCard({
  faceDown = false,
  layoutId,
  rank,
  suit,
}: {
  rank?: string;
  suit?: CardSuits;
  faceDown?: boolean;
  layoutId?: string;
}): JSX.Element {
  return (
    <motion.div
      animate={{
        rotateY: faceDown ? 180 : 0,
      }}
      className="w-24 rounded shadow-[0_0_0.25em_#0710174d] aspect-[2/3]"
      layoutId={layoutId}
      style={{ 
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Card Front Face */}
      <div
        className="absolute inset-0 w-full h-full rounded bg-white select-none"
        style={{ 
          backfaceVisibility: 'hidden',
          transform: 'rotateY(0deg)'
        }}
      >
        {rank && suit ? (
          <div className="w-1/2 ml-[5%] flex flex-col gap-1 items-center justify-center pt-2">
            <span
              className={cn('font-bold text-4xl', {
                'text-[#e9113c]': [
                  CardSuits.HEARTS,
                  CardSuits.DIAMONDS,
                ].includes(suit),
                'text-brand-default': [
                  CardSuits.SPADES,
                  CardSuits.CLUBS,
                ].includes(suit),
              })}
            >
              {rank}
            </span>
            <img
              alt={`${suit} icon`}
              className="p-0 scale-[80%]"
              src={`/games/cards/${suit}.png`}
            />
          </div>
        ) : (
          <div className="w-full h-full bg-white rounded border-2 border-gray-200" />
        )}
      </div>

      {/* Card Back Face */}
      <div
        className="absolute inset-0 w-full h-full rounded select-none"
        style={{
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)'
        }}
      >
        <img
          alt="Card back"
          className="w-full h-full rounded object-cover"
          src="/games/cards/back.png"
        />
      </div>
    </motion.div>
  );
}

export default PlayingCard;
