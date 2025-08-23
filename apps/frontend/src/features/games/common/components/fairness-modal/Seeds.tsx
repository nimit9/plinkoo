import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { ProvablyFairStateResponse } from '@repo/common/types';
import { toast } from 'react-hot-toast';
import { isAxiosError } from 'axios';
import { fetchActiveSeeds, fetchRotateSeedPair } from '@/api/user';
import ActiveSeeds from './ActiveSeeds';
import RotateSeedPair from './RotateSeedPair';

function Seeds({ isEnabled }: { isEnabled: boolean }): JSX.Element {
  const [activeSeeds, setActiveSeeds] =
    useState<ProvablyFairStateResponse | null>(null);
  const { isPending } = useQuery({
    queryKey: ['active-seeds'],
    queryFn: async () => {
      const apiResponse = await fetchActiveSeeds();
      setActiveSeeds(apiResponse.data);
      return apiResponse.data;
    },
    enabled: isEnabled,
  });

  const { mutate: rotateSeedPair, isPending: isRotating } = useMutation({
    mutationFn: async (clientSeed: string) => {
      const apiResponse = await fetchRotateSeedPair(clientSeed);
      return apiResponse.data;
    },
    onSuccess: data => {
      setActiveSeeds(data);
    },
    onError: (error: Error) => {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message as string, {
          style: {
            borderRadius: '10px',
            background: '#0f212e',
            color: '#fff',
          },
        });
        return;
      }
      toast.error(
        'Something went wrong while rotating the seed pair. Please try again later.'
      );
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <ActiveSeeds
        activeSeeds={activeSeeds}
        isLoading={isPending || isRotating}
      />
      <RotateSeedPair
        activeSeeds={activeSeeds}
        isLoading={isPending || isRotating}
        rotateSeedPair={rotateSeedPair}
      />
    </div>
  );
}

export default Seeds;
