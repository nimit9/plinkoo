import { IUser, ApiResponse } from '@repo/common/types';
import { fetchGet } from './_utils/fetch';

export const getUserDetails = async () => {
  return fetchGet('/api/v1/auth/me', {
    withCredentials: true,
  }) as Promise<ApiResponse<IUser>>;
};
