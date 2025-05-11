import type { Bet } from '@prisma/client';
import db from '@repo/db';
import {
  convertFloatsToGameEvents,
  dealGame,
} from '@repo/common/game-utils/blackjack/utils.js';
import type { BlackjackGameState } from '@repo/common/game-utils/blackjack/types.js';
import { userManager } from '../../user/user.service';

class BlackjackManager {
  private static instance: BlackjackManager | undefined;
  private games: Map<string, BlackjackGame>;

  private constructor() {
    this.games = new Map();
  }

  static getInstance() {
    if (!BlackjackManager.instance) {
      BlackjackManager.instance = new BlackjackManager();
    }
    return BlackjackManager.instance;
  }

  async getGame(userId: string) {
    if (!this.games.has(userId)) {
      const bet = await db.bet.findFirst({
        where: { userId, active: true },
      });

      const userInstance = await userManager.getUser(userId);
      const floats = userInstance.generateFloats(52);
      const gameEvents = convertFloatsToGameEvents(floats);

      if (!bet) {
        return null;
      }
      const game = new BlackjackGame({ bet, gameEvents });
      this.games.set(userId, game);
    }
    return this.games.get(userId);
  }

  async createGame({
    betAmount,
    userId,
  }: {
    userId: string;
    betAmount: number;
  }) {
    const userInstance = await userManager.getUser(userId);
    const floats = userInstance.generateFloats(52);
    const gameEvents = convertFloatsToGameEvents(floats);
    const createdBet = await db.$transaction(async tx => {
      const bet = await tx.bet.create({
        data: {
          active: true,
          betAmount,
          betNonce: userInstance.getNonce(),
          game: 'mines',
          provablyFairStateId: userInstance.getProvablyFairStateId(),
          state: {
            actions: ['deal'],
          },
          userId: userInstance.getUser().id,
          payoutAmount: 0,
        },
      });
      await userInstance.updateNonce(tx);
      return bet;
    });
    const game = new BlackjackGame({ bet: createdBet, gameEvents });
    this.games.set(createdBet.userId, game);
    return game;
  }

  deleteGame(userId: string) {
    this.games.delete(userId);
  }
}

class BlackjackGame {
  private bet: Bet;
  readonly gameEvents: number[];

  amountMultiplier = 1;

  private gameState: BlackjackGameState;

  constructor({ bet, gameEvents }: { bet: Bet; gameEvents: number[] }) {
    this.bet = bet;
    this.gameEvents = gameEvents;
    this.gameState = dealGame(gameEvents);
  }

  getGameState() {
    return this.gameState;
  }

  getBet() {
    return this.bet;
  }
}

export const blackjackManager = BlackjackManager.getInstance();
