import { createHash, createHmac, randomBytes } from 'crypto';
import chunk from 'lodash/chunk';

class RNG {
  private static instance: RNG;
  private seed;
  private nextSeed: string | null = null;
  public nonce;
  constructor() {
    this.seed = this.generateServerSeed();
    this.nonce = 0;
  }

  static getInstance() {
    if (!RNG.instance) {
      RNG.instance = new RNG();
    }
    return RNG.instance;
  }

  generateServerSeed() {
    return randomBytes(32).toString('hex');
  }

  getServerSeed() {
    return this.seed;
  }

  getHashedServerSeed() {
    if (this.seed) {
      return createHash('sha256').update(this.seed).digest('hex');
    }
  }

  getHashedNextServerSeed() {
    if (this.nextSeed) {
      return createHash('sha256').update(this.nextSeed).digest('hex');
    }
  }

  updateServerSeed() {
    this.seed = this.getNextServerSeed();
    this.nextSeed = null;
    this.nextSeed = this.getNextServerSeed();
  }

  getNextServerSeed() {
    if (!this.nextSeed) {
      const hmac = createHmac('sha256', this.seed);
      hmac.update('next-seed');
      this.nextSeed = hmac.digest('hex');
    }
    return this.nextSeed;
  }

  *byteGenerator({
    clientSeed,

    cursor,
  }: {
    clientSeed: string;
    cursor: number;
  }) {
    // Setup curser variables
    let currentRound = Math.floor(cursor / 32);
    let currentRoundCursor = cursor;
    currentRoundCursor -= currentRound * 32;

    // Generate outputs until cursor requirement fullfilled
    while (!!this.seed) {
      // HMAC function used to output provided inputs into bytes
      const hmac = createHmac('sha256', this.seed);
      hmac.update(`${clientSeed}:${this.nonce ?? ''}:${currentRound}`);
      const buffer = hmac.digest();

      // Update curser for next iteration of loop
      while (currentRoundCursor < 32) {
        yield Number(buffer[currentRoundCursor]);
        currentRoundCursor += 1;
      }
      currentRoundCursor = 0;
      currentRound += 1;
    }
  }

  generateFloats({
    clientSeed,
    cursor,
    count,
  }: {
    clientSeed: string;
    cursor: number;
    count: number;
  }) {
    const rng = this.byteGenerator({ clientSeed, cursor });

    this.nonce += 1;

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

export const rng = RNG.getInstance();
