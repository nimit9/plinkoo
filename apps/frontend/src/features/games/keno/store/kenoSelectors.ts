import useKenoStore from './kenoStore';

export const useSelectedTiles = (): Set<number> =>
  useKenoStore(state => {
    return new Set(state.selectedTiles);
  });
