import { NO_OF_TILES } from '@repo/common/game-utils/mines/constants.js';
import type {
  MinesBet,
  MinesGameOverResponse,
  MinesHiddenState,
  MinesPlayRoundResponse,
  MinesRevealedState,
} from '@repo/common/game-utils/mines/types.js';
import db from '@repo/db';
import type { Bet } from '@prisma/client';
import {
  convertFloatsToGameEvents,
  calculateMines,
} from '@repo/common/game-utils/mines/utils.js';
import { userManager } from '../../user/user.service';
import { payouts } from './mines.constant';

class MinesManager {
  private static instance: MinesManager | undefined;
  private games: Map<string, Mines>;

  private constructor() {
    this.games = new Map();
  }

  static getInstance() {
    if (!MinesManager.instance) {
      MinesManager.instance = new MinesManager();
    }
    return MinesManager.instance;
  }

  async getGame(userId: string) {
    if (!this.games.has(userId)) {
      const bet = await db.bet.findFirst({
        where: { userId, active: true },
      });

      if (!bet) {
        return null;
      }
      const game = new Mines(bet);
      this.games.set(userId, game);
    }
    return this.games.get(userId);
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
    const createdBet = await db.$transaction(async tx => {
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
    const game = new Mines(createdBet);
    this.games.set(createdBet.userId, game);
    return game;
  }

  deleteGame(userId: string) {
    this.games.delete(userId);
  }
}

class Mines {
  private bet: Bet;
  private rounds: { selectedTileIndex: number; payoutMultiplier: number }[] =
    [];
  private selectedTiles: number[] = [];
  constructor(bet: Bet) {
    this.bet = bet;
  }

  getBet() {
    return this.bet;
  }

  getRounds() {
    return this.rounds;
  }

  async playRound(
    selectedTileIndex: number
  ): Promise<MinesPlayRoundResponse | MinesGameOverResponse> {
    if (this.selectedTiles.includes(selectedTileIndex)) {
      throw new Error('Tile already selected');
    } else {
      this.selectedTiles.push(selectedTileIndex);
    }
    if (this.rounds.length === NO_OF_TILES - 1) {
      throw new Error('Game over');
    }
    if (!this.bet.state) {
      throw new Error('Game state not found');
    }
    const { mines, minesCount } = this.bet.state as unknown as
      | MinesHiddenState
      | MinesRevealedState;
    if (!mines) {
      throw new Error('Game not started');
    }
    if (mines.includes(selectedTileIndex)) {
      this.rounds.push({ selectedTileIndex, payoutMultiplier: 0 });
      return this.getGameOverState(this.bet.userId);
    }
    const gemsCount = this.rounds.length + 1;

    const payoutMultiplier = payouts[gemsCount][minesCount];

    this.rounds.push({ selectedTileIndex, payoutMultiplier });
    await db.bet.update({
      where: { id: this.bet.id, active: true },
      data: {
        state: {
          ...(this.bet.state as unknown as MinesHiddenState),
          rounds: this.rounds,
        },
      },
    });
    return {
      id: this.bet.id,
      active: true,
      state: {
        rounds: this.rounds,
        mines: null,
        minesCount,
      },
      betAmount: this.bet.betAmount / 100,
    };
  }

  async cashOut(userId: string) {
    if (this.rounds.length === 0) {
      throw new Error('Game not started');
    }
    return this.getGameOverState(userId);
  }

  private async getGameOverState(
    userId: string
  ): Promise<MinesGameOverResponse> {
    const userInstance = await userManager.getUser(userId);
    const payoutMultiplier = this.rounds.at(-1)?.payoutMultiplier || 0;
    const payoutAmount = payoutMultiplier * this.bet.betAmount;
    const balanceChangeInCents = payoutAmount - this.bet.betAmount;

    const userBalanceInCents = userInstance.getBalanceAsNumber();
    const newBalance = (userBalanceInCents + balanceChangeInCents).toString();

    const balance = await db.$transaction(async tx => {
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
          balance: newBalance,
        },
      });
      return userWithNewBalance.balance;
    });
    userInstance.setBalance(balance);
    return {
      id: this.bet.id,
      state: {
        ...(this.bet.state as unknown as MinesRevealedState),
        rounds: this.rounds,
      },
      payoutMultiplier,
      payout: Number((payoutAmount / 100).toFixed(2)),
      balance: Number((parseInt(balance, 10) / 100).toFixed(2)),
      active: false,
    };
  }
}

export const minesManager = MinesManager.getInstance();
