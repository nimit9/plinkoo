import { useQuery } from '@tanstack/react-query';
import { CommonDataTable } from '@/components/ui/common-data-table';
import { fetchAllBets } from '@/api/games/bets';
import { columns } from './columns';
import { BetsTableColumns, betsTableViewportWiseColumns } from '@/const/tables';
import { useViewportType } from '@/common/hooks/useViewportType';

function AllBetsTable(): JSX.Element {
  const { data } = useQuery({
    queryKey: ['all-bets'],
    queryFn: () => fetchAllBets(),
    placeholderData: prev => prev,
  });
  const viewport = useViewportType();
  const usedColumns = betsTableViewportWiseColumns[viewport]
    ? columns.filter(col =>
        betsTableViewportWiseColumns[viewport]?.includes(
          col.id as BetsTableColumns
        )
      )
    : columns;
  return <CommonDataTable columns={usedColumns} data={data?.data.bets || []} />;
}

export default AllBetsTable;
