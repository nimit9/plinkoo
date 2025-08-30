import { Games } from '@/const/games';
import { BetData } from '@repo/common/types';
import DiceBetViz from '@/features/games/dice/components/DiceBetViz';

const GameViz = ({ bet }: { bet: BetData }) => {
  switch (bet.game as Games) {
    case Games.DICE: {
      return <DiceBetViz gameState={bet.gameState} />;
    }
    default:
      return null;
  }
};

export default GameViz;
