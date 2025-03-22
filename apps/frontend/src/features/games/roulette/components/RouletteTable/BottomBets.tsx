import { RouletteBetTypes } from '@repo/common/game-utils/roulette/types.js';
import BottomNumberBets from './BottomNumberBets';
import BottomColorBets from './BottomColorBets';

const bottomBets = [
  {
    action: RouletteBetTypes.LOW,
    label: '1 to 18',
  },
  {
    action: RouletteBetTypes.EVEN,
    label: 'Even',
  },
  {
    action: RouletteBetTypes.RED,
    label: (
      <div className="bg-roulette-red hover:bg-roulette-red-hover h-10 w-full rounded-sm" />
    ),
  },
  {
    action: RouletteBetTypes.BLACK,
    label: (
      <div className="bg-roulette-black hover:bg-roulette-black-hover h-10 w-full rounded-sm" />
    ),
  },
  {
    action: RouletteBetTypes.ODD,
    label: 'Odd',
  },
  {
    action: RouletteBetTypes.HIGH,
    label: '19 to 36',
  },
];

function BottomBets(): JSX.Element {
  return (
    <>
      {bottomBets.map(({ action, label }) => {
        if (typeof label === 'string') {
          return (
            <BottomNumberBets action={action} key={action} label={label} />
          );
        }
        return <BottomColorBets action={action} key={action} label={label} />;
      })}
    </>
  );
}

export default BottomBets;
