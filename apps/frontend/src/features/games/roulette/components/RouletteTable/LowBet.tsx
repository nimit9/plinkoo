import React from 'react';
import { cn } from '@/lib/utils';

function LowBet(): JSX.Element {
  return (
    <div
      className={cn(
        'cursor-pointer rounded-sm flex items-center justify-center h-10 w-full text-sm font-semibold bg-brand-stronger hover:bg-roulette-black-hover shadow-[inset_0_0_0_.15em_#2f4553] hover:shadow-[inset_0_0_0_.15em_#4b6e84]',
      )}
    >
      Low
    </div>
  );
}

export default LowBet;
