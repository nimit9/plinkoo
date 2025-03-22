import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import BettingControls from './components/BettingControls';
import { useChipStore } from './store/chipStore';
import Chip from './components/Chip';
import RouletteTable from './components/RouletteTable';
import RouletteWheel from './components/RouletteWheel';

export function Roulette(): JSX.Element {
  const { selectedChip, setSelectedChip, draggedChip, setDraggedChip } =
    useChipStore();

  const handleDragStart = (event: DragStartEvent): void => {
    setSelectedChip(event.active.data.current?.value as number);
    setDraggedChip({
      activeId: event.active.id.toString(),
      value: event.active.data.current?.value as number,
    });
  };

  const handleDragEnd = (event: DragEndEvent): void => {
    setDraggedChip(null);
  };

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div className="flex w-full items-stretch mx-auto rounded-t-md overflow-hidden shadow-md">
        <BettingControls
          isDisabled={false}
          isPending={false}
          onBet={() => {}}
        />
        <div className="flex-1 bg-brand-stronger p-3 relative">
          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-[60%]">
            <RouletteWheel />
          </div>
          <div className="mt-60">
            <RouletteTable />
          </div>
        </div>
      </div>
      <DragOverlay>
        {draggedChip?.activeId ? (
          <Chip size={8} value={draggedChip.value} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
