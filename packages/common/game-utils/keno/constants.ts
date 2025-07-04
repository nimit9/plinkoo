import type { KenoPayout, KenoPayoutMultiplier } from './types';

export const NO_OF_TILES_KENO = 40;

const CLASSIC_PAYOUTS: KenoPayout = {
  10: {
    0: 0,
    1: 0,
    2: 0,
    3: 1.4,
    4: 2.25,
    5: 4.5,
    6: 8,
    7: 17,
    8: 50,
    9: 80,
    10: 100,
  },
  9: {
    0: 0,
    1: 0,
    2: 0,
    3: 1.55,
    4: 3,
    5: 8,
    6: 15,
    7: 44,
    8: 60,
    9: 85,
  },
  8: {
    0: 0.0,
    1: 0.0,
    2: 0.0,
    3: 2.2,
    4: 4.0,
    5: 13.0,
    6: 22.0,
    7: 55.0,
    8: 70.0,
  },
  7: {
    0: 0.0,
    1: 0.0,
    2: 0.47,
    3: 3.0,
    4: 4.5,
    5: 14.0,
    6: 31.0,
    7: 60.0,
  },
  6: {
    0: 0.0,
    1: 0.0,
    2: 1.0,
    3: 3.6,
    4: 7.0,
    5: 16.5,
    6: 40.0,
  },
  5: {
    0: 0.0,
    1: 0.25,
    2: 1.4,
    3: 4.1,
    4: 16.5,
    5: 36.0,
  },
  4: {
    0: 0.0,
    1: 0.8,
    2: 1.8,
    3: 5,
    4: 22.5,
  },
  3: {
    0: 0.0,
    1: 1.0,
    2: 3.1,
    3: 10.4,
  },
  2: {
    0: 0.0,
    1: 1.9,
    2: 4.5,
  },
  1: {
    0: 0.0,
    1: 3.96,
  },
};

const LOW_PAYOUTS: KenoPayout = {
  10: {
    0: 0.0,
    1: 0.0,
    2: 1.1,
    3: 1.2,
    4: 1.3,
    5: 1.8,
    6: 3.5,
    7: 13.0,
    8: 50.0,
    9: 250.0,
    10: 1000.0,
  },
  9: {
    0: 0.0,
    1: 0.0,
    2: 1.1,
    3: 1.3,
    4: 1.7,
    5: 2.5,
    6: 7.5,
    7: 50.0,
    8: 250.0,
    9: 1000.0,
  },
  8: {
    0: 0.0,
    1: 0.0,
    2: 1.1,
    3: 1.5,
    4: 2.0,
    5: 5.5,
    6: 39.0,
    7: 100.0,
    8: 800.0,
  },
  7: {
    0: 0.0,
    1: 0.0,
    2: 1.1,
    3: 1.6,
    4: 3.5,
    5: 15.0,
    6: 225.0,
    7: 700.0,
  },
  6: {
    0: 0.0,
    1: 0.0,
    2: 1.1,
    3: 2.0,
    4: 6.2,
    5: 100.0,
    6: 700.0,
  },
  5: {
    0: 0.0,
    1: 0.0,
    2: 1.5,
    3: 4.2,
    4: 13.0,
    5: 300.0,
  },
  4: {
    0: 0.0,
    1: 0.0,
    2: 2.2,
    3: 7.9,
    4: 90.0,
  },
  3: {
    0: 0.0,
    1: 1.1,
    2: 1.38,
    3: 26.0,
  },
  2: {
    0: 0.0,
    1: 2.0,
    2: 3.8,
  },
  1: {
    0: 0.7,
    1: 1.85,
  },
};

const MEDIUM_PAYOUTS: KenoPayout = {
  10: {
    0: 0.0,
    1: 0.0,
    2: 0.0,
    3: 1.6,
    4: 2.0,
    5: 4.0,
    6: 7.0,
    7: 26.0,
    8: 100.0,
    9: 500.0,
    10: 1000.0,
  },
  9: {
    0: 0.0,
    1: 0.0,
    2: 0.0,
    3: 2.0,
    4: 2.8,
    5: 5.0,
    6: 15.0,
    7: 100.0,
    8: 500.0,
    9: 1000.0,
  },
  8: {
    0: 0.0,
    1: 0.0,
    2: 0.0,
    3: 2.0,
    4: 4.0,
    5: 11.0,
    6: 67.0,
    7: 400.0,
    8: 900.0,
  },
  7: {
    0: 0.0,
    1: 0.0,
    2: 0.0,
    3: 2.0,
    4: 7.0,
    5: 30.0,
    6: 400.0,
    7: 800.0,
  },
  6: {
    0: 0.0,
    1: 0.0,
    2: 0.0,
    3: 3.0,
    4: 9.0,
    5: 180.0,
    6: 710.0,
  },
  5: {
    0: 0.0,
    1: 0.0,
    2: 1.4,
    3: 4.0,
    4: 14.0,
    5: 390.0,
  },
  4: {
    0: 0.0,
    1: 0.0,
    2: 1.7,
    3: 10.0,
    4: 100.0,
  },
  3: {
    0: 0.0,
    1: 0.0,
    2: 2.8,
    3: 50.0,
  },
  2: {
    0: 0.0,
    1: 1.8,
    2: 5.1,
  },
  1: {
    0: 0.4,
    1: 2.75,
  },
};

