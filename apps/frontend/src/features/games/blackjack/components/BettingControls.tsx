import React, { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getValidActionsMapFromState } from '@repo/common/game-utils/blackjack/utils.js';
import { BlackjackActions } from '@repo/common/game-utils/blackjack/types.js';
import { blackjackBet, getActiveGame, playRound } from '@/api/games/blackjack';
import { Button } from '@/components/ui/button';
import useBlackjackStore from '../store/blackjackStore';
import { BetAmountInput } from '../../common/components/BetAmountInput';
import { BetButton } from '../../common/components/BettingControls';

const BlackjackActionButtons = [
  {
    label: 'Hit',
    value: BlackjackActions.HIT,
    icon: '/games/blackjack/hit.svg',
  },
  {
    label: 'Stand',
    value: BlackjackActions.STAND,
    icon: '/games/blackjack/stand.svg',
  },
  {
    label: 'Split',
    value: BlackjackActions.SPLIT,
    icon: '/games/blackjack/split.svg',
  },
  {
    label: 'Double',
    value: BlackjackActions.DOUBLE,
    icon: '/games/blackjack/double.svg',
  },
];

function BettingControls(): JSX.Element {
  const { betAmount, setBetAmount, gameState, setGameState } =
    useBlackjackStore();

  const {
    isPending: isFetchingActiveGame,
    data: activeGame,
    isError,
  } = useQuery({
    queryKey: ['blackjack-active-game'],
    queryFn: getActiveGame,
    retry: false,
  });

  const { mutate: bet, isPending: isStartingGame } = useMutation({
    mutationKey: ['blackjack-bet'],
    mutationFn: () => blackjackBet({ betAmount }),
    onSuccess: ({ data }) => {
      setGameState(data);
      setBetAmount(Number(data.betAmount));
    },
  });

  const { mutate: playNextRound, isPending: isPlayingRound } = useMutation({
    mutationKey: ['blackjack-play-round'],
    mutationFn: (action: BlackjackActions) => playRound(action),
  });

  const queryClient = useQueryClient();
  const balance = queryClient.getQueryData<number>(['balance']);
  const isDisabled = betAmount > (balance ?? 0) || betAmount <= 0;

  const validActions = getValidActionsMapFromState(gameState?.state || null);

  useEffect(() => {
    if (isError) {
      setGameState(null);
      setBetAmount(0);
      return;
    }
    if (activeGame) {
      setGameState(activeGame.data || null);
      setBetAmount(Number(activeGame.data?.betAmount || 0));
    }
  }, [activeGame, isError, setGameState, setBetAmount]);

  return (
    <div className="w-1/4 bg-brand-weak flex flex-col gap-4 p-3">
      <div className="flex flex-col gap-2">
        <BetAmountInput
          betAmount={betAmount}
          onBetAmountChange={(amount, multiplier = 1) => {
            setBetAmount(amount * multiplier);
          }}
        />
        <div className="grid grid-cols-2 gap-2 gap-y-3 my-2">
          {BlackjackActionButtons.map(action => (
            <Button
              className="bg-brand-weaker rounded-sm text-neutral-default font-medium hover:bg-brand-weakest text-xs mt-1 h-12 flex items-center justify-center gap-1"
              disabled={
                !validActions[action.value as keyof typeof validActions]
              }
              key={action.label}
              onClick={() => {
                playNextRound(action.value);
              }}
            >
              {action.label}
              <img alt={action.label} className="size-4" src={action.icon} />
            </Button>
          ))}
        </div>

        {/* {isGameActive ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div>
                <Label className="pl-px text-xs text-neutral-weak font-medium">
                  Mines
                </Label>
                <div className="flex h-8 rounded-sm overflow-hidden group">
                  <div className="rounded-l-sm flex items-center bg-brand-weaker w-full">
                    <InputWithIcon
                      className="text-neutral-default disabled:opacity-100 font-medium text-xs disabled:cursor-text select-none"
                      icon={null}
                      value={minesCount}
                      wrapperClassName={cn(
                        'bg-brand-weaker h-8 border-brand-weaker shadow-none w-full pr-0 '
                      )}
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label className="pl-px text-xs text-neutral-weak font-medium">
                  Gems
                </Label>
                <div className="flex h-8 rounded-sm overflow-hidden group">
                  <div className="rounded-l-sm flex items-center bg-brand-weaker w-full">
                    <InputWithIcon
                      className="text-neutral-default disabled:opacity-100 font-medium text-xs disabled:cursor-text"
                      icon={null}
                      value={NO_OF_TILES - minesCount}
                      wrapperClassName={cn(
                        'bg-brand-weaker h-8 border-brand-weaker shadow-none w-full pr-0'
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Label className="pl-px text-xs text-neutral-weak font-medium">
                Total Profit ({lastRound?.payoutMultiplier || '1.00'}x)
              </Label>
              <div className="flex h-8 rounded-sm overflow-hidden group">
                <div className="rounded-l-sm flex items-center bg-brand-weaker w-full">
                  <InputWithIcon
                    className="text-neutral-default disabled:opacity-100 font-medium text-xs disabled:cursor-text select-none"
                    icon={null}
                    value={(
                      betAmount * (lastRound?.payoutMultiplier || 1)
                    ).toFixed(2)}
                    wrapperClassName={cn(
                      'bg-brand-weaker h-8 border-brand-weaker shadow-none w-full pr-0 '
                    )}
                  />
                </div>
              </div>
            </div>
            <Button className="bg-brand-weaker rounded-sm text-neutral-default font-semibold hover:bg-brand-weakest text-xs mt-1">
              Pick random tile
            </Button>
          </div>
        ) : (
          <CommonSelect
            label="Mines"
            labelClassName="font-semibold"
            onValueChange={(value: string) => {
              setMinesCount(Number(value));
            }}
            options={Array.from({ length: 24 }, (_, i) => ({
              label: (i + 1).toString(),
              value: (i + 1).toString(),
            }))}
            triggerClassName="h-10 text-sm font-medium bg-brand-stronger"
            value={minesCount.toString()}
          />
        )} */}
      </div>

      <BetButton
        animate="animate-pulse"
        disabled={isDisabled || isFetchingActiveGame}
        isPending={isFetchingActiveGame || isStartingGame}
        loadingImage="/games/mines/bomb.png"
        onClick={bet}
      />
    </div>
  );
}

export default BettingControls;
