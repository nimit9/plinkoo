import React from 'react';
import MinesContainer from './MinesContainer';
import { NO_OF_TILES } from '@repo/common/game-utils/mines/constants.js';
import InactiveGameTile from './InactiveGameTile';
import { BetData } from '@repo/common/types';

const MinesBetViz = ({ bet }: { bet: BetData }) => {
  console.log();
  return (
    <MinesContainer>
      {Array.from({ length: NO_OF_TILES }, (_, i) => i).map(number => (
        <InactiveGameTile
          index={number}
          key={number}
          {...{
            isGameWon: bet.payoutMultiplier > 0,
            isGameLost: bet.payoutMultiplier === 0,
            mines: new Set(bet.gameState.mines),
            selectedTiles: new Set(
              bet.gameState.rounds.map(
                ({ selectedTileIndex }: { selectedTileIndex: number }) =>
                  selectedTileIndex
              )
            ),
            lastRound: bet.gameState.rounds.at(-1) || null,
          }}
        />
      ))}
    </MinesContainer>
  );
};

export default MinesBetViz;
