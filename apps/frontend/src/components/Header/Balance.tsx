import { useQuery } from '@tanstack/react-query';
import { BadgeDollarSign } from 'lucide-react';
import { useBalanceStore } from '@/store/balance';
import { getBalance } from '@/api/balance';
import InputWithIcon from '@/common/forms/components/InputWithIcon';

export function Balance(): JSX.Element {
  const { balance, setBalance } = useBalanceStore();

  useQuery({
    queryKey: ['balance'],
    queryFn: async () => {
      const { data } = await getBalance();
      setBalance(data.balance);
      return data.balance;
    },
    refetchInterval: 60000,
    // Refetch every 1 minute
  });

  return (
    <InputWithIcon
      className="disabled:opacity-100 text-base font-semibold"
      disabled
      icon={<BadgeDollarSign className="text-gray-500" />}
      value={balance.toFixed(2)}
      wrapperClassName="shadow-md w-60"
    />
  );
}
