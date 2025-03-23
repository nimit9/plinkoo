import { DicesIcon, ShipWheelIcon } from 'lucide-react';

export enum Games {
  DICE = 'dice',
  ROULETTE = 'roulette',
}

export type Game = (typeof Games)[keyof typeof Games];

export const GAME_VALUES_MAPPING = {
  [Games.DICE]: { label: 'Dice', icon: DicesIcon, path: '/casino/games/dice' },
  [Games.ROULETTE]: {
    label: 'Roulette',
    icon: ShipWheelIcon,
    path: '/casino/games/roulette',
  },
};

export const GAMES_DROPDOWN_OPTIONS = [
  {
    label: GAME_VALUES_MAPPING[Games.DICE].label,
    value: Games.DICE,
  },
  {
    label: GAME_VALUES_MAPPING[Games.ROULETTE].label,
    value: Games.ROULETTE,
  },
];
