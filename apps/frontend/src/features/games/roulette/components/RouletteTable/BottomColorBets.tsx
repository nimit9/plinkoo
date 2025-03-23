import { RouletteBetTypes } from '@repo/common/game-utils/roulette/types.js';
import { sum } from 'lodash';
import { cn } from '@/lib/utils';
import { useRouletteBoardHoverStore } from '../../store/rouletteBoardHoverStore';
import useRouletteStore from '../../store/rouletteStore';
import Chip from '../Chip';

function BottomColorBets({
  action,
}: {
  action: RouletteBetTypes;
}): JSX.Element {
  const { setHoverId } = useRouletteBoardHoverStore();

  const betId = action;
  const { bets, addBet } = useRouletteStore();

  const isBet = bets[betId] && bets[betId].length > 0;
  const betAmount = sum(bets[betId]);

  return (
    <div
      className={cn(
        'cursor-pointer relative col-span-2 w-full h-10 rounded-sm',
        action === RouletteBetTypes.RED
          ? 'bg-roulette-red hover:bg-roulette-red-hover'
          : 'bg-roulette-black hover:bg-roulette-black-hover',
      )}
      key={action}
      onClick={(e) => {
        e.stopPropagation();
        addBet(betId);
      }}
      onKeyDown={(event) => {
        return event;
      }}
      onMouseEnter={() => {
        setHoverId(action);
      }}
      onMouseLeave={() => {
        setHoverId(null);
      }}
      role="button"
      tabIndex={0}
    >
      {isBet ? (
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
          <Chip id={betId} size={6} value={betAmount} />
        </div>
      ) : null}
    </div>
  );
}

export default BottomColorBets;