const HIGH_PAYOUTS: KenoPayout = {
  10: {
    0: 0.0,
    1: 0.0,
    2: 0.0,
    3: 0.0,
    4: 3.5,
    5: 8.0,
    6: 13.0,
    7: 63.0,
    8: 500.0,
    9: 800.0,
    10: 1000.0,
  },
  9: {
    0: 0.0,
    1: 0.0,
    2: 0.0,
    3: 0.0,
    4: 4.0,
    5: 11.0,
    6: 56.0,
    7: 500.0,
    8: 800.0,
    9: 1000.0,
  },
  8: {
    0: 0.0,
    1: 0.0,
    2: 0.0,
    3: 0.0,
    4: 5.0,
    5: 20.0,
    6: 270.0,
    7: 600.0,
    8: 900.0,
  },
  7: {
    0: 0.0,
    1: 0.0,
    2: 0.0,
    3: 0.0,
    4: 7.0,
    5: 90.0,
    6: 400.0,
    7: 800.0,
  },
  6: {
    0: 0.0,
    1: 0.0,
    2: 0.0,
    3: 0.0,
    4: 11.0,
    5: 350.0,
    6: 710.0,
  },
  5: {
    0: 0.0,
    1: 0.0,
    2: 0.0,
    3: 4.5,
    4: 48.0,
    5: 450.0,
  },
  4: {
    0: 0.0,
    1: 0.0,
    2: 0.0,
    3: 10.0,
    4: 259.0,
  },
  3: {
    0: 0.0,
    1: 0.0,
    2: 0.0,
    3: 81.5,
  },
  2: {
    0: 0.0,
    1: 0.0,
    2: 17.1,
  },
  1: {
    0: 0.0,
    1: 3.96,
  },
};

const PAYOUT_MULTIPLIERS: KenoPayoutMultiplier = {
  classic: CLASSIC_PAYOUTS,
  low: LOW_PAYOUTS,
  medium: MEDIUM_PAYOUTS,
  high: HIGH_PAYOUTS,
};

const KENO_PROBABILITY: KenoPayout = {
  0: { 0: 100 },
  1: { 0: 75, 1: 25 },
  2: { 0: 55.76923077, 1: 38.46153846, 2: 5.76923077 },
  3: {
    0: 41.09311741,
    1: 44.02834008,
    2: 13.66396761,
    3: 1.2145749,
  },
  4: {
    0: 29.98686946,
    1: 44.42499179,
    2: 21.41919247,
    3: 3.93916183,
    4: 0.22978444,
  },
  5: {
    0: 21.6571835,
    1: 41.64842981,
    2: 27.76561987,
    3: 7.93303425,
    4: 0.95743517,
    5: 0.03829741,
  },
  6: {
    0: 15.46941679,
    1: 37.12660028,
    2: 32.12878871,
    3: 12.6928548,
    4: 2.37991027,
    5: 0.19695809,
    6: 0.00547106,
  },
  7: {
    0: 10.91958832,
    1: 31.84879926,
    2: 34.3967032,
    3: 17.63933498,
    4: 4.57316092,
    5: 0.58797783,
    6: 0.03379183,
    7: 0.00064365,
  },
  8: {
    0: 7.61062216,
    1: 26.47172926,
    2: 34.74414465,
    3: 22.23625258,
    4: 7.48335423,
    5: 1.33037409,
    6: 0.1187834,
    7: 0.00468112,
    8: 0.00005851,
  },
  9: {
    0: 5.23230274,
    1: 21.40487483,
    2: 33.50328234,
    3: 26.05810849,
    4: 10.94440557,
    5: 2.52563205,
    6: 0.31180643,
    7: 0.01909019,
    8: 0.00049371,
    9: 0.00000366,
  },
  10: {
    0: 3.54446314,
    1: 16.87839592,
    2: 31.07159249,
    3: 28.82002782,
    4: 14.71022253,
    5: 4.23654409,
    6: 0.67893335,
    7: 0.05747584,
    8: 0.0023093,
    9: 0.00003539,
    10: 0.00000012,
  },
};

export { PAYOUT_MULTIPLIERS, KENO_PROBABILITY };
