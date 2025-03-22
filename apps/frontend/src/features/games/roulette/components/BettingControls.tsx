import {
  BetAmountInput,
  BetButton,
} from '../../common/components/BettingControls';
import useRouletteStore from '../store/rouletteStore';
import ChipCarousel from './ChipCarousel';

interface BettingControlsProps {
  isDisabled: boolean;
  isPending: boolean;
  onBet: () => void;
}

function BettingControls({
  isDisabled,
  isPending,
  onBet,
}: BettingControlsProps): JSX.Element {
  const { betAmount, setBetAmount } = useRouletteStore();
  return (
    <div className="w-1/4 bg-brand-weak flex flex-col gap-4 p-3">
      <ChipCarousel />
      <BetAmountInput
        betAmount={betAmount}
        isInputDisabled
        onBetAmountChange={(amount) => {
          setBetAmount(amount);
        }}
      />
      <BetButton
        disabled={isDisabled}
        isPending={isPending}
        loadingImage="/games/roulette/loading-roulette.png"
        onClick={() => {
          onBet();
        }}
      />
    </div>
  );
}

export default BettingControls;
