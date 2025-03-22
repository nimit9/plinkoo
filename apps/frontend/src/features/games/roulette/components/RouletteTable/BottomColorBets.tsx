import { useDroppable } from '@dnd-kit/core';
import { RouletteBetTypes } from '@repo/common/game-utils/roulette/types.js';
import { cn } from '@/lib/utils';
import { useRouletteBoardHoverStore } from '../../store/rouletteBoardHoverStore';

function BottomColorBets({
  action,
}: {
  action: RouletteBetTypes;
}): JSX.Element {
  const { setHoverId } = useRouletteBoardHoverStore();
  const { setNodeRef, isOver } = useDroppable({
    id: action,
    data: {
      betType: action,
    },
  });
  return (
    <div
      className={cn(
        'cursor-pointer col-span-2 w-full h-10 rounded-sm',
        action === RouletteBetTypes.RED
          ? 'bg-roulette-red hover:bg-roulette-red-hover'
          : 'bg-roulette-black hover:bg-roulette-black-hover',
        {
          'bg-roulette-red-hover': isOver && action === RouletteBetTypes.RED,
          'bg-roulette-black-hover':
            isOver && action === RouletteBetTypes.BLACK,
        },
      )}
      key={action}
      onMouseEnter={() => {
        setHoverId(action);
      }}
      onMouseLeave={() => {
        setHoverId(null);
      }}
      ref={setNodeRef}
    />
  );
}

export default BottomColorBets;
