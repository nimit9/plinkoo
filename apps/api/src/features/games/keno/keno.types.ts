export type KenoRisk = 'low' | 'medium' | 'high' | 'classic';
export type KenoPayout = Record<number, Record<number, number>>;
export type KenoPayoutMultiplier = Record<KenoRisk, KenoPayout>;
