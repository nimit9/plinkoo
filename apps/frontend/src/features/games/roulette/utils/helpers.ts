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

const parseBetId = (
  betId: string,
): {
  betType: string;
  selection: number | number[] | null;
} => {
  const [betType, ...selectionParts] = betId.split('-');

  if (selectionParts.length === 0 || selectionParts[0] === 'null') {
    return { betType, selection: null };
  }

  if (selectionParts.length === 1) {
    return {
      betType,
      selection: parseInt(selectionParts[0], 10),
    };
  }

  // If we have multiple parts, it's an array of numbers
  return {
    betType,
    selection: selectionParts.map((part) => parseInt(part, 10)),
  };
};

export { getBetTypeSelectionId, parseBetId };
