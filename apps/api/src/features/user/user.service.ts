import { createHash, createHmac } from 'node:crypto';
import type { ProvablyFairState, User } from '@prisma/client';
import chunk from 'lodash/chunk';
import db from '@repo/db';
import { BadRequestError } from '../../errors';
import { generateClientSeed, generateServerSeed } from './user.utils';

export class UserInstance {
  constructor(
    public user: User,
    private provablyFairState: ProvablyFairState,
  ) {}

  async updateBalance(amount: number) {
    // amount is in dollars, convert to cents for storage
    const amountInCents = Math.round(amount * 100);
    this.user.balance += amountInCents;
    await db.user.update({
      where: { id: this.user.id },
      data: { balance: this.user.balance },
    });
  }

  async rotateSeed(clientSeed: string) {
    const newServerSeed = generateServerSeed();

    const result = await db.$transaction(async (tx) => {
      // Mark current seed as revealed
      await tx.provablyFairState.update({
        where: { userId: this.user.id, revealed: false },
        data: { revealed: true },
      });

      // Create new seeds
      const updated = await tx.provablyFairState.create({
        data: {
          serverSeed: newServerSeed,
          clientSeed,
          revealed: false,
          nonce: 0,
          userId: this.user.id,
        },
      });

      // Update instance state
      this.provablyFairState = updated;

      return {
        clientSeed,
        hashedServerSeed: this.getHashedServerSeed(),
        nextHashedServerSeed: this.getHashedNextServerSeed(),
        nonce: updated.nonce,
      };
    });

    return result;
  }

  getBalance(): number {
    // Convert cents to dollars for display
    return this.user.balance / 100;
  }

  private async updateNonce() {
    this.provablyFairState.nonce += 1;
    await db.provablyFairState.update({
      where: { userId: this.user.id },
      data: { nonce: this.provablyFairState.nonce },
    });
  }

  getServerSeed() {
    return this.provablyFairState.serverSeed;
  }

  getClientSeed() {
    return this.provablyFairState.clientSeed;
  }

  getNonce() {
    return this.provablyFairState.nonce;
  }

  async updateClientSeed(newClientSeed: string) {
    this.provablyFairState.clientSeed = newClientSeed;
    await db.provablyFairState.update({
      where: { userId: this.user.id },
      data: { clientSeed: newClientSeed },
    });
  }

  getHashedServerSeed() {
    return createHash('sha256')
      .update(this.provablyFairState.serverSeed)
      .digest('hex');
  }

  getHashedNextServerSeed() {
    const nextServerSeed = this.generateNextServerSeed();
    return createHash('sha256').update(nextServerSeed).digest('hex');
  }

  async updateServerSeed() {
    this.provablyFairState.serverSeed = this.generateNextServerSeed();
    await db.provablyFairState.update({
      where: { userId: this.user.id },
      data: { serverSeed: this.provablyFairState.serverSeed },
    });
  }

  private generateNextServerSeed(): string {
    const hmac = createHmac('sha256', this.provablyFairState.serverSeed);
    hmac.update('next-seed');
    return hmac.digest('hex');
  }

  private *byteGenerator() {
    let currentRound = 0;
    let currentRoundCursor = 0;
    for (;;) {
      const hmac = createHmac('sha256', this.provablyFairState.serverSeed);
      hmac.update(
        `${this.provablyFairState.clientSeed}:${this.provablyFairState.nonce}:${currentRound}`,
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
  private static instance: UserManager | undefined;
  private users = new Map<string, UserInstance>();

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
        include: {
          provablyFairState: {
            where: {
              revealed: false,
            },
          },
        },
      });
      if (!user) {
        throw new BadRequestError('User not found');
      }
      if (!user.provablyFairState) {
        // Create initial provably fair state if it doesn't exist
        const provablyFairState = await db.provablyFairState.create({
          data: {
            userId: user.id,
            serverSeed: generateServerSeed(),
            clientSeed: generateClientSeed(),
            nonce: 0,
            revealed: false,
          },
        });
        user.provablyFairState = provablyFairState;
      }
      this.users.set(userId, new UserInstance(user, user.provablyFairState));
    }
    const user = this.users.get(userId);
    if (!user) {
      throw new BadRequestError('User not found in manager');
    }
    return user;
  }

  removeUser(userId: string) {
    this.users.delete(userId);
  }
}

export const userManager = UserManager.getInstance();
