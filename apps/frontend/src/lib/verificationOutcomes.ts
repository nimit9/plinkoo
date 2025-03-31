import { Games } from '@/const/games';
import type { Game } from '@/const/games';
import { getGeneratedFloats } from './crypto';

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
}: {
  game: Game;
  clientSeed: string;
  serverSeed: string;
  nonce: string;
}): Promise<string> => {
  switch (game) {
    case Games.DICE:
      return diceVerificationOutcomes({ clientSeed, serverSeed, nonce });
    case Games.ROULETTE:
      return rouletteVerificationOutcomes({ clientSeed, serverSeed, nonce });
    default:
      return '';
  }
};
