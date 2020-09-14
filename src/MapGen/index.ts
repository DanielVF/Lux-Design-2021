import { Game } from '../Game';
import { LuxMatchConfigs } from '../types';
import { GameMap } from '../GameMap';
import { DEFAULT_CONFIGS } from '../defaults';
import { generateDebug } from './debug';
import { generateRandom } from './random';

export const generateGame = (
  matchconfigs: Partial<LuxMatchConfigs> = {},
  rng: () => number
): Game => {
  const configs = {
    ...DEFAULT_CONFIGS,
    ...matchconfigs,
  };
  const game = new Game(configs);
  switch (configs.mapType) {
    case GameMap.Types.DEBUG:
      generateDebug(game);
      break;
    case GameMap.Types.RANDOM:
      generateRandom(game, rng);
      break;
  }

  return game;
};

generateGame(
  {
    mapType: GameMap.Types.RANDOM,
  },
  Math.random
);
