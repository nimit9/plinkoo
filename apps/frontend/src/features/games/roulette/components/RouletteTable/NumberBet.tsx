import { redNumbers } from '@repo/common/game-utils/roulette/constants.js';
import { useDroppable } from '@dnd-kit/core';
import { RouletteBetTypes } from '@repo/common/game-utils/roulette/types.js';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { useRouletteBoardHoverStore } from '../../store/rouletteBoardHoverStore';
import { getIsNumberHover } from '../../utils/hover';
import {
  shouldRenderBottom,
  shouldRenderCornerBet,
  shouldRenderRight,
  shouldRenderSixLineBet,
  shouldRenderTop,
} from '../../utils/shouldRender';
import DroppableArea from './DroppableArea';

function NumberBet({ number }: { number: number }): JSX.Element {
  const { hoverId } = useRouletteBoardHoverStore();

  const referenceDiv = useRef<HTMLDivElement | null>(null);

  const isRedNumber = redNumbers.includes(number.toString());
  const isNumberHover = getIsNumberHover({ number, hoverId });

  const { setNodeRef } = useDroppable({
    id: `${RouletteBetTypes.STRAIGHT}-${number}`,
    data: {
      betType: RouletteBetTypes.STRAIGHT,
      selection: number,
    },
  });

  return (
    <div
      className={cn(
        'cursor-pointer rounded-sm flex items-center justify-center size-10 text-sm font-semibold relative',
        isRedNumber
          ? 'bg-roulette-red hover:bg-roulette-red-hover'
          : 'bg-roulette-black hover:bg-roulette-black-hover',
        {
          'bg-roulette-red-hover': isRedNumber && isNumberHover,
          'bg-roulette-black-hover': !isRedNumber && isNumberHover,
        },
      )}
      ref={(el) => {
        setNodeRef(el);
        referenceDiv.current = el;
      }}
    >
      {number}
      {shouldRenderCornerBet(number) && (
        <DroppableArea
          betTypeData={{
            betType: RouletteBetTypes.CORNER,
            selection: [number, number + 1, number + 3, number + 4],
          }}
          position="TR"
          reference={referenceDiv}
        />
      )}
      {number === 1 && (
        <DroppableArea
          betTypeData={{
            betType: RouletteBetTypes.STREET,
            selection: [0, 1, 2],
          }}
          position="TL"
          reference={referenceDiv}
        />
      )}
      {number === 2 && (
        <DroppableArea
          betTypeData={{
            betType: RouletteBetTypes.STREET,
            selection: [0, 2, 3],
          }}
          position="TL"
          reference={referenceDiv}
        />
      )}
      {shouldRenderTop(number) && (
        <DroppableArea
          betTypeData={{
            betType: RouletteBetTypes.SPLIT,
            selection: [number, number + 1],
          }}
          position="TC"
          reference={referenceDiv}
        />
      )}
      {shouldRenderRight(number) && (
        <DroppableArea
          betTypeData={{
            betType: RouletteBetTypes.SPLIT,
            selection: [number, number + 3],
          }}
          position="CR"
          reference={referenceDiv}
        />
      )}
      {shouldRenderBottom(number) && (
        <DroppableArea
          betTypeData={{
            betType: RouletteBetTypes.STREET,
            selection: [number, number + 1, number + 2],
          }}
          position="BC"
          reference={referenceDiv}
        />
      )}
      {shouldRenderSixLineBet(number) && (
        <DroppableArea
          betTypeData={{
            betType: RouletteBetTypes.SIX_LINE,
            selection: [
              number,
              number + 1,
              number + 2,
              number + 3,
              number + 4,
              number + 5,
            ],
          }}
          position="BR"
          reference={referenceDiv}
        />
      )}
    </div>
  );
}

export default NumberBet;
