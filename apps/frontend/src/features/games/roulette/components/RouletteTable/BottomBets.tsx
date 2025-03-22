import { RouletteBetTypes } from '@repo/common/game-utils/roulette/types.js';
import { cn } from '@/lib/utils';
import { useRouletteBoardHoverStore } from '../../store/rouletteBoardHoverStore';

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
  const { setHoverId } = useRouletteBoardHoverStore();
  return (
    <>
      {bottomBets.map(({ action, label }) => {
        if (typeof label === 'string') {
          return (
            <div
              className={cn(
                'col-span-2 cursor-pointer rounded-sm flex items-center justify-center h-10 w-full text-sm font-semibold bg-brand-stronger hover:bg-roulette-black-hover shadow-[inset_0_0_0_.15em_#2f4553] hover:shadow-[inset_0_0_0_.15em_#4b6e84]',
              )}
              key={action}
              onMouseEnter={() => {
                setHoverId(action);
              }}
              onMouseLeave={() => {
                setHoverId(null);
              }}
            >
              {label}
            </div>
          );
        }
        return (
          <div
            className="cursor-pointer col-span-2 "
            key={action}
            onMouseEnter={() => {
              setHoverId(action);
            }}
            onMouseLeave={() => {
              setHoverId(null);
            }}
          >
            {label}
          </div>
        );
      })}
    </>
  );
}

export default BottomBets;
