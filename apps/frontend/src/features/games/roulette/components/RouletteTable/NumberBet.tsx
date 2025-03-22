import { redNumbers } from '@repo/common/game-utils/roulette/constants.js';
import { cn } from '@/lib/utils';
import { useRouletteBoardHoverStore } from '../../store/rouletteBoardHoverStore';
import { getIsNumberHover } from '../../utils/hover';

function NumberBet({ number }: { number: number }): JSX.Element {
  const { hoverId } = useRouletteBoardHoverStore();

  const isRedNumber = redNumbers.includes(number.toString());
  const isNumberHover = getIsNumberHover({ number, hoverId });

  return (
    <div
      className={cn(
        'cursor-pointer rounded-sm flex items-center justify-center size-10 text-sm font-semibold',
        isRedNumber
          ? 'bg-roulette-red hover:bg-roulette-red-hover'
          : 'bg-roulette-black hover:bg-roulette-black-hover',
        {
          'bg-roulette-red-hover': isRedNumber && isNumberHover,
          'bg-roulette-black-hover': !isRedNumber && isNumberHover,
        },
      )}
    >
      {number}
    </div>
  );
}

export default NumberBet;
