import { useQuery } from '@tanstack/react-query';
import { CommonDataTable } from '@/components/ui/common-data-table';
import { fetchAllBets } from '@/api/games/bets';
import { columns } from './columns';

function AllBetsTable(): JSX.Element {
  const { data } = useQuery({
    queryKey: ['all-bets'],
    queryFn: () => fetchAllBets(),
    placeholderData: prev => prev,
  });
  return <CommonDataTable columns={columns} data={data?.data.bets || []} />;
}

export default AllBetsTable;
