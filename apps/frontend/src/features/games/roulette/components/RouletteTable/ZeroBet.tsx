import { useDroppable } from '@dnd-kit/core';
import { RouletteBetTypes } from '@repo/common/game-utils/roulette/types.js';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { useRouletteBoardHoverStore } from '../../store/rouletteBoardHoverStore';
import { getIsNumberHover } from '../../utils/hover';
import DroppableArea from './DroppableArea';

function ZeroBet(): JSX.Element {
  const { hoverId } = useRouletteBoardHoverStore();
  const referenceDiv = useRef<HTMLDivElement | null>(null);
  const { setNodeRef } = useDroppable({
    id: `${RouletteBetTypes.STRAIGHT}-0`,
    data: {
      betType: RouletteBetTypes.STRAIGHT,
      selection: 0,
    },
  });

  const isNumberHover = getIsNumberHover({ number: 0, hoverId });

  return (
    <div
      className={cn(
        'cursor-pointer relative rounded-sm flex items-center justify-center w-10 text-sm font-semibold bg-roulette-green hover:bg-roulette-green-hover',
        {
          'bg-roulette-green-hover': isNumberHover,
        },
      )}
      ref={(el) => {
        setNodeRef(el);
        referenceDiv.current = el;
      }}
    >
      0
      <DroppableArea
        betTypeData={{
          betType: RouletteBetTypes.SPLIT,
          selection: [0, 1],
        }}
        position="0-1"
        reference={referenceDiv}
      />
      <DroppableArea
        betTypeData={{
          betType: RouletteBetTypes.SPLIT,
          selection: [0, 2],
        }}
        position="CR"
        reference={referenceDiv}
      />
      <DroppableArea
        betTypeData={{
          betType: RouletteBetTypes.SPLIT,
          selection: [0, 3],
        }}
        position="0-3"
        reference={referenceDiv}
      />
      <DroppableArea
        betTypeData={{
          betType: RouletteBetTypes.CORNER,
          selection: [0, 1, 2, 3],
        }}
        position="BR"
        reference={referenceDiv}
      />
    </div>
  );
}

export default ZeroBet;
