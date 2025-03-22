import { cn } from '@/lib/utils';
import { useRouletteBoardHoverStore } from '../../store/rouletteBoardHoverStore';

function ColumnBet({ column }: { column: number }): JSX.Element {
  const { setHoverId } = useRouletteBoardHoverStore();
  return (
    <div
      className={cn(
        'cursor-pointer rounded-sm flex items-center justify-center size-10 text-sm font-semibold bg-brand-stronger hover:bg-roulette-black-hover shadow-[inset_0_0_0_.15em_#2f4553] hover:shadow-[inset_0_0_0_.15em_#4b6e84]',
      )}
      onMouseEnter={() => {
        setHoverId(`column-${column}`);
      }}
      onMouseLeave={() => {
        setHoverId(null);
      }}
    >
      2:1
    </div>
  );
}

export default ColumnBet;
