import { rng } from '../../rng/rng.service';
import { DiceCondition } from './dice.types';

const HOUSE_EDGE = 0.99;

const getPayoutMultiplier = ({
  condition,
  target,
  result,
}: {
  condition: DiceCondition;
  target: number;
  result: number;
}) => {
  switch (condition) {
    case 'above':
      return result > target ? (HOUSE_EDGE / (100 - target)) * 100 : 0;
    case 'below':
      return result < target ? (HOUSE_EDGE / target) * 100 : 0;
    default:
      return 0;
  }
};

export const getResult = ({
  clientSeed,
  target,
  condition,
}: {
  clientSeed: string;
  target: number;
  condition: DiceCondition;
}) => {
  const [float] = rng.generateFloats({
    clientSeed,
    count: 1,
  });
  const result = (float * 10001) / 100; // 0.00 to 100.00

  const payoutMultiplier = getPayoutMultiplier({ result, condition, target });

  return {
    state: {
      target,
      condition,
      result,
    },
    payoutMultiplier,
  };
};
