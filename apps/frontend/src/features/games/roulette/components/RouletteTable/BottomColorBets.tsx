import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useRouletteBoardHoverStore } from '../../store/rouletteBoardHoverStore';

function BottomColorBets({
  action,
  label,
}: {
  action: string;
  label: JSX.Element;
}): JSX.Element {
  const { setHoverId } = useRouletteBoardHoverStore();
  const { setNodeRef } = useDroppable({
    id: action,
    data: {
      betType: action,
    },
  });
  return (
    <div
      className="cursor-pointer col-span-2 "
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

export default BottomColorBets;
