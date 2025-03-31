import { useState } from 'react';
import { Games, GAMES_DROPDOWN_OPTIONS, type Game } from '@/const/games';
import CommonSelect from '@/components/ui/common-select';
import type { VerificationInputsState } from '../games/common/components/fairness-modal/VerificationInputs';
import VerificationInputs from '../games/common/components/fairness-modal/VerificationInputs';
import VerificationResult from '../games/common/components/fairness-modal/VerificationResult';
import DiceResultBreakdown from '../games/dice/components/DiceResultBreakdown';
import RouletteResultBreakdown from '../games/roulette/components/RouletteResultBreakdown';

function ProvablyFairCalculation(): JSX.Element {
  const [outcome, setOutcome] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game>(
    GAMES_DROPDOWN_OPTIONS[0].value,
  );
  const [verificationInputs, setVerificationInputs] =
    useState<VerificationInputsState | null>(null);

  const getGameBreakdown = (): JSX.Element => {
    switch (selectedGame) {
      case Games.DICE:
        return (
          <DiceResultBreakdown
            clientSeed={verificationInputs?.clientSeed}
            nonce={verificationInputs?.nonce}
            serverSeed={verificationInputs?.serverSeed}
          />
        );

      case Games.ROULETTE:
        return (
          <RouletteResultBreakdown
            clientSeed={verificationInputs?.clientSeed}
            nonce={verificationInputs?.nonce}
            serverSeed={verificationInputs?.serverSeed}
          />
        );
      default:
        return <div>Unknown game</div>;
    }
  };
  return (
    <div className="w-3/5 mx-auto">
      <div className="flex flex-col gap-2">
        <CommonSelect
          label="Game"
          onValueChange={(value) => {
            setSelectedGame(value as Game);
          }}
          options={GAMES_DROPDOWN_OPTIONS}
          value={selectedGame}
        />
        <VerificationInputs
          game={selectedGame}
          onSetVerificationInputs={setVerificationInputs}
          setOutcome={setOutcome}
        />
      </div>
      <div className="my-3">
        <VerificationResult game={selectedGame} outcome={outcome} />
      </div>
      <div className="my-3">{getGameBreakdown()}</div>
    </div>
  );
}

export default ProvablyFairCalculation;
