import { sum } from 'lodash';
import type { RouletteBet } from '@repo/common/game-utils/roulette/validations.js';
import { validateBets } from '@repo/common/game-utils/roulette/validations.js';
import type { RouletteBetTypes } from '@repo/common/game-utils/roulette/types.js';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { placeBet } from '@/api/games/roulette';
import BettingControls from './components/BettingControls';
import RouletteTable from './components/RouletteTable';
import RouletteWheel from './components/RouletteWheel';
import useRouletteStore from './store/rouletteStore';
import { parseBetId } from './utils/helpers';

export function Roulette(): JSX.Element {
  const { undoBet, clearBets, bets, betHistory } = useRouletteStore();

  const { mutate } = useMutation({
    mutationFn: (bets: RouletteBet[]) => placeBet(bets),
    onSuccess: (data) => {
      console.log('data', data);
    },
    onError: (error) => {
      console.log('error', error);
    },
  });

  const onBet = () => {
    const rouletteBet = Object.entries(bets).map(([betId, betAmount]) => {
      const { betType, selection } = parseBetId(betId);
      const totalBetAmount = sum(betAmount) / 100;
      return {
        betType,
        ...(selection === null ? {} : { selection }),
        amount: totalBetAmount,
      } as RouletteBet;
    });
    console.log('rouletteBet', rouletteBet);

    const rouletteBets = validateBets(rouletteBet);
    mutate(rouletteBets);
  };

  return (
    <div className="flex w-full items-stretch mx-auto rounded-t-md overflow-hidden shadow-md">
      <BettingControls
        isDisabled={betHistory.length === 0}
        isPending={false}
        onBet={onBet}
      />
      <div className="flex-1 bg-brand-stronger p-3 relative">
        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-[60%]">
          <RouletteWheel />
        </div>
        <div className="mt-60">
          <RouletteTable />
        </div>
        <Button onClick={undoBet}>Undo</Button>
        <Button onClick={clearBets}>Clear</Button>
      </div>
    </div>
  );
}
