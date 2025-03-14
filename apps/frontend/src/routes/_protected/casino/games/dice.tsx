import { createFileRoute } from '@tanstack/react-router';
import { BadgeDollarSign, Percent, RefreshCw, XIcon } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import InputWithIcon from '@/common/forms/components/InputWithIcon';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/dice-slider';
import { Slider as ResultSlider } from '@/components/ui/dice-result-slider';
import useDiceStore, {
  type DiceResultState,
} from '@/features/games/dice/store/diceStore';
import { placeBet } from '@/api/games/dice';
import { cn } from '@/lib/utils';
import { useAudio } from '@/common/hooks/useAudio';
import bet from '@/assets/audio/bet.mp3';
import tick from '@/assets/audio/tick.mp3';
import rolling from '@/assets/audio/rolling.mp3';
import win from '@/assets/audio/win.mp3';

export const Route = createFileRoute('/_protected/casino/games/dice')({
  component: DiceGame,
});

function DiceGame(): JSX.Element {
  const {
    betAmount,
    profitOnWin,
    multiplier,
    target,
    winChance,
    condition,
    results,
    setTarget,
    toggleCondition,
    setMultiplier,
    setWinningChance,
    setBetAmount,
    setResult,
  } = useDiceStore();
  const { mutate, isPending } = useMutation({
    mutationFn: placeBet,
    onSuccess: ({ data }: { data: DiceResultState }) => {
      setResult(data);
      setLastResultId(Date.now().toString());
      if (data.payoutMultiplier > 0) {
        void playWinSound();
      }
    },
  });

  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const { play: playBetSound } = useAudio(bet);
  const { playThrottled: playTickSound } = useAudio(tick, 0.8);
  const { playInfinite: playRollingSound, stop: stopRollingSound } =
    useAudio(rolling);
  const { play: playWinSound } = useAudio(win);

  useEffect(() => {
    if (isPending) {
      playRollingSound();
    } else {
      stopRollingSound();
    }

    return () => {
      stopRollingSound();
    };
  }, [isPending, playRollingSound, stopRollingSound]);

  const handleValueChange = (value: number[]): void => {
    const newValue = value[0];

    if (previousValue === newValue) return;

    if (previousValue !== null) {
      playSoundForRange(previousValue, newValue);
    }

    setPreviousValue(newValue);
    setTarget(newValue);
  };

  const playSoundForRange = (start: number, end: number): void => {
    const lowerBound = Math.min(start, end);
    const upperBound = Math.max(start, end);

    for (let i = lowerBound; i <= upperBound; i++) {
      playTickSound();
    }
  };

  const [showResultSlider, setShowResultSlider] = useState(false);
  const [lastResultId, setLastResultId] = useState<string | null>(null);

  const startTimer = useCallback(() => {
    setShowResultSlider(true);
    const timer = setTimeout(() => {
      setShowResultSlider(false);
    }, 3000);
    return timer;
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (lastResultId) {
      timer = startTimer();
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [lastResultId, results, startTimer]);

  const getAnimationClass = (index: number, resultsLength: number): string => {
    if (resultsLength <= 5) return 'animate-slideInLeft';
    return index === 0
      ? 'animate-slideOutLeft opacity-0'
      : 'animate-slideInLeft';
  };

  return (
    <div className="flex w-full items-stretch rounded-md overflow-hidden shadow-md">
      <div className="w-1/4 bg-secondary-light flex flex-col gap-4 p-3">
        <div className="">
          <Label className="pl-px text-gray-300 font-semibold">
            Bet Amount
          </Label>
          <div className="flex h-10 rounded-r overflow-hidden shadow-md group">
            <div className="p-0.5 bg-input-disabled rounded-l flex items-center gap-1  group-hover:bg-[#557086]">
              <InputWithIcon
                icon={<BadgeDollarSign className="text-gray-500" />}
                min={0}
                onChange={(e) => {
                  setBetAmount(Number(e.target.value));
                }}
                step={1}
                type="number"
                value={betAmount}
                wrapperClassName="rounded-r-none rounded-none rounded-l"
              />
            </div>
            <Button
              className="bg-input-disabled text-white rounded-none h-full hover:bg-opacity-80 hover:bg-[#557086]"
              onClick={() => {
                setBetAmount(betAmount / 2);
              }}
            >
              ½
            </Button>
            <Button
              className="bg-input-disabled text-white rounded-none h-full hover:bg-[#557086]"
              onClick={() => {
                setBetAmount(betAmount * 2);
              }}
            >
              2×
            </Button>
          </div>
        </div>
        <div>
          <Label className="pl-px text-gray-300 font-semibold">
            Profit on Win
          </Label>
          <InputWithIcon
            className="disabled:opacity-100"
            disabled
            icon={<BadgeDollarSign className="text-gray-500" />}
            value={profitOnWin}
            wrapperClassName="bg-input-disabled shadow-md"
          />
        </div>
        <Button
          className="w-full bg-[#00e600] hover:bg-[#1fff20] text-black font-semibold h-12 text-base"
          onClick={() => {
            void (async () => {
              await playBetSound();
              mutate({ target, condition });
            })();
          }}
        >
          {isPending ? (
            <img
              alt="Result Dice"
              className="animate-spin h-4 w-4"
              src="/games/dice/loading-dice.png"
            />
          ) : (
            'Bet'
          )}
        </Button>
      </div>
      <div className="flex-1 bg-background p-3">
        <div className="flex w-full items-center justify-end gap-2 min-h-8">
          {results.map(({ id, result }, index) => (
            <span
              className={cn(
                'text-white p-2 rounded-full transition-transform w-16 text-center text-xs font-semibold',
                getAnimationClass(index, results.length),
                result.payoutMultiplier > 0
                  ? 'bg-[#00e600] text-black'
                  : 'bg-secondary-light',
              )}
              key={id}
            >
              {result.state.result}
            </span>
          ))}
        </div>
        <div className="py-40 w-3/4 mx-auto flex flex-col gap-2">
          <div className="flex items-center justify-between w-full gap-2 pl-6 pr-4">
            {[0, 25, 50, 75, 100].map((value) => {
              return (
                <div className="font-semibold" key={value}>
                  {value}
                </div>
              );
            })}
          </div>
          <div className="border-input-disabled border-[12px]  p-2 rounded-full relative">
            <Slider
              condition={condition}
              onValueChange={handleValueChange}
              step={1}
              value={[target]}
            />
            {showResultSlider && results.at(-1)?.result.state.result ? (
              <div className="absolute w-full -top-6 transition-transform animate-slideInLeft">
                {(() => {
                  const lastResult = results.at(-1);
                  if (!lastResult) return null;
                  return (
                    <ResultSlider
                      success={lastResult.result.payoutMultiplier > 0}
                      value={[lastResult.result.state.result]}
                    />
                  );
                })()}
              </div>
            ) : null}
          </div>
        </div>
        <div className="bg-secondary-light px-4 py-2 rounded flex gap-4 w-full">
          <div className="flex-1">
            <Label className="pl-px text-gray-300 font-semibold">
              Multiplier
            </Label>
            <InputWithIcon
              icon={<XIcon className="text-gray-500" />}
              min={0}
              onChange={(e) => {
                setMultiplier(Number(e.target.value));
              }}
              step={0.0001}
              type="number"
              value={multiplier}
            />
          </div>
          <div className="flex-1">
            <Label className="pl-px text-gray-300 font-semibold">
              Roll {condition === 'above' ? 'Over' : 'Under'}
            </Label>
            <div
              className="bg-background h-9 w-full rounded flex items-center justify-between px-3 text-sm cursor-pointer"
              onClick={toggleCondition}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  toggleCondition();
                }
              }}
              role="button"
              tabIndex={0}
            >
              <span>{target}</span>
              <RefreshCw className="text-gray-500 w-5 h-5 cursor-pointer" />
            </div>
          </div>
          <div className="flex-1">
            <Label className="pl-px text-gray-300 font-semibold">
              Win chance
            </Label>
            <InputWithIcon
              icon={<Percent className="text-gray-500 w-5 h-5" />}
              min={0.01}
              onChange={(e) => {
                setWinningChance(Number(e.target.value));
              }}
              step={0.01}
              type="number"
              value={winChance}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
