import { HashLoader } from 'react-spinners';
import DiceResultPreview from '@/features/games/dice/components/DiceResultPreview';
import { Games, type Game } from '@/const/games';
import RouletteWheel from '@/features/games/roulette/components/RouletteWheel';

function VerificationResult({
  game,
  outcome,
}: {
  game: Game | null;
  outcome: string | null;
}): JSX.Element {
  const getResult = (): JSX.Element => {
    switch (game) {
      case Games.DICE:
        return <DiceResultPreview result={Number(outcome)} />;
      case Games.ROULETTE:
        return (
          <div className="h-24">
            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-[80%]">
              <RouletteWheel
                isPreview
                isSpinning={false}
                winningNumber={String(outcome)}
              />
            </div>
            <div className="absolute left-5 bottom-5 bg-brand-weaker size-12 rounded font-semibold text-2xl text-neutral-default flex items-center justify-center">
              {outcome}
            </div>
          </div>
        );
      default:
        return <div>Unknown game</div>;
    }
  };

  return (
    <div className="border border-brand-weaker border-dashed rounded-lg p-3 py-12 relative overflow-hidden">
      {outcome ? (
        getResult()
      ) : (
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-neutral-weak text-xs font-medium">
            More inputs are required to verify result
          </p>
          <HashLoader color="#b1b4d3" size={16} />
        </div>
      )}
    </div>
  );
}

export default VerificationResult;
