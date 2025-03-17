export enum Games {
  DICE = 'dice',
  SLOTS = 'slots',
}

export type Game = (typeof Games)[keyof typeof Games];

export const GAME_VALUES_MAPPING = {
  [Games.DICE]: 'Dice',
  [Games.SLOTS]: 'Slots',
};

export const GAMES_DROPDOWN_OPTIONS = [
  {
    label: GAME_VALUES_MAPPING[Games.DICE],
    value: Games.DICE,
  },
];
