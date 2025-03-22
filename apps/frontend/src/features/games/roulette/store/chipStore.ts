import { create } from 'zustand';

interface ChipStore {
  selectedChip: number | null;
  setSelectedChip: (chip: number | null) => void;
  draggedChip: {
    activeId: string;
    value: number;
  } | null;
  setDraggedChip: (
    draggedChip: { activeId: string; value: number } | null,
  ) => void;
}

export const useChipStore = create<ChipStore>((set) => ({
  selectedChip: null,
  setSelectedChip: (chip) => {
    set({ selectedChip: chip });
  },
  draggedChip: null,
  setDraggedChip: (draggedChip) => {
    set({ draggedChip });
  },
}));
