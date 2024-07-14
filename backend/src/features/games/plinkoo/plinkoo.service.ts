import { OUTCOMES, TOTAL_DROPS, MULTIPLIERS } from './plinkoo.constants';

export const calculateOutcome = () => {
  let outcome = 0;
  const pattern = [];
  for (let i = 0; i < TOTAL_DROPS; i++) {
    if (Math.random() > 0.5) {
      pattern.push('R');
      outcome++;
    } else {
      pattern.push('L');
    }
  }

  const multiplier = MULTIPLIERS[outcome];
  const possiblieOutcomes = OUTCOMES[outcome];

  return {
    point:
      possiblieOutcomes[
        Math.floor(Math.random() * possiblieOutcomes.length || 0)
      ],
    multiplier,
    pattern,
  };
};
