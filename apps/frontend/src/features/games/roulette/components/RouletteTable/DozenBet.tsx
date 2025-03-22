import { RouletteBetTypes } from '@repo/common/game-utils/roulette/types.js';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { useRouletteBoardHoverStore } from '../../store/rouletteBoardHoverStore';

function DozenBet({ dozen }: { dozen: number }): JSX.Element {
  const { setHoverId } = useRouletteBoardHoverStore();
  const { setNodeRef } = useDroppable({
    id: `${RouletteBetTypes.DOZEN}-${dozen}`,
    data: {
      betType: RouletteBetTypes.DOZEN,
      selection: dozen,
    },
  });
  return (
    <div
      className={cn(
        'cursor-pointer rounded-sm flex items-center justify-center h-10 w-full text-sm font-semibold bg-brand-stronger hover:bg-roulette-black-hover shadow-[inset_0_0_0_.15em_#2f4553] hover:shadow-[inset_0_0_0_.15em_#4b6e84]',
      )}
      onMouseEnter={() => {
        setHoverId(`dozen-${dozen}`);
      }}
      onMouseLeave={() => {
        setHoverId(null);
      }}
      ref={setNodeRef}
    >
      {12 * (dozen - 1) + 1} to {12 * (dozen - 1) + 12}
    </div>
  );
}

export default DozenBet;
