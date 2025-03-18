import type {
  ProvablyFairStateResponse,
  ApiResponse,
} from '@repo/common/types';
import { fetchGet, fetchPost } from './_utils/fetch';

export const fetchActiveSeeds = async (): Promise<
  ApiResponse<ProvablyFairStateResponse>
> =>
  fetchGet('/api/v1/user/provably-fair-state', {
    withCredentials: true,
  });

export const fetchRotateSeedPair = async (
  clientSeed: string,
): Promise<ApiResponse<ProvablyFairStateResponse>> =>
  fetchPost(
    '/api/v1/user/rotate-seeds',
    { clientSeed },
    {
      withCredentials: true,
    },
  );

export const fetchRevealedServerSeed = async (
  hashedServerSeed: string,
): Promise<ApiResponse<{ serverSeed: string | null }>> =>
  fetchGet(`/api/v1/user/unhash-server-seed/${hashedServerSeed}`, {
    withCredentials: true,
  });
