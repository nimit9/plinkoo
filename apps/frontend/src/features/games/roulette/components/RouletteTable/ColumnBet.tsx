import { useDroppable } from '@dnd-kit/core';
import { RouletteBetTypes } from '@repo/common/game-utils/roulette/types.js';
import { cn } from '@/lib/utils';
import { useRouletteBoardHoverStore } from '../../store/rouletteBoardHoverStore';

function ColumnBet({ column }: { column: number }): JSX.Element {
  const { setHoverId } = useRouletteBoardHoverStore();
  const { setNodeRef, isOver } = useDroppable({
    id: `${RouletteBetTypes.COLUMN}-${column}`,
    data: {
      betType: RouletteBetTypes.COLUMN,
      selection: column,
    },
  });
  return (
    <div
      className={cn(
        'cursor-pointer rounded-sm flex items-center justify-center size-10 text-sm font-semibold bg-brand-stronger hover:bg-roulette-black-hover shadow-[inset_0_0_0_.15em_#2f4553] hover:shadow-[inset_0_0_0_.15em_#4b6e84]',
        {
          'bg-roulette-black-hover shadow-[inset_0_0_0_.15em_#4b6e84]': isOver,
        },
      )}
      onMouseEnter={() => {
        setHoverId(`column-${column}`);
      }}
      onMouseLeave={() => {
        setHoverId(null);
      }}
      ref={setNodeRef}
    >
      2:1
    </div>
  );
}

export default ColumnBet;
