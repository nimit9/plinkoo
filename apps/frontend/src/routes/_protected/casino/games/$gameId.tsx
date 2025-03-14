import { createFileRoute } from '@tanstack/react-router';
import { Dice } from '@/features/games/dice';
import { Roulette } from '@/features/games/roulette';
import { Mines } from '@/features/games/mines';
import { Plinkoo } from '@/features/games/plinkoo';

export const Route = createFileRoute('/_protected/casino/games/$gameId')({
  component: GamePage,
});

function GamePage(): JSX.Element {
  const { gameId } = Route.useParams();

  switch (gameId) {
    case 'dice':
      return <Dice />;
    case 'roulette':
      return <Roulette />;
    case 'mines':
      return <Mines />;
    case 'plinkoo':
      return <Plinkoo />;
    default:
      return <div>Game not found</div>;
  }
}
