import { sum } from 'lodash';
import type { RouletteBet } from '@repo/common/game-utils/roulette/validations.js';
import { validateBets } from '@repo/common/game-utils/roulette/validations.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { BadgeDollarSignIcon, RefreshCcwIcon, Undo2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { placeBet } from '@/api/games/roulette';
import { getBalance } from '@/api/balance';
import { Games } from '@/const/games';
import GameSettingsBar from '../common/components/game-settings';
import BettingControls from './components/BettingControls';
import RouletteTable from './components/RouletteTable';
import RouletteWheel from './components/RouletteWheel';
import useRouletteStore from './store/rouletteStore';
import { parseBetId } from './utils/helpers';
import { RouletteProvider } from './context/RouletteContext';
import { useWinningNumber } from './store/rouletteStoreSelectors';

export function Roulette({
  isPreview = false,
}: {
  isPreview?: boolean;
}): JSX.Element {
  const {
    undoBet,
    clearBets,
    bets,
    betHistory,
    betAmount,
    setLatestResult,
    latestResult,
    isRouletteWheelStopped,
    setIsRouletteWheelStopped,
  } = useRouletteStore();
  const { data: balance = 0 } = useQuery({
    queryKey: ['balance'],
    queryFn: getBalance,
    refetchInterval: 120000,
    // Refetch every 2 minutes
  });

  const { mutate, isPending: isSpinning } = useMutation({
    mutationFn: (rouletteBets: RouletteBet[]) => placeBet(rouletteBets),
    onSuccess: ({ data }) => {
      setLatestResult(data);
      return data;
    },
    onError: (error) => {
      return error;
    },
  });

  const winningNumber = useWinningNumber();

  const onBet = (): void => {
    if (latestResult) {
      setLatestResult(null);
      return;
    }
    const rouletteBet = Object.entries(bets).map(([betId, amounts]) => {
      const { betType, selection } = parseBetId(betId);
      const totalBetAmount = sum(amounts) / 100;
      return {
        betType,
        ...(selection === null ? {} : { selection }),
        amount: totalBetAmount,
      } as RouletteBet;
    });

    const rouletteBets = validateBets(rouletteBet);
    setIsRouletteWheelStopped(false);
    mutate(rouletteBets);
  };

  return (
    <>
      <RouletteProvider
        isPreview={isSpinning || isPreview || Boolean(latestResult)}
      >
        <div className="flex w-full items-stretch mx-auto rounded-t-md overflow-hidden shadow-md select-none">
          <BettingControls
            betButtonText={latestResult ? 'Spin Again' : 'Spin'}
            icon={latestResult ? <RefreshCcwIcon className="size-4" /> : null}
            isDisabled={
              latestResult
                ? false
                : betHistory.length === 0 ||
                  isSpinning ||
                  !isRouletteWheelStopped ||
                  balance * 100 < betAmount
            }
            isPending={isSpinning ? true : !isRouletteWheelStopped}
            onBet={onBet}
          />
          <div className="flex-1 bg-brand-stronger p-3 relative">
            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-[60%]">
              <RouletteWheel
                isSpinning={isSpinning}
                winningNumber={winningNumber}
              />
            </div>
            <div className="absolute left-[15%] top-[20%] bg-brand-weaker size-12 rounded font-semibold text-2xl text-neutral-default flex items-center justify-center">
              {isRouletteWheelStopped ? winningNumber : null}
            </div>
            <div className="mt-60 relative">
              <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                {latestResult?.payout && isRouletteWheelStopped ? (
                  <div className="border-4 border-[#00e600] rounded px-6 py-1.5 text-[#00e600] font-bold text-base flex items-center gap-1">
                    {latestResult.payoutMultiplier.toFixed(2)}x
                    <span className="text-neutral-weaker mx-1">|</span>
                    {latestResult.payout}
                    <BadgeDollarSignIcon className="size-4" />
                  </div>
                ) : null}
              </div>
              <RouletteTable />
            </div>
            <div className="flex justify-between mt-2">
              <Button
                className="flex items-center gap-1 bg-transparent hover:bg-transparent text-neutral-default shadow-none group font-semibold"
                onClick={undoBet}
              >
                <Undo2Icon className="size-4 text-neutral-weak group-hover:text-neutral-default" />
                Undo
              </Button>
              <Button
                className="flex items-center gap-1 bg-transparent hover:bg-transparent text-neutral-default shadow-none group font-semibold"
                onClick={clearBets}
              >
                Clear
                <RefreshCcwIcon className="size-4 text-neutral-weak group-hover:text-neutral-default" />
              </Button>
            </div>
          </div>
        </div>
      </RouletteProvider>
      <GameSettingsBar game={Games.ROULETTE} />
    </>
  );
}
