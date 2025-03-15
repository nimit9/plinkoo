import {
  type DiceResultState,
  type PlaceBetRequest,
} from '@repo/common/game-utils/dice/types.js';
import { fetchPost } from '../_utils/fetch';

export const placeBet = async (
  data: PlaceBetRequest,
): Promise<DiceResultState> => {
  return fetchPost<PlaceBetRequest, DiceResultState>(
    '/api/v1/games/dice/place-bet',
    data,
    {
      withCredentials: true,
    },
  );
};
