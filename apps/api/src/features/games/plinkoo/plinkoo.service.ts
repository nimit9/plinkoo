// import { rng } from '../../user/user.service';
import { OUTCOMES, TOTAL_DROPS, MULTIPLIERS } from './plinkoo.constants';

type TPattern = ('L' | 'R')[];

const DIRECTIONS: TPattern = ['L', 'R'];

export const calculateOutcome = (clientSeed: string) => {
  let outcome = 0;
  const pattern: TPattern = [];
  // const floats = rng.generateFloats({ clientSeed, count: TOTAL_DROPS });
  const floats = [2];
  floats.forEach((float) => {
    const direction = DIRECTIONS[Math.floor(float * 2)]; // 0 or 1 -> L or R
    pattern.push(direction);
    if (direction === 'R') {
      outcome++;
    }
  });

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
