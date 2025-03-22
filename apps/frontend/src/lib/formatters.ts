export function formatCompactNumber(value: number, decimalPlaces = 1): string {
  if (value === 0) return '0';

  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  // Define thresholds and suffixes
  const tiers = [
    { threshold: 1e12, suffix: 'T' },
    { threshold: 1e9, suffix: 'B' },
    { threshold: 1e6, suffix: 'M' },
    { threshold: 1e3, suffix: 'K' },
    { threshold: 1, suffix: '' },
  ];

  // Find the appropriate tier
  const tier = tiers.find((t) => absValue >= t.threshold);

  if (!tier) return '0';

  // Calculate the value in the appropriate unit
  const scaledValue = absValue / tier.threshold;

  // Handle the case where we don't need decimals (e.g., 1K instead of 1.0K)
  if (Number.isInteger(scaledValue)) {
    return `${sign}${scaledValue}${tier.suffix}`;
  }

  // Format with the specified number of decimal places
  const formattedValue = scaledValue.toFixed(decimalPlaces);

  // Remove trailing zeros and decimal point if not needed
  const trimmedValue = formattedValue.replace(/\.0+$/, '');

  return `${sign}${trimmedValue}${tier.suffix}`;
}

export function getYellowToRedColor(value: number, min = 0, max = 100): string {
  // Ensure value is within bounds
  const bounded = Math.max(min, Math.min(max, value));

  // Calculate how far along the gradient we are (0 to 1)
  const ratio = (bounded - min) / (max - min);

  // Start with yellow (255, 206, 0) and transition to dark red
  // Gradually lower green from 206 to 0
  const green = Math.floor(206 * (1 - ratio));

  // Also gradually lower red from 255 to 180 for a deeper red at high values
  const red = Math.floor(255 - ratio * 75);

  return `rgb(${red}, ${green}, 0)`;
}

export function formatColorizedNumber(
  value: number,
  min = 0,
  max = 100,
  decimalPlaces = 1,
): { formatted: string; color: string } {
  return {
    formatted: formatCompactNumber(value, decimalPlaces),
    color: getYellowToRedColor(value, min, max),
  };
}
