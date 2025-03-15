import type { UseMutateFunction } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import type {
  DiceResultState,
  PlaceBetRequest,
} from '@repo/common/game-utils/dice/types.js';
import { placeBet } from '@/api/games/dice';
import { useAudio } from '@/common/hooks/useAudio';
import win from '@/assets/audio/win.mp3';

interface UseDiceBettingProps {
  betAmount: number;
  updateBalance: (amount: number) => void;
  setResult: (result: DiceResultState) => void;
  setLastResultId: (id: string) => void;
}

interface UseDiceBettingResult {
  mutate: UseMutateFunction<DiceResultState, Error, PlaceBetRequest>;
  isPending: boolean;
}

export function useDiceBetting({
  betAmount,
  updateBalance,
  setResult,
  setLastResultId,
}: UseDiceBettingProps): UseDiceBettingResult {
  const { play: playWinSound } = useAudio(win);

  const { mutate, isPending } = useMutation({
    mutationFn: placeBet,
    onSuccess: (result) => {
      setResult(result);
      setLastResultId(Date.now().toString());
      const balanceChange =
        result.payoutMultiplier > 0
          ? betAmount * result.payoutMultiplier - betAmount
          : -betAmount;
      updateBalance(balanceChange);
      if (result.payoutMultiplier > 0) {
        void playWinSound();
      }
    },
  });

  return {
    mutate,
    isPending,
  };
}
