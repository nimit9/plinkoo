import { fetchPost } from '../_utils/fetch';

export const placeBet = async ({
  betAmount,
  selectedTiles,
  risk,
}: {
  betAmount: number;
  selectedTiles: number[];
  risk: string;
}): Promise<any> => {
  return fetchPost(
    '/api/v1/games/keno/place-bet',
    { betAmount, selectedTiles, risk },
    {
      withCredentials: true,
    }
  );
};
