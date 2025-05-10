import { DicesIcon, ShipWheelIcon } from 'lucide-react';

export enum Games {
  DICE = 'dice',
  ROULETTE = 'roulette',
  MINES = 'mines',
  KENO = 'keno',
}

export type Game = (typeof Games)[keyof typeof Games];

export const GAME_VALUES_MAPPING = {
  [Games.DICE]: { label: 'Dice', icon: DicesIcon, path: '/casino/games/dice' },
  [Games.ROULETTE]: {
    label: 'Roulette',
    icon: ShipWheelIcon,
    path: '/casino/games/roulette',
  },
  [Games.MINES]: {
    label: 'Mines',
    // icon: MineIcon,
    path: '/casino/games/mines',
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
  {
    label: GAME_VALUES_MAPPING[Games.MINES].label,
    value: Games.MINES,
  },
];
