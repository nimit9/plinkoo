import { BadgeDollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import InputWithIcon from '@/common/forms/components/InputWithIcon';

interface BettingControlsProps {
  betAmount: number;
  profitOnWin: number;
  balance: number;
  isPending: boolean;
  onBetAmountChange: (amount: number) => void;
  onBet: () => Promise<void>;
}

function BetAmountInput({
  betAmount,
  onBetAmountChange,
}: Pick<BettingControlsProps, 'betAmount' | 'onBetAmountChange'>) {
  return (
    <div>
      <Label className="pl-px text-xs font-semibold">Bet Amount</Label>
      <div className="flex h-10 rounded-r overflow-hidden shadow-md group">
        <div className="bg-input-disabled rounded-l flex items-center gap-1">
          <InputWithIcon
            icon={<BadgeDollarSign className="text-gray-500" />}
            min={0}
            onChange={(e) => {
              onBetAmountChange(Number(e.target.value));
            }}
            step={1}
            type="number"
            value={betAmount}
            wrapperClassName="rounded-r-none rounded-none rounded-l"
          />
        </div>
        <BetAmountButton
          label="½"
          onClick={() => {
            onBetAmountChange(betAmount / 2);
          }}
        />
        <BetAmountButton
          label="2×"
          onClick={() => {
            onBetAmountChange(betAmount * 2);
          }}
        />
      </div>
    </div>
  );
}

function BetAmountButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      className="bg-input-disabled text-white rounded-none h-full hover:bg-opacity-80 hover:bg-[#557086]"
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

function ProfitDisplay({
  profitOnWin,
}: Pick<BettingControlsProps, 'profitOnWin'>) {
  return (
    <div>
      <Label className="pl-px text-xs font-semibold">Profit on Win</Label>
      <InputWithIcon
        className="disabled:opacity-100"
        disabled
        icon={<BadgeDollarSign className="text-gray-500" />}
        value={profitOnWin}
        wrapperClassName="bg-input-disabled shadow-md"
      />
    </div>
  );
}

function BetButton({
  isPending,
  disabled,
  onClick,
}: Pick<BettingControlsProps, 'isPending'> & {
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      className="w-full bg-[#00e600] hover:bg-[#1fff20] text-black font-semibold h-12 text-base"
      disabled={disabled}
      onClick={onClick}
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
  );
}

export function BettingControls({
  betAmount,
  profitOnWin,
  balance,
  isPending,
  onBetAmountChange,
  onBet,
}: BettingControlsProps): JSX.Element {
  const isDisabled = betAmount > balance || betAmount <= 0 || isPending;

  return (
    <div className="w-1/4 bg-secondary-light flex flex-col gap-4 p-3">
      <BetAmountInput
        betAmount={betAmount}
        onBetAmountChange={onBetAmountChange}
      />
      <ProfitDisplay profitOnWin={profitOnWin} />
      <BetButton
        disabled={isDisabled}
        isPending={isPending}
        onClick={() => void onBet()}
      />
    </div>
  );
}
