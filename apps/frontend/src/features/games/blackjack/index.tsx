import React from 'react';
import { Games } from '@/const/games';
import GameSettingsBar from '../common/components/game-settings';
import BettingControls from './components/BettingControls';

export default function Blackjack(): JSX.Element {
  return (
    <>
      <div className="flex w-full items-stretch mx-auto rounded-t-md overflow-hidden shadow-md">
        <BettingControls />
        <div
          className="flex-1 bg-brand-stronger p-12 px-24 flex justify-center relative bg-[url('/games/blackjack/background.svg')] bg-center bg-size-[20px] bg-no-repeat"
          style={{ backgroundSize: '40%' }}
        />
      </div>
      <GameSettingsBar game={Games.BLACKJACK} />
    </>
  );
}
