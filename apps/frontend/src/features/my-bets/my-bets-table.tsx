import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchUserBetHistory } from '@/api/user';
import { CommonDataTable } from '@/components/ui/common-data-table';
import { columns } from './columns';

function MyBetsTable(): JSX.Element {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data } = useQuery({
    queryKey: ['my-bets', pagination],
    queryFn: () =>
      fetchUserBetHistory({
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
      }),
    placeholderData: prev => prev,
  });
  return (
    <CommonDataTable
      columns={columns}
      data={data?.data.bets || []}
      pageCount={data?.data.pagination.totalPages || 0}
      pagination={pagination}
      rowCount={data?.data.pagination.totalCount || 0}
      setPagination={setPagination}
    />
  );
}

export default MyBetsTable;
