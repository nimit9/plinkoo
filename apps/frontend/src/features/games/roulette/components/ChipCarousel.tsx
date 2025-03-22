import { useRef } from 'react';
import { useBalanceStore } from '@/store';
import { Label } from '@/components/ui/label';
import { useChipStore } from '../store/chipStore';
import ScrollNextButton from './ScrollNextButton';
import ScrollPrevButton from './ScrollPrevButton';
import Chip from './Chip';

function ChipCarousel(): JSX.Element {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { balance } = useBalanceStore();
  const { selectedChip, setSelectedChip } = useChipStore();
  const scrollLeft = (): void => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -100,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = (): void => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 100,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-xs font-semibold">
        Chip Value:{' '}
        <span className="font-bold">
          {selectedChip ? (selectedChip / 100).toFixed(2) : 0}
        </span>
      </Label>
      <div className="flex items-stretch rounded-sm shadow-sm h-12">
        <ScrollPrevButton onClick={scrollLeft} />
        <div
          className="flex-1 overflow-auto no-scrollbar border-brand-weaker hover:border-brand-weakest border-2 hover:border-2"
          ref={scrollContainerRef}
        >
          <div className="flex items-center h-full justify-stretch w-full gap-2 px-2">
            {Array.from({
              length: Math.floor(Math.log10(balance * 100)) + 1,
            }).map((_, index) => (
              <Chip
                disabled={balance * 100 < 10 ** index}
                isSelected={selectedChip === 10 ** index}
                key={Math.random()}
                onClick={() => {
                  setSelectedChip(10 ** index);
                }}
                size={8}
                value={10 ** index}
              />
            ))}
          </div>
        </div>

        <ScrollNextButton onClick={scrollRight} />
      </div>
    </div>
  );
}

export default ChipCarousel;
