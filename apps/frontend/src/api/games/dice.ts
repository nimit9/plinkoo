import { fetchPost } from '../_utils/fetch';

export const placeBet = async ({
  target,
  condition,
  clientSeed = 'P7xjSv-1ff',
}: {
  target: number;
  condition: string;
  clientSeed?: string;
}) => {
  return fetchPost(
    '/api/v1/games/dice/place-bet',
    {
      target,
      condition,
      clientSeed,
    },
    {
      withCredentials: true,
    },
  );
};
