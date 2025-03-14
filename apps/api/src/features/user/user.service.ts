import { ProvablyFairState, User } from '@prisma/client';
import { createHash, createHmac, randomBytes } from 'crypto';
import chunk from 'lodash/chunk';
import db from '@repo/db';
import { generateClientSeed, generateServerSeed } from './user.utils';
import { BadRequestError } from '../../errors';

export class UserInstance {
  constructor(
    public user: User,
    private gameState: ProvablyFairState,
  ) {}

  async updateBalance(amount: number) {
    this.user.balance += amount;
    await db.user.update({
      where: { id: this.user.id },
      data: { balance: this.user.balance },
    });
  }

  private async updateNonce() {
    this.gameState.nonce += 1;
    await db.provablyFairState.update({
      where: { userId: this.user.id },
      data: { nonce: this.gameState.nonce },
    });
  }

  getServerSeed() {
    return this.gameState.serverSeed;
  }

  getClientSeed() {
    return this.gameState.clientSeed;
  }

  async updateClientSeed(newClientSeed: string) {
    this.gameState.clientSeed = newClientSeed;
    await db.provablyFairState.update({
      where: { userId: this.user.id },
      data: { clientSeed: newClientSeed },
    });
  }

  getHashedServerSeed() {
    return createHash('sha256').update(this.gameState.serverSeed).digest('hex');
  }

  getHashedNextServerSeed() {
    const nextServerSeed = this.generateNextServerSeed();
    return createHash('sha256').update(nextServerSeed).digest('hex');
  }

  async updateServerSeed() {
    this.gameState.serverSeed = this.generateNextServerSeed();
    await db.provablyFairState.update({
      where: { userId: this.user.id },
      data: { serverSeed: this.gameState.serverSeed },
    });
  }

  private generateNextServerSeed(): string {
    const hmac = createHmac('sha256', this.gameState.serverSeed);
    hmac.update('next-seed');
    return hmac.digest('hex');
  }

  private *byteGenerator() {
    let currentRound = 0;
    let currentRoundCursor = 0;
    while (true) {
      const hmac = createHmac('sha256', this.gameState.serverSeed);
      hmac.update(
        `${this.gameState.clientSeed}:${this.gameState.nonce}:${currentRound}`,
      );
      const buffer = hmac.digest();

      while (currentRoundCursor < 32) {
        yield Number(buffer[currentRoundCursor]);
        currentRoundCursor += 1;
      }
      currentRoundCursor = 0;
      currentRound += 1;
    }
  }

  async generateFloats(count: number): Promise<number[]> {
    const rng = this.byteGenerator();
    await this.updateNonce();

    const bytes: number[] = [];

    while (bytes.length < count * 4) {
      bytes.push(rng.next().value as number);
    }

    return chunk(bytes, 4).map((bytesChunk) =>
      bytesChunk.reduce((result, value, i) => {
        const divider = 256 ** (i + 1);
        const partialResult = value / divider;
        return result + partialResult;
      }, 0),
    );
  }
}

class UserManager {
  private static instance: UserManager;
  private users: Map<string, UserInstance> = new Map();

  static getInstance() {
    if (!UserManager.instance) {
      UserManager.instance = new UserManager();
    }
    return UserManager.instance;
  }

  async getUser(userId: string): Promise<UserInstance> {
    if (!this.users.has(userId)) {
      const user = await db.user.findUnique({
        where: { id: userId },
        include: { provablyFairState: true },
      });
      if (!user) {
        throw new BadRequestError('User not found');
      }
      if (!user.provablyFairState) {
        // Create initial game state if it doesn't exist
        const gameState = await db.provablyFairState.create({
          data: {
            userId: user.id,
            serverSeed: generateServerSeed(),
            clientSeed: generateClientSeed(),
            nonce: 0,
          },
        });
        user.provablyFairState = gameState;
      }
      this.users.set(userId, new UserInstance(user, user.provablyFairState));
    }
    return this.users.get(userId)!;
  }

  removeUser(userId: string) {
    this.users.delete(userId);
  }
}

export const userManager = UserManager.getInstance();
