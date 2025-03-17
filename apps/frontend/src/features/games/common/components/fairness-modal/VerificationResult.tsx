import { HashLoader } from 'react-spinners';
import DiceResultPreview from '@/features/games/dice/components/DiceResultPreview';
import { Games, type Game } from '@/const/games';

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
      default:
        return <div>Unknown game</div>;
    }
  };

  return (
    <div className="border border-brand-weaker border-dashed rounded-lg p-3 py-12">
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
