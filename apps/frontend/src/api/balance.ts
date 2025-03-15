import { fetchGet } from './_utils/fetch';

export interface BalanceResponse {
  balance: number;
}

export const getBalance = (): Promise<BalanceResponse> => {
  return fetchGet<BalanceResponse>('/api/v1/user/balance', {
    withCredentials: true,
  });
};
