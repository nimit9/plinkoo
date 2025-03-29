import { useQuery } from '@tanstack/react-query';
import { BadgeDollarSign } from 'lucide-react';
import { getBalance } from '@/api/balance';
import InputWithIcon from '@/common/forms/components/InputWithIcon';

export function Balance(): JSX.Element {
  const { data: balance } = useQuery({
    queryKey: ['balance'],
    queryFn: async () => getBalance(),
    refetchInterval: 120000,
    // Refetch every 2 minutes
  });

  return (
    <InputWithIcon
      className="disabled:opacity-100 text-base font-semibold"
      disabled
      icon={<BadgeDollarSign className="text-gray-500" />}
      value={balance?.toFixed(2)}
      wrapperClassName="shadow-md w-60"
    />
  );
}
