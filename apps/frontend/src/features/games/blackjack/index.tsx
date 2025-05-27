import React from 'react';
import { Games } from '@/const/games';
import GameSettingsBar from '../common/components/game-settings';
import BettingControls from './components/BettingControls';

export default function Blackjack(): JSX.Element {
  return (
    <>
      <div className="flex w-full items-stretch mx-auto rounded-t-md overflow-hidden shadow-md">
        <BettingControls />
        {/* <div className="flex-1 bg-brand-stronger p-3 px-24 flex justify-center relative">
          <div className="inline-grid grid-cols-5 mx-auto justify-items-center gap-2.5">
            {Array.from({ length: NO_OF_TILES }, (_, i) => i).map(number =>
              isGameActive || !gameState ? (
                <ActiveGameTile
                  index={number}
                  isLoading={loadingTiles.has(number)}
                  key={number}
                  onClick={() => {
                    if (isGameActive) {
                      setLoadingTiles(prev => {
                        const newSet = new Set(prev);
                        newSet.add(number);
                        return newSet;
                      });
                      play(number);
                    }
                  }}
                />
              ) : (
                <InactiveGameTile
                  index={number}
                  key={number}
                  {...{
                    isGameWon,
                    isGameLost,
                    mines,
                    selectedTiles,
                    lastRound,
                  }}
                />
              )
            )}
          </div>
          {isGameWon ? (
            <div className="absolute flex flex-col gap-2 border-[6px] border-[#00e600] rounded-xl left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-default p-2.5 w-32 items-center">
              <p className="text-[#00e600] text-xl font-bold">
                {payoutMultiplier || '1.00'}x
              </p>
              <div className="border-2 border-neutral-weaker w-1/2" />
              <p className="text-[#00e600] text-lg font-bold flex items-center gap-1">
                {payout || 0}
                <BadgeDollarSignIcon className="size-4" />
              </p>
            </div>
          ) : null}
        </div> */}
      </div>
      <GameSettingsBar game={Games.BLACKJACK} />
    </>
  );
}
