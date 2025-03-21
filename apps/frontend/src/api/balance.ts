import type { ApiResponse } from '@repo/common/types';
import { fetchGet } from './_utils/fetch';

export interface BalanceResponse {
  balance: number;
}

export const getBalance = (): Promise<ApiResponse<BalanceResponse>> => {
  return fetchGet('/api/v1/user/balance', {
    withCredentials: true,
  });
};
