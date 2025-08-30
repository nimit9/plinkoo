import { Games } from '@/const/games';
import { BetData } from '@repo/common/types';
import DiceBetViz from '@/features/games/dice/components/DiceBetViz';
import MinesBetViz from '@/features/games/mines/components/MinesBetViz';
import VerificationResultKenoTile from '@/features/games/keno/components/VerificationResultKenoTile';
import { NO_OF_TILES_KENO } from '@repo/common/game-utils/keno/constants.js';
import KenoTileUI from '@/features/games/keno/components/KenoTileUI';
import InputWithIcon from '@/common/forms/components/InputWithIcon';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { KenoRisk, KenoRiskLabels } from '@/features/games/keno/const';

const GameViz = ({ bet }: { bet: BetData }) => {
  switch (bet.game as Games) {
    case Games.DICE: {
      return <DiceBetViz gameState={bet.gameState} />;
    }
    case Games.MINES: {
      return <MinesBetViz bet={bet} />;
    }
    case Games.KENO: {
      const selectedTiles = new Set(bet.gameState.selectedTiles);
      const drawnNumbers = new Set(bet.gameState.drawnNumbers);
      return (
        <div className="flex flex-col gap-4 py-2">
          <div className="grid grid-cols-8 mx-auto justify-items-center gap-2.5">
            {Array.from({ length: NO_OF_TILES_KENO }, (_, i) => i).map(
              number => (
                <KenoTileUI
                  key={number}
                  isSelected={selectedTiles.has(number)}
                  isDrawn={drawnNumbers.has(number)}
                  index={number}
                  isTileDisabled={!selectedTiles.has(number)}
                  className="lg:size-12 md:size-12 md:text-sn lg:text-sm p-2"
                />
              )
            )}
          </div>
          <div>
            <Label className="pl-px text-xs text-neutral-weak font-medium">
              Risk
            </Label>
            <InputWithIcon
              className="text-neutral-default disabled:opacity-100 font-medium text-xs disabled:cursor-text"
              icon={null}
              value={KenoRiskLabels[bet.gameState.risk as KenoRisk]}
              wrapperClassName={cn(
                'bg-brand-weaker h-8 border-brand-weaker shadow-none w-full pr-0'
              )}
              disabled
            />
          </div>
        </div>
      );
    }
    default:
      return null;
  }
};

export default GameViz;
