import { NotepadTextIcon } from 'lucide-react';
import MyBetsTable from './my-bets-table';

function MyBets(): JSX.Element {
  return (
    <div className="container py-6">
      <div className="flex items-center gap-2">
        <NotepadTextIcon className="size-4 icon-neutral-weak" />
        <h2 className="font-semibold">My Bets</h2>
      </div>
      <MyBetsTable />
    </div>
  );
}

export default MyBets;
