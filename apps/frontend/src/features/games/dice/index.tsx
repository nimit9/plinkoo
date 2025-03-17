import useDiceStore from '@/features/games/dice/store/diceStore';
import { useBalanceStore } from '@/store/balance';
import { Games } from '@/const/games';
import { BettingControls } from '../common/components/BettingControls';
import GameSettingsBar from '../common/components/game-settings';
import { DiceResultPillsCarousel } from './components/DiceResultPillsCarousel';
import { useDiceAudio } from './hooks/useDiceAudio';
import { useDiceBetting } from './hooks/useBetting';
import { useResultSlider } from './hooks/useResultSlider';
import { useSliderValue } from './hooks/useSliderValue';
import DiceSlider from './components/DiceSlider';
import { DiceGameControls } from './components/DiceGameControls';
import { diceGameControls } from './config/controls';

export function DiceGame(): JSX.Element {
  const diceState = useDiceStore();
  const { betAmount, profitOnWin, results, setBetAmount, setResult } =
    diceState;

  const { balance, setBalance } = useBalanceStore();
  const { playBetSound } = useDiceAudio(false);
  const { showResultSlider, setLastResultId } = useResultSlider();
  const { handleValueChange } = useSliderValue();
  const { mutate, isPending } = useDiceBetting({
    betAmount,
    setBalance,
    setResult,
    setLastResultId,
  });

  const handleBet = async (): Promise<void> => {
    await playBetSound();
    mutate({
      target: diceState.target,
      condition: diceState.condition,
      betAmount,
    });
  };

  return (
    <>
      <div className="flex w-full items-stretch mx-auto rounded-t-md overflow-hidden shadow-md">
        <BettingControls
          balance={balance}
          betAmount={betAmount}
          isPending={isPending}
          onBet={handleBet}
          onBetAmountChange={setBetAmount}
          profitOnWin={profitOnWin}
        />
        <div className="flex-1 bg-background p-3">
          <DiceResultPillsCarousel results={results} />
          <div className="py-40 w-3/4 mx-auto flex flex-col gap-2">
            <DiceSlider
              handleValueChange={handleValueChange}
              showResultSlider={showResultSlider}
            />
          </div>
          <DiceGameControls controls={diceGameControls} state={diceState} />
        </div>
      </div>
      <GameSettingsBar game={Games.DICE} />
    </>
  );
}
