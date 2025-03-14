import range from 'lodash/range';
import { randomUUID } from 'crypto';
import { payouts } from './mines.constant';
// import { rng } from '../../user/user.service';

const NO_OF_TILES = 25;

class MinesManager {
  private static instance: MinesManager;
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

  getGame(gameId: string) {
    return this.games.get(gameId);
  }

  createGame(minesCount: number) {
    const game = new Mines(minesCount);
    this.games.set(game.gameId, game);
    return game;
  }

  deleteGame(gameId: string) {
    this.games.delete(gameId);
  }
}

class Mines {
  private minesCount;
  public gameId;
  private mines: number[] | null = null;
  private rounds: { selectedTileIndex: number; payoutMultiplier: number }[] =
    [];
  private selectedTiles: number[] = [];

  constructor(minesCount: number) {
    this.minesCount = minesCount;
    this.gameId = randomUUID();
  }

  startGame(clientSeed: string) {
    // const floats = rng.generateFloats({
    //   clientSeed,
    //   count: NO_OF_TILES - 1,
    // });
    const floats = [2];
    const gameEvents = this.convertFloatsToGameEvents(floats, NO_OF_TILES);
    this.calculateMines(gameEvents);
  }

  playRound(selectedTileIndex: number) {
    if (this.selectedTiles.includes(selectedTileIndex)) {
      throw new Error('Tile already selected');
    } else {
      this.selectedTiles.push(selectedTileIndex);
    }
    if (this.rounds.length === NO_OF_TILES - 1) {
      throw new Error('Game over');
    }
    if (!this.mines) {
      throw new Error('Game not started');
    }
    if (this.mines.includes(selectedTileIndex)) {
      this.rounds.push({ selectedTileIndex, payoutMultiplier: 0 });
      return this.getGameOverState();
    } else {
      const gemsCount = this.rounds.length + 1;

      const payoutMultiplier = payouts[gemsCount][this.minesCount];

      this.rounds.push({ selectedTileIndex, payoutMultiplier });
      return {
        active: true,
        state: {
          rounds: this.rounds,
          mines: null,
          minesCount: this.minesCount,
        },
      };
    }
  }

  cashOut() {
    if (this.rounds.length === 0) {
      throw new Error('Game not started');
    }
    return this.getGameOverState();
  }

  private getGameOverState() {
    return {
      active: false,
      state: {
        rounds: this.rounds,
        mines: this.mines,
        minesCount: this.minesCount,
      },
    };
  }

  private convertFloatsToGameEvents(floats: number[], totalEvents: number) {
    let remainingEvents = totalEvents;
    return floats.map((float) => {
      const event = Math.floor(float * remainingEvents);
      remainingEvents -= 1;
      return event;
    });
  }

  private calculateMines(gameEvents: number[]) {
    let tileNumbers = range(NO_OF_TILES);

    let eventIndex = 0;
    const minePositions = [];
    for (let i = 0; i < NO_OF_TILES; i++) {
      const chosenIndex = gameEvents[eventIndex];

      minePositions.push(tileNumbers[chosenIndex]);
      if (minePositions.length === this.minesCount) {
        break;
      }
      tileNumbers = [
        ...tileNumbers.slice(0, chosenIndex),
        ...tileNumbers.slice(chosenIndex + 1),
      ];
      eventIndex += 1;
    }

    this.mines = minePositions;
  }
}

export const minesManager = MinesManager.getInstance();
