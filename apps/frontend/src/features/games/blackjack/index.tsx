import React from 'react';
import { Games } from '@/const/games';
import GameSettingsBar from '../common/components/game-settings';
import BettingControls from './components/BettingControls';
import GameTable from './components/GameTable';
import useBlackjackStore from './store/blackjackStore';

export default function Blackjack(): JSX.Element {
  const { gameState } = useBlackjackStore();

  return (
    <>
      <div className="flex w-full items-stretch mx-auto rounded-t-md overflow-hidden shadow-md">
        <BettingControls />
        <div className="flex-1 bg-brand-stronger relative">
          <GameTable isGameActive={gameState?.active || false} />
        </div>
      </div>
      <GameSettingsBar game={Games.BLACKJACK} />
    </>
  );
}
