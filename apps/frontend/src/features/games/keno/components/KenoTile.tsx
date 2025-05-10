import { cn } from '@/lib/utils';
import { useSelectedTiles } from '../store/kenoSelectors';
import useKenoStore from '../store/kenoStore';

function KenoTile({
  isLoading,
  index,
}: {
  isLoading: boolean;
  index: number;
}): JSX.Element {
  const selectedTiles = useSelectedTiles();

  const { updateSelectedTile } = useKenoStore();

  const isSelected = selectedTiles.has(index);

  const handleClick = (): void => {
    if (isLoading) return;
    updateSelectedTile(index);
  };

  return (
    <div
      className={cn(
        'size-20 bg-brand-weaker rounded-md cursor-pointer flex items-center justify-center hover:-translate-y-0.5 text-2xl font-semibold hover:bg-brand-weakest',
        {
          'bg-keno-selected-tile hover:bg-keno-selected-tile-hover': isSelected,
        }
      )}
      key={index}
      onClick={handleClick}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
      role="button"
      style={
        !isSelected
          ? {
              boxShadow: '0 0.3em #213743',
            }
          : {
              boxShadow: '0 0.3em rgb(113, 0, 199)',
            }
      }
      tabIndex={0}
    >
      {index}
    </div>
  );
}

export default KenoTile;
