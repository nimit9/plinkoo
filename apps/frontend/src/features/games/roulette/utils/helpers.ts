const getBetTypeSelectionId = (
  betSelection: number | number[] | null,
): string => {
  if (typeof betSelection === 'number') {
    return betSelection.toString();
  }
  if (Array.isArray(betSelection)) {
    return betSelection.join('-');
  }
  return 'null';
};

export { getBetTypeSelectionId };
