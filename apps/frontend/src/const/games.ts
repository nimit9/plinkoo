import { DicesIcon } from 'lucide-react';

export enum Games {
  DICE = 'dice',
  SLOTS = 'slots',
}

export type Game = (typeof Games)[keyof typeof Games];

export const GAME_VALUES_MAPPING = {
  [Games.DICE]: { label: 'Dice', icon: DicesIcon, path: '/casino/games/dice' },
};

export const GAMES_DROPDOWN_OPTIONS = [
  {
    label: GAME_VALUES_MAPPING[Games.DICE].label,
    value: Games.DICE,
  },
];
