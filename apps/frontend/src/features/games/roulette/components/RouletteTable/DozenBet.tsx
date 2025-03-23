import { RouletteBetTypes } from '@repo/common/game-utils/roulette/types.js';
import { sum } from 'lodash';
import { cn } from '@/lib/utils';
import { useRouletteBoardHoverStore } from '../../store/rouletteBoardHoverStore';
import useRouletteStore from '../../store/rouletteStore';
import Chip from '../Chip';

function DozenBet({ dozen }: { dozen: number }): JSX.Element {
  const { setHoverId } = useRouletteBoardHoverStore();

  const betId = `${RouletteBetTypes.DOZEN}-${dozen}`;
  const { bets, addBet } = useRouletteStore();

  const isBet = bets[betId] && bets[betId].length > 0;
  const betAmount = sum(bets[betId]);

  return (
    <div
      className={cn(
        'cursor-pointer relative select-none rounded-sm flex items-center justify-center h-10 w-full text-sm font-semibold bg-brand-stronger hover:bg-roulette-black-hover shadow-[inset_0_0_0_.15em_#2f4553] hover:shadow-[inset_0_0_0_.15em_#4b6e84]',
      )}
      onClick={(e) => {
        e.stopPropagation();
        addBet(betId);
      }}
      onKeyDown={(event) => {
        return event;
      }}
      onMouseEnter={() => {
        setHoverId(betId);
      }}
      onMouseLeave={() => {
        setHoverId(null);
      }}
      role="button"
      tabIndex={0}
    >
      {12 * (dozen - 1) + 1} to {12 * (dozen - 1) + 12}
      {isBet ? (
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
          <Chip id={betId} size={6} value={betAmount} />
        </div>
      ) : null}
    </div>
  );
}

export default DozenBet;
