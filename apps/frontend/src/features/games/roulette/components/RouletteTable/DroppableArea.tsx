import { useDroppable } from '@dnd-kit/core';
import type { RouletteBet } from '@repo/common/game-utils/roulette/validations.js';
import { useEffect, useState } from 'react';
import { getBetTypeSelectionId } from '../../utils/helpers';

interface PositionValues {
  top: string | number;
  left: string | number;
  transform?: string;
}

const POSITIONS: Record<string, PositionValues> = {
  TL: { top: '0%', left: '0%', transform: 'translate(-50%, -50%)' },
  TC: { top: '0%', left: '50%', transform: 'translate(-50%, -50%)' },
  TR: {
    top: '0%',
    left: 'calc(100% + 2px)',
    transform: 'translate(-50%, -50%)',
  },
  CR: {
    top: '50%',
    left: 'calc(100% + 2px)',
    transform: 'translate(-50%, -50%)',
  },
  BC: { top: '100%', left: '50%', transform: 'translate(-50%, -50%)' },
  BR: {
    top: 'calc(100% + 2px)',
    left: 'calc(100% + 2px)',
    transform: 'translate(-50%, -50%)',
  },

  // Custom Positions for 0-1, 0-2, 0-3 in Roulette with enlarged hit areas
  '0-1': {
    top: `83.33%`,
    left: 'calc(100% + 2px)',
    transform: 'translate(-50%, -50%)',
  },
  '0-3': {
    top: `16.66%`,
    left: 'calc(100% + 2px)',
    transform: 'translate(-50%, -50%)',
  },
};

function DroppableArea({
  position,
  reference,
  betTypeData,
}: {
  position: keyof typeof POSITIONS;
  reference: React.RefObject<HTMLDivElement>;
  betTypeData: Pick<RouletteBet, 'betType' | 'selection'>;
}): JSX.Element {
  const { setNodeRef } = useDroppable({
    id: `${betTypeData.betType}-${getBetTypeSelectionId(betTypeData.selection)}`,
    data: {
      betType: betTypeData.betType,
      selection: betTypeData.selection,
    },
  });
  const [style, setStyle] = useState({});

  useEffect(() => {
    if (reference.current) {
      const rect = reference.current.getBoundingClientRect();

      const { top, left, transform } = POSITIONS[position];

      setStyle({
        position: 'absolute',
        top: typeof top === 'number' ? rect.top + top : top,
        left: typeof left === 'number' ? rect.left + left : left,
        transform: transform || undefined,
        width: '20px',
        height: '20px',
        zIndex: 10,
      });
    }
  }, [position, reference]);

  return (
    <div ref={setNodeRef} style={style}>
      {/* Use a transparent div with the full size for the hit area */}
      <div className="w-full h-full" />
    </div>
  );
}

export default DroppableArea;
