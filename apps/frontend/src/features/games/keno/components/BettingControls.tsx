import { useQueryClient } from '@tanstack/react-query';
import type { KenoRisk } from '@repo/common/game-utils/keno/types.js';
import CommonSelect from '@/components/ui/common-select';
import { Button } from '@/components/ui/button';
import { BetButton } from '../../common/components/BettingControls';
import { BetAmountInput } from '../../common/components/BetAmountInput';
import useKenoStore from '../store/kenoStore';
import { KenoRiskDropdown } from '../const';
import { NO_OF_TILES_KENO } from '@repo/common/game-utils/keno/constants.js';
import { useSelectedTiles } from '../store/kenoSelectors';

function BettingControls(): JSX.Element {
  const {
    betAmount,
    setBetAmount,
    kenoRisk,
    setKenoRisk,
    clearTiles,
    updateSelectedTile,
  } = useKenoStore();

  const selectedTiles = useSelectedTiles();

  //   const {
  //     isPending: isFetchingActiveGame,
  //     data: activeGame,
  //     isError,
  //   } = useQuery({
  //     queryKey: ['keno-active-game'],
  //     queryFn: getActiveGame,
  //     retry: false,
  //   });

  //   const { mutate: cashout, isPending: isCashingOut } = useMutation({
  //     mutationKey: ['mines-cashout'],
  //     mutationFn: cashOut,
  //     onSuccess: ({ data }) => {
  //       setGameState(data);
  //     },
  //   });

  //   const { mutate: start, isPending: isStartingGame } = useMutation({
  //     mutationKey: ['mines-start-game'],
  //     mutationFn: () => startGame({ betAmount, minesCount }),
  //     onSuccess: ({ data }) => {
  //       setGameState(data);
  //       setBetAmount(Number(data.betAmount));
  //     },
  //   });
  const queryClient = useQueryClient();
  const balance = queryClient.getQueryData<number>(['balance']);
  const isDisabled =
    betAmount > (balance ?? 0) || betAmount <= 0 || selectedTiles.size === 0;

  // async function to update selected tile and sleep for 200ms
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const autoPickTiles = async () => {
    // Choose 10 random tiles between 1 and 40
    const randomTiles = new Set<number>();
    while (randomTiles.size < 10) {
      const randomTile = Math.floor(Math.random() * NO_OF_TILES_KENO) + 1;
      randomTiles.add(randomTile);
    }
    for (const tile of randomTiles) {
      updateSelectedTile(tile);
      await sleep(100);
    }
  };

  return (
    <div className="w-1/4 bg-brand-weak flex flex-col gap-4 p-3">
      <div className="flex flex-col gap-2">
        <BetAmountInput
          betAmount={betAmount}
          onBetAmountChange={(amount, multiplier = 1) => {
            setBetAmount(amount * multiplier);
          }}
        />
        <CommonSelect
          label="Risk"
          labelClassName="font-semibold"
          onValueChange={value => {
            setKenoRisk(value as KenoRisk);
          }}
          options={KenoRiskDropdown}
          triggerClassName="h-10 text-sm font-medium bg-brand-stronger"
          value={kenoRisk}
        />
        <Button
          className="bg-brand-weaker rounded-sm text-neutral-default font-medium hover:bg-brand-weakest text-sm mt-1"
          onClick={autoPickTiles}
        >
          Auto Pick
        </Button>
        <Button
          className="bg-brand-weaker rounded-sm text-neutral-default font-medium hover:bg-brand-weakest text-sm mt-1"
          onClick={clearTiles}
        >
          Clear Table
        </Button>
      </div>

      <BetButton
        animate="animate-pulse"
        disabled={isDisabled}
        isPending={false}
        loadingImage="/games/mines/bomb.png"
        onClick={() => {
          // Handle button click
        }}
      />
    </div>
  );
}

export default BettingControls;
