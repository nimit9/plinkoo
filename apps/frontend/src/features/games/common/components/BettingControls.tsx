import { BadgeDollarSign } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import InputWithIcon from '@/common/forms/components/InputWithIcon';

export interface BettingControlsProps {
  betAmount?: number;
  profitOnWin?: number;
  isPending?: boolean;
  onBetAmountChange?: (amount: number) => void;
  onBet?: () => Promise<void>;
}

export function BetAmountInput({
  betAmount,
  onBetAmountChange,
  isInputDisabled,
}: Pick<BettingControlsProps, 'betAmount' | 'onBetAmountChange'> & {
  isInputDisabled?: boolean;
}): JSX.Element {
  const queryClient = useQueryClient();
  const balance = queryClient.getQueryData<number>(['balance']) || 0;
  return (
    <div>
      <Label className="pl-px text-xs font-semibold">Bet Amount</Label>
      <div className="flex h-10 rounded-r overflow-hidden shadow-md group">
        <div className="bg-input-disabled rounded-l flex items-center gap-1">
          <InputWithIcon
            disabled={isInputDisabled}
            icon={<BadgeDollarSign className="text-gray-500" />}
            min={0}
            onChange={(e) => {
              onBetAmountChange?.(Number(e.target.value));
            }}
            step={1}
            type="number"
            value={betAmount}
            wrapperClassName="rounded-r-none rounded-none rounded-l"
          />
        </div>
        <BetAmountButton
          disabled={betAmount ? betAmount === 0 || betAmount / 2 < 0.01 : true}
          label="½"
          onClick={() => {
            onBetAmountChange?.((betAmount ?? 0) / 2);
          }}
        />
        <BetAmountButton
          disabled={
            betAmount ? betAmount === 0 || 2 * betAmount > balance : true
          }
          label="2×"
          onClick={() => {
            onBetAmountChange?.((betAmount ?? 0) * 2);
          }}
        />
      </div>
    </div>
  );
}

function BetAmountButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}): JSX.Element {
  return (
    <Button
      className="bg-input-disabled text-white rounded-none h-full hover:bg-opacity-80 hover:bg-[#557086]"
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

function ProfitDisplay({
  profitOnWin,
}: Pick<BettingControlsProps, 'profitOnWin'>): JSX.Element {
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

export function BetButton({
  isPending,
  disabled,
  onClick,
  loadingImage,
}: Pick<BettingControlsProps, 'isPending'> & {
  disabled: boolean;
  onClick: () => void;
} & {
  loadingImage: string;
}): JSX.Element {
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
          src={loadingImage}
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
  isPending,
  onBetAmountChange,
  onBet,
}: BettingControlsProps): JSX.Element {
  const queryClient = useQueryClient();
  const balance = queryClient.getQueryData<number>(['balance']);
  const isDisabled =
    (betAmount ?? 0) > (balance ?? 0) || (betAmount ?? 0) <= 0 || isPending;

  return (
    <div className="w-1/4 bg-brand-weak flex flex-col gap-4 p-3">
      <BetAmountInput
        betAmount={betAmount}
        onBetAmountChange={onBetAmountChange}
      />
      <ProfitDisplay profitOnWin={profitOnWin} />
      <BetButton
        disabled={Boolean(isDisabled)}
        isPending={isPending}
        loadingImage="/games/dice/loading-dice.png"
        onClick={() => void onBet?.()}
      />
    </div>
  );
}
