import { useQuery } from '@tanstack/react-query';
import React, { Fragment, useMemo } from 'react';
import { convertFloatsToGameEvents } from '@repo/common/game-utils/mines/utils.js';
import { HashLoader } from 'react-spinners';
import { chunk } from 'lodash';
import { NO_OF_TILES_KENO } from '@repo/common/game-utils/keno/constants.js';
import { calculateSelectedGems } from '@repo/common/game-utils/keno/utils.js';
import {
  byteGenerator,
  getFisherYatesShuffle,
  getGeneratedFloats,
} from '@/lib/crypto';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

const generateUniqueId = (
  prefix: string,
  ...parts: (string | number)[]
): string => {
  return `${prefix}-${parts.join('-')}`;
};

interface KenoResultBreakdownProps {
  clientSeed?: string;
  nonce?: string;
  serverSeed?: string;
}
function KenoResultBreakdown({
  clientSeed,
  nonce,
  serverSeed,
}: KenoResultBreakdownProps): JSX.Element {
  const { data: hmacArray = [] } = useQuery({
    queryKey: ['hmacBuffer', serverSeed, clientSeed, nonce],
    queryFn: async () => {
      const bytes = await byteGenerator(
        serverSeed ?? '',
        `${clientSeed}:${nonce}`,
        2
      );
      return bytes;
    },
  });

  const { data: floats } = useQuery({
    queryKey: ['result', serverSeed, clientSeed, nonce],
    queryFn: async () => {
      const result = await getGeneratedFloats({
        count: 10,
        seed: serverSeed ?? '',
        message: `${clientSeed}:${nonce}`,
      });
      return result;
    },
  });

  const gameEvents = convertFloatsToGameEvents(floats, NO_OF_TILES_KENO);

  const drawnNumbers = calculateSelectedGems(gameEvents, 10);
  const finalDrawnNumbers = drawnNumbers.map(num => num + 1);

  const fisherYatesShuffle = getFisherYatesShuffle({
    gameEvents,
    stopCount: 10,
    totalEventsPossible: NO_OF_TILES_KENO,
  });

  // Create unique identifiers for each byte in the hmacArray
  const hmacByteIds = useMemo(() => {
    return hmacArray.map((byte, idx) => ({
      byte,
      id: generateUniqueId('byte', byte, idx, Date.now()),
    }));
  }, [hmacArray]);

  const chunkedHmacByteIds = chunk(
    hmacByteIds,
    Math.ceil(hmacByteIds.length / 2)
  );

  //   Create unique identifiers for selected bytes
  const selectedByteIds = useMemo(() => {
    return hmacArray.map((byte, idx) => ({
      byte,
      id: generateUniqueId('selected-byte', byte, idx, Date.now()),
    }));
  }, [hmacArray]);

  const chunkedSelectedByteIds = chunk(selectedByteIds, 4);

  if (!serverSeed || !clientSeed || !floats) {
    return <HashLoader className="mx-auto my-16" color="#b1b4d3" size={16} />;
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <Label>Final Result</Label>
        <p className="font-semibold text-sm tracking-wider">
          <span className="tracking-widest">( {drawnNumbers.join(', ')} )</span>
        </p>
        <div className="font-semibold tracking-widest">+ 1 =</div>
        <p className="font-semibold text-sm tracking-wider">
          <span className="tracking-widest">
            ( {finalDrawnNumbers.join(', ')} )
          </span>
        </p>
      </div>

      <div>
        <Label>Casino Seeds to Bytes</Label>
        <div className="flex flex-col gap-4 my-1">
          {chunkedHmacByteIds.map((chunkedHmacByteId, index) => (
            <div key={generateUniqueId('chunk', index)}>
              <p className="text-sm mb-0.5 font-semibold tracking-wider">
                {`HMAC_SHA256(${serverSeed}, ${clientSeed}:${nonce}:${index})`}
              </p>
              <div className="flex gap-2 text-sm overflow-x-auto no-scrollbar">
                {chunkedHmacByteId.map(({ byte, id }, chunkIndex) => (
                  <div
                    className={cn(
                      'text-neutral-default flex flex-col gap-1 items-center font-medium',
                      {
                        'text-neutral-weak': chunkIndex >= 8 && index === 1,
                      }
                    )}
                    key={id}
                  >
                    <span>{byte.toString(16).padStart(2, '0')}</span>
                    <span className="font-semibold">{byte}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Bytes to Number</Label>
        <div className="overflow-x-auto no-scrollba">
          <div className="flex gap-6 w-max text-sm r">
            {chunkedSelectedByteIds.slice(0, 10).map((selectedBytes, index) => {
              return (
                <div className="flex-1" key={generateUniqueId('chunk', index)}>
                  <div className="grid grid-cols-11">
                    <div className="col-span-11 font-semibold tracking-widest">{`(${selectedBytes.map(({ byte }) => byte).join(', ')}) -> [0, ..., ${NO_OF_TILES_KENO - 1 - index}] = ${Math.floor(floats[index] * (NO_OF_TILES_KENO - index))}`}</div>
                    {selectedBytes.map(({ byte, id }, i) => (
                      <Fragment key={id}>
                        <span className="col-span-1 font-medium">
                          {i > 0 ? '+' : ''}
                        </span>
                        <span className="font-semibold col-span-5 place-self-end grid grid-cols-14 gap-[0.5px]">
                          {(byte / 256 ** (i + 1))
                            .toFixed(12)
                            .split('')
                            .map((char, charIndex) => (
                              <div
                                className="place-self-center"
                                key={generateUniqueId(
                                  'char',
                                  char,
                                  charIndex,
                                  byte
                                )}
                              >
                                {char}
                              </div>
                            ))}
                        </span>
                        <span className="text-neutral-weak col-span-5 place-self-end tracking-wider">
                          {`(${Array((3 - (byte.toString().length % 3)) % 3)
                            .fill('0')
                            .join('')}${byte} / (256 ^ ${i + 1}))`}
                        </span>
                      </Fragment>
                    ))}
                    <span className="col-span-1 font-medium">=</span>
                    <span className="font-semibold col-span-5 place-self-end grid grid-cols-14 gap-[0.5px]">
                      {floats[index]
                        .toFixed(12)
                        .split('')
                        .map((char, charIndex) => (
                          <div
                            className="place-self-center"
                            key={generateUniqueId(
                              'outcome-char',
                              char,
                              charIndex
                            )}
                          >
                            {char}
                          </div>
                        ))}
                    </span>
                    <span className="text-neutral-weak col-span-5 place-self-end tracking-wider">
                      (&#215; {NO_OF_TILES_KENO - index})
                    </span>
                    <span className="col-span-1 font-medium">=</span>
                    <span className="font-semibold col-span-5 place-self-start tracking-widest">
                      {
                        String(
                          (floats[index] * (NO_OF_TILES_KENO - index)).toFixed(
                            12
                          )
                        ).split('.')[0]
                      }
                      <span className="text-neutral-weak">
                        .
                        {
                          String(
                            (
                              floats[index] *
                              (NO_OF_TILES_KENO - index)
                            ).toFixed(12)
                          ).split('.')[1]
                        }
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div>
        <Label>Numbers to Shuffle</Label>
        <div className="flex flex-col gap-1 my-1 w-full text-neutral-default font-medium overflow-x-auto no-scrollbar">
          {fisherYatesShuffle.map(({ array, chosenIndex }, index) => (
            <div key={generateUniqueId('fisher-yates-shuffle', index)}>
              <div className="flex gap-2 w-full justify-stretch text-sm">
                {array.map((byte, idx) => (
                  <div
                    className={cn('flex-1 px-px text-center', {
                      'bg-blue-500': idx === chosenIndex,
                    })}
                    key={generateUniqueId('byte', byte, idx, Date.now())}
                  >
                    {byte}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default KenoResultBreakdown;
