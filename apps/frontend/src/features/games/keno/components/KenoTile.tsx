import { cn } from '@/lib/utils';
import { useDrawnNumbers, useSelectedTiles } from '../store/kenoSelectors';
import useKenoStore from '../store/kenoStore';

function KenoTile({
  isLoading,
  index,
}: {
  isLoading: boolean;
  index: number;
}): JSX.Element {
  const selectedTiles = useSelectedTiles();
  const drawnNumbers = useDrawnNumbers();

  const { updateSelectedTile, outcome } = useKenoStore();

  const isSelected = selectedTiles.has(index);
  const isDrawn = drawnNumbers.has(index);

  const handleClick = (): void => {
    if (isLoading) return;
    updateSelectedTile(index);
  };

  const isTileDisabled = Boolean(outcome) && !isSelected;

  return (
    <div
      className={cn(
        'size-20 bg-brand-weaker rounded-lg cursor-pointer flex items-center justify-center hover:-translate-y-0.5 text-2xl font-semibold hover:bg-brand-weakest shadow-lg p-3',
        {
          'bg-keno-selected-tile hover:bg-keno-selected-tile-hover shadow-[0_0.3em_rgb(113,0,199)]':
            isSelected && !isDrawn,
          'bg-[#071824] shadow-[0.1px_0.3em_#001017_inset] text-end text-[#e9113c]':
            isDrawn && !isSelected,
          "shadow-[0_0.3em_rgb(113,0,199),0_0_0_0.3em_rgb(150,46,255)_inset] text-[#008a01] bg-[url('/games/keno/gem.svg')] bg-center bg-clip-content bg-origin-content":
            isDrawn && isSelected,
          'hover:translate-y-0 hover:bg-[#071824]':
            isDrawn && (isSelected || isTileDisabled),
          'shadow-[0_0.3em_#213743]': !isSelected && !isDrawn,
          'opacity-40 cursor-default hover:bg-brand-weaker': isTileDisabled,
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
      tabIndex={0}
    >
      {index}
    </div>
  );
}

export default KenoTile;
