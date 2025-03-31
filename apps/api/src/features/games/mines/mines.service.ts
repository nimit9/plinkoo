import range from 'lodash/range';
import type { MinesBet } from '@repo/common/game-utils/mines/types.js';
import db from '@repo/db';
import type { Bet } from '@prisma/client';
import { userManager } from '../../user/user.service';
import { payouts } from './mines.constant';

const NO_OF_TILES = 25;

const convertFloatsToGameEvents = (
  floats: number[],
  totalEvents: number,
): number[] => {
  let remainingEvents = totalEvents;
  return floats.map((float) => {
    const event = Math.floor(float * remainingEvents);
    remainingEvents -= 1;
    return event;
  });
};

const calculateMines = (gameEvents: number[], minesCount: number): number[] => {
  let tileNumbers = range(NO_OF_TILES);

  let eventIndex = 0;
  const minePositions = [];
  for (let i = 0; i < NO_OF_TILES; i++) {
    const chosenIndex = gameEvents[eventIndex];

    minePositions.push(tileNumbers[chosenIndex]);
    if (minePositions.length === minesCount) {
      break;
    }
    tileNumbers = [
      ...tileNumbers.slice(0, chosenIndex),
      ...tileNumbers.slice(chosenIndex + 1),
    ];
    eventIndex += 1;
  }

  return minePositions;
};
class MinesManager {
  private static instance: MinesManager;
  private games: Map<string, Mines>;

  private constructor() {
    this.games = new Map();
  }

  static getInstance() {
    if (!MinesManager.instance as boolean) {
      MinesManager.instance = new MinesManager();
    }
    return MinesManager.instance;
  }

  async getGame(gameId: string) {
    if (!this.games.has(gameId)) {
      const bet = await db.bet.findUnique({
        where: { id: gameId },
      });
      if (!bet) {
        throw new Error('Game not found');
      }
    }
    return this.games.get(gameId);
  }

  async createGame({
    minesCount,
    betAmount,
    userId,
  }: MinesBet & { userId: string }) {
    const userInstance = await userManager.getUser(userId);
    const floats = userInstance.generateFloats(NO_OF_TILES - 1);
    const gameEvents = convertFloatsToGameEvents(floats, NO_OF_TILES);
    const mines = calculateMines(gameEvents, minesCount);
    const createdBet = await db.$transaction(async (tx) => {
      const bet = await tx.bet.create({
        data: {
          active: true,
          betAmount,
          betNonce: userInstance.getNonce(),
          game: 'mines',
          provablyFairStateId: userInstance.getProvablyFairStateId(),
          state: {
            mines,
            minesCount,
            rounds: [],
          },
          userId: userInstance.getUser().id,
          payoutAmount: 0,
        },
      });
      await userInstance.updateNonce(tx);
      return bet;
    });
    const game = new Mines(minesCount, createdBet);
    this.games.set(createdBet.id, game);
    return game;
  }

  deleteGame(gameId: string) {
    this.games.delete(gameId);
  }
}

class Mines {
  private minesCount;
  private bet: Bet;
  private rounds: { selectedTileIndex: number; payoutMultiplier: number }[] =
    [];
  private selectedTiles: number[] = [];

  constructor(minesCount: number, bet: Bet) {
    this.minesCount = minesCount;
    this.bet = bet;
  }

  getBet() {
    return this.bet;
  }

  async playRound(selectedTileIndex: number) {
    if (this.selectedTiles.includes(selectedTileIndex)) {
      throw new Error('Tile already selected');
    } else {
      this.selectedTiles.push(selectedTileIndex);
    }
    if (this.rounds.length === NO_OF_TILES - 1) {
      throw new Error('Game over');
    }
    if (!(this.bet.state as { mines?: number[] }).mines) {
      throw new Error('Game not started');
    }
    if (
      (this.bet.state as { mines: number[] }).mines.includes(selectedTileIndex)
    ) {
      this.rounds.push({ selectedTileIndex, payoutMultiplier: 0 });
      return this.getGameOverState(this.bet.userId);
    }
    const gemsCount = this.rounds.length + 1;

    const payoutMultiplier = payouts[gemsCount][this.minesCount];

    this.rounds.push({ selectedTileIndex, payoutMultiplier });
    await db.bet.update({
      where: { id: this.bet.id, active: true },
      data: {
        state: this.bet.state || {},
      },
    });
    return {
      id: this.bet.id,
      active: true,
      state: {
        rounds: this.rounds,
        mines: null,
        minesCount: this.minesCount,
      },
    };
  }

  async cashOut(userId: string) {
    if (this.rounds.length === 0) {
      throw new Error('Game not started');
    }
    return this.getGameOverState(userId);
  }

  private async getGameOverState(userId: string) {
    const userInstance = await userManager.getUser(userId);
    const payoutMultiplier = this.rounds.at(-1)?.payoutMultiplier || 0;
    const payoutAmount = payoutMultiplier * this.bet.betAmount;
    const balanceChangeInCents = payoutAmount - this.bet.betAmount;
    const balance = await db.$transaction(async (tx) => {
      await tx.bet.update({
        where: { id: this.bet.id },
        data: {
          payoutAmount,
          active: false,
          state: this.bet.state || {},
        },
      });

      const userWithNewBalance = await tx.user.update({
        where: { id: userId },
        data: {
          balance: {
            increment: balanceChangeInCents,
          },
        },
      });
      return userWithNewBalance.balance;
    });
    userInstance.setBalance(balance);
    return {
      id: this.bet.id,
      state: this.bet.state,
      payoutMultiplier,
      payout: payoutAmount / 100,
      balance: balance / 100,
      active: false,
    };
  }
}

export const minesManager = MinesManager.getInstance();
