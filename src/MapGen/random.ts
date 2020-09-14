import { Game } from '../Game';
import { GameMap } from '../GameMap';
import { Resource } from '../Resource';
import { SYMMETRY } from './types';
import { sigmoid } from './utils';

export const generateRandom = (game: Game, rng: () => number): void => {
  const map = game.map;
  const width = map.width;
  const height = map.height;

  let symmetry = SYMMETRY.VERTICAL;
  const p_symmetry = 0.9;
  if (p_symmetry > 0.6) {
    symmetry = SYMMETRY.HORIZONTAL;
  } else if (p_symmetry > 0.3) {
    symmetry = SYMMETRY.DIAGONAL;
  }

  const sample_1 = [];
  for (let i = 0; i < height; i++) {
    sample_1.push(new Array(width).fill(EMPTY));
  }

  // lower threshold at center to encourage more resource spawning at center and middle of map
  const generateResourceThreshold = (x, y) => {
    const dy = height / 2 - y;
    const dx = width / 2 - x;
    const s = sigmoid(Math.sqrt(dx * dx + dy * dy));
    return 0.75;
  };

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const p = rng();
      if (p > generateResourceThreshold(i, j)) {
        sample_1[i][j] = RESOURCE_BLOCK;
      }
    }
  }

  for (let i = 0; i < 5; i++) {
    printMap(sample_1);
    console.log();
    simulate(sample_1);
  }
  printMap(sample_1);

  // default is vertial symmetry
  let sample_2 = sample_1.slice(0, height / 2);
  switch (symmetry) {
    case SYMMETRY.HORIZONTAL:
      sample_2 = [];
      for (let i = 0; i < height; i++) {
        sample_2.push(sample_1[i].slice(0, width / 2));
      }
      break;
    case SYMMETRY.DIAGONAL:
      sample_2 = [];
      for (let i = 0; i < height / 2; i++) {
        sample_2.push(sample_1[i].slice(0, width / 2));
      }
      break;
  }
  console.log();
  printMap(sample_2);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let tile_sample = 0;
      switch (symmetry) {
        case SYMMETRY.VERTICAL:
          if (y >= height / 2) {
            tile_sample = sample_2[height - y - 1][x];
          } else {
            tile_sample = sample_2[y][x];
          }
          if (tile_sample === RESOURCE_BLOCK) {
            map.addResource(x, y, Resource.Types.WOOD, 1000);
          }
          break;
        case SYMMETRY.HORIZONTAL: {
          const sample_x = Math.min(x, width - x - 1);
          tile_sample = sample_2[y][sample_x];
          if (tile_sample === RESOURCE_BLOCK) {
            map.addResource(x, y, Resource.Types.WOOD, 1000);
          }
          break;
        }
        case SYMMETRY.DIAGONAL: {
          const sample_y = Math.min(y, height - y - 1);
          const sample_x = Math.min(x, width - x - 1);
          tile_sample = sample_2[sample_y][sample_x];
          if (tile_sample === RESOURCE_BLOCK) {
            map.addResource(x, y, Resource.Types.WOOD, 1000);
          }
          break;
        }
      }
    }
  }
  console.log();
  console.log(map.getMapString());
};
const printMap = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    console.log(
      arr[i]
        .map((v) => {
          if (v === 1) {
            return '1'.yellow;
          }
          return v;
        })
        .join(' ')
    );
  }
};
const MOVE_DELTAS = GameMap.MOVE_DELTAS;
const RESOURCE_BLOCK = 1;
const EMPTY = 0;
// performs a game of life simulation
const simulate = (arr: Array<Array<number>>) => {
  const padding = 2;
  const deathLimit = 2;
  const birthLimit = 4;
  for (let i = padding; i < arr.length - padding; i++) {
    for (let j = padding; j < arr[0].length - padding; j++) {
      let alive = 0;
      for (let i = 0; i < MOVE_DELTAS.length; i++) {
        const delta = MOVE_DELTAS[i];
        const ny = i + delta[1];
        const nx = j + delta[0];
        if (arr[ny][nx] === RESOURCE_BLOCK) {
          alive++;
        }
      }
      if (arr[i][j] == RESOURCE_BLOCK) {
        if (alive < deathLimit) {
          arr[i][j] = EMPTY;
        } else {
          arr[i][j] = RESOURCE_BLOCK;
        }
      } else {
        if (alive > birthLimit) {
          arr[i][j] = RESOURCE_BLOCK;
        } else {
          arr[i][j] = EMPTY;
        }
      }
    }
  }
};
