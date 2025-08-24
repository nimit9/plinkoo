import type { ApiResponse, PaginatedBetData } from '@repo/common/types';
import { fetchGet } from '../_utils/fetch';

export const fetchAllBets = async (): Promise<
  ApiResponse<{ bets: PaginatedBetData[] }>
> =>
  fetchGet('/api/v1/games/bets', {
    withCredentials: true,
  });
