import { Game } from '../Game';
import { Resource } from '../Resource';
import { Unit } from '../Unit';

export const generateDebug = (game: Game): void => {
  const map = game.map;
  const width = map.width;
  const height = map.height;
  const woodCoords = [
    [3, 3],
    [3, 4],
    [4, 3],
    [5, 6],
    [1, 1],
    [1, 2],
    [1, 3],
    [2, 5],
    [2, 14],
    [2, 13],
    [4, 13],
    [5, 13],
    [5, 12],
    [5, 14],
  ];

  for (const c of woodCoords) {
    map.addResource(c[0], c[1], Resource.Types.WOOD, 1500);
    map.addResource(width - c[0] - 1, c[1], Resource.Types.WOOD, 1500);
  }

  const coalCoords = [
    [5, 5],
    [6, 5],
    [9, 4],
  ];

  for (const c of coalCoords) {
    map.addResource(c[0], c[1], Resource.Types.COAL, 300);
    map.addResource(width - c[0] - 1, c[1], Resource.Types.COAL, 300);
  }

  const uCoords = [
    [9, 7],
    [8, 8],
    [7, 8],
  ];

  for (const c of uCoords) {
    map.addResource(c[0], c[1], Resource.Types.URANIUM, 30);
    map.addResource(width - c[0] - 1, c[1], Resource.Types.URANIUM, 30);
  }

  map.addResource(7, 8, Resource.Types.URANIUM, 20);
  map.addResource(8, 8, Resource.Types.URANIUM, 20);

  // hardcode initial city tiles
  game.spawnCityTile(Unit.TEAM.A, 2, 1);
  game.spawnCityTile(Unit.TEAM.B, width - 2, 1);

  game.spawnWorker(Unit.TEAM.A, 2, 2);
  game.spawnWorker(Unit.TEAM.B, width - 2, 2);

  game.spawnCart(Unit.TEAM.A, 1, 2);
  game.spawnCart(Unit.TEAM.B, width - 1, 2);
};
