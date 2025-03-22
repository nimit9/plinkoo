import { useDroppable } from '@dnd-kit/core';
import { RouletteBetTypes } from '@repo/common/game-utils/roulette/types.js';
import { useRef } from 'react';
import DroppableArea from './DroppableArea';

function ZeroBet(): JSX.Element {
  const referenceDiv = useRef<HTMLDivElement | null>(null);
  const { setNodeRef } = useDroppable({
    id: '0',
    data: {
      betType: RouletteBetTypes.STRAIGHT,
      selection: 0,
    },
  });

  return (
    <div
      className="cursor-pointer relative rounded-sm flex items-center justify-center w-10 text-sm font-semibold bg-roulette-green hover:bg-roulette-green-hover"
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
