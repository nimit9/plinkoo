import { RouletteBetTypes } from '@repo/common/game-utils/roulette/types.js';
import { sum } from 'lodash';
import { cn } from '@/lib/utils';
import { useRouletteBoardHoverStore } from '../../store/rouletteBoardHoverStore';
import useRouletteStore from '../../store/rouletteStore';
import Chip from '../Chip';

function ColumnBet({ column }: { column: number }): JSX.Element {
  const { setHoverId } = useRouletteBoardHoverStore();

  const betId = `${RouletteBetTypes.COLUMN}-${column}`;
  const { bets, addBet } = useRouletteStore();

  const isBet = bets[betId] && bets[betId].length > 0;
  const betAmount = sum(bets[betId]);

  return (
    <div
      className={cn(
        'cursor-pointer relative rounded-sm flex items-center justify-center size-10 text-sm font-semibold bg-brand-stronger hover:bg-roulette-black-hover shadow-[inset_0_0_0_.15em_#2f4553] hover:shadow-[inset_0_0_0_.15em_#4b6e84]',
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
      2:1
      {isBet ? (
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
          <Chip id={betId} size={6} value={betAmount} />
        </div>
      ) : null}
    </div>
  );
}

export default ColumnBet;
