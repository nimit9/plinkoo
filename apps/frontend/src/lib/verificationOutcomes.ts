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

export const getVerificationOutcome = async ({
  game,
  clientSeed,
  serverSeed,
  nonce,
}: {
  game: string;
  clientSeed: string;
  serverSeed: string;
  nonce: string;
}): Promise<string> => {
  switch (game) {
    case 'dice':
      return diceVerificationOutcomes({ clientSeed, serverSeed, nonce });
    default:
      return '';
  }
};
