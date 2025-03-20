import { useQuery } from '@tanstack/react-query';
import { NotepadTextIcon } from 'lucide-react';
import { fetchUserBetHistory } from '@/api/user';
import { CommonDataTable } from '@/components/ui/common-data-table';
import { columns } from './columns';

function MyBets(): JSX.Element {
  const { data } = useQuery({
    queryKey: ['my-bets'],
    queryFn: () => fetchUserBetHistory({ page: 2, pageSize: 10 }),
  });

  return (
    <div className="container py-6">
      <div className="flex items-center gap-2">
        <NotepadTextIcon className="size-4 icon-neutral-weak" />
        <h2 className="font-semibold">My Bets</h2>
      </div>
      <CommonDataTable
        columns={columns}
        data={data?.data.bets || []}
        pageCount={data?.data.pagination.totalPages || 0}
        setPageIndex={() => {}}
      />
    </div>
  );
}

export default MyBets;
