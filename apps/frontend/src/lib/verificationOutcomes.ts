import { NO_OF_TILES } from '@repo/common/game-utils/mines/constants.js';
import {
  convertFloatsToGameEvents,
  calculateMines,
} from '@repo/common/game-utils/mines/utils.js';
import { Games } from '@/const/games';
import type { Game } from '@/const/games';
import { getGeneratedFloats } from './crypto';

interface MinesGameMeta {
  minesCount: number;
}
export type GameMeta = MinesGameMeta | undefined;

const diceVerificationOutcomes = async ({
  clientSeed,
  serverSeed,
  nonce,
}: {
  clientSeed: string;
  serverSeed: string;
  nonce: string;
}): Promise<string> => {
  const [float] = await getGeneratedFloats({
    count: 1,
    seed: serverSeed,
    message: `${clientSeed}:${nonce}`,
  });
  const result = (float * 10001) / 100;
  return result.toFixed(2);
};

const minesVerificationOutcomes = async ({
  clientSeed,
  serverSeed,
  nonce,
  meta,
}: {
  clientSeed: string;
  serverSeed: string;
  nonce: string;
  meta?: MinesGameMeta;
}): Promise<number[]> => {
  const minesCount = meta?.minesCount ?? 3;
  const floats = await getGeneratedFloats({
    count: NO_OF_TILES - 1,
    seed: serverSeed,
    message: `${clientSeed}:${nonce}`,
  });
  const gameEvents = convertFloatsToGameEvents(floats, NO_OF_TILES);
  const mines = calculateMines(gameEvents, minesCount);
  return mines;
};

const rouletteVerificationOutcomes = async ({
  clientSeed,
  serverSeed,
  nonce,
}: {
  clientSeed: string;
  serverSeed: string;
  nonce: string;
}): Promise<string> => {
  const [float] = await getGeneratedFloats({
    count: 1,
    seed: serverSeed,
    message: `${clientSeed}:${nonce}`,
  });
  const result = Math.floor(float * 37);
  return result.toString();
};

export const getVerificationOutcome = async ({
  game,
  clientSeed,
  serverSeed,
  nonce,
  meta,
}: {
  game: Game;
  clientSeed: string;
  serverSeed: string;
  nonce: string;
  meta?: GameMeta;
}): Promise<string | number[]> => {
  switch (game) {
    case Games.DICE:
      return diceVerificationOutcomes({ clientSeed, serverSeed, nonce });
    case Games.ROULETTE:
      return rouletteVerificationOutcomes({ clientSeed, serverSeed, nonce });
    case Games.MINES:
      return minesVerificationOutcomes({ clientSeed, serverSeed, nonce, meta });
    default:
      return '';
  }
};
