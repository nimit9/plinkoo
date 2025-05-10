import range from 'lodash/range';
import type { KenoRisk } from '@repo/common/game-utils/keno/types.js';
// import { rng } from '../../user/user.service';
import { PAYOUT_MULTIPLIERS } from '@repo/common/game-utils/keno/constants.js';

const NO_OF_TILES = 40;

const drawNumbers = (randomFloats: number[]) => {
  let tiles = range(NO_OF_TILES);

  const draw = randomFloats.map(float => {
    const tile = tiles[Math.floor(float * tiles.length)];
    tiles = [...tiles.slice(0, tile), ...tiles.slice(tile + 1)];
    return tile;
  });
  return draw;
};

const getPayoutMultiplier = (
  drawnNumbers: number[],
  selectedTiles: number[],
  risk: KenoRisk
) => {
  const drawnNumbersSet = new Set(drawnNumbers);
  let matches = 0;
  for (const tile of selectedTiles) {
    if (drawnNumbersSet.has(tile)) {
      matches++;
    }
  }
  return PAYOUT_MULTIPLIERS[risk][selectedTiles.length][matches];
};

export const getResult = (
  clientSeed: string,
  selectedTiles: number[],
  risk: KenoRisk
) => {
  const floats = [2];

  const drawnNumbers = drawNumbers(floats);
  const payoutMultiplier = getPayoutMultiplier(
    drawnNumbers,
    selectedTiles,
    risk
  );

  return {
    state: {
      risk,
      selectedTiles,
      drawnNumbers,
    },
    payoutMultiplier,
  };
};
