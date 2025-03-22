import { useDroppable } from '@dnd-kit/core';
import React from 'react';
import { cn } from '@/lib/utils';
import { useRouletteBoardHoverStore } from '../../store/rouletteBoardHoverStore';

function BottomNumberBets({
  action,
  label,
}: {
  action: string;
  label: string;
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
        'col-span-2 cursor-pointer rounded-sm flex items-center justify-center h-10 w-full text-sm font-semibold bg-brand-stronger hover:bg-roulette-black-hover shadow-[inset_0_0_0_.15em_#2f4553] hover:shadow-[inset_0_0_0_.15em_#4b6e84]',
        {
          'bg-roulette-black-hover shadow-[inset_0_0_0_.15em_#4b6e84]': isOver,
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
    >
      {label}
    </div>
  );
}

export default BottomNumberBets;
