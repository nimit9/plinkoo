import { useState } from 'react';
import CommonSelect from '@/components/ui/common-select';
import { GAMES_DROPDOWN_OPTIONS, type Game } from '@/const/games';
import VerificationResult from './VerificationResult';
import VerificationInputs from './VerificationInputs';

function Verify({ game }: { game: Game }): JSX.Element {
  const [outcome, setOutcome] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game>(game);

  return (
    <>
      <div className="p-3">
        <VerificationResult game={selectedGame} outcome={outcome} />
      </div>
      <div className="bg-brand-stronger p-3 flex flex-col gap-2">
        <CommonSelect
          label="Game"
          onValueChange={(value) => {
            setSelectedGame(value as Game);
          }}
          options={GAMES_DROPDOWN_OPTIONS}
          value={selectedGame}
        />
        <VerificationInputs game={selectedGame} setOutcome={setOutcome} />
      </div>
    </>
  );
}

export default Verify;
