import ZeroBet from './ZeroBet';
import NumberBet from './NumberBet';
import ColumnBet from './ColumnBet';
import DozenBet from './DozenBet';
import BottomBets from './BottomBets';

function RouletteTable(): JSX.Element {
  return (
    <div className="grid w-fit grid-cols-14 mx-auto gap-1">
      <div className="flex items-stretch justify-center gap-1 col-span-full">
        <ZeroBet />
        {Array.from({ length: 12 }, (_, index) => index).map((colNum) => (
          <div className="flex flex-col-reverse gap-1" key={colNum}>
            {Array.from({ length: 3 }, (_, index) => index + 1).map(
              (rowNum) => {
                return (
                  <NumberBet
                    key={`${colNum}-${rowNum}`}
                    number={colNum * 3 + rowNum}
                  />
                );
              },
            )}
          </div>
        ))}
        <div className="flex flex-col-reverse gap-1">
          <ColumnBet column={1} />
          <ColumnBet column={2} />
          <ColumnBet column={3} />
        </div>
      </div>
      <div className="col-span-1" />
      <div className="col-span-4">
        <DozenBet dozen={1} />
      </div>
      <div className="col-span-4">
        <DozenBet dozen={2} />
      </div>
      <div className="col-span-4">
        <DozenBet dozen={3} />
      </div>
      <div className="col-span-1" />
      <div className="col-span-1" />
      <BottomBets />
    </div>
  );
}

export default RouletteTable;
