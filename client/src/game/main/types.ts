import { Coord } from "@latticexyz/utils";
import config from "./config";
import createArrowManager from "./createArrowManager";
import createClientComponents from "./setup/components/createClientComponents";
import createMoveSequenceManager from "./createMoveSequenceManager";
import createNextMoveTilesManager from "./createNextMoveTilesManager";
import createOtherPlayersStateManager from "./createOtherPlayersStateManager";
import createPlayerStateTilesManager from "./createPlayerStateTilesManager";
import createTerrainManager from "./createTerrainManager";
import createTileManager from "./createTroopCountManager";
import setupMainScene from "./setup/scene/setupMainScene";

export type MainScene = Awaited<ReturnType<typeof setupMainScene>>;
export type MainConfig = typeof config;
export type MainClientComponents = ReturnType<typeof createClientComponents>;
export type TileManager = ReturnType<typeof createTileManager>;
export type TerrainManager = Awaited<ReturnType<typeof createTerrainManager>>;
export type NextMoveTilesManager = ReturnType<
  typeof createNextMoveTilesManager
>;
export type PlayerStateTilesManager = ReturnType<
  typeof createPlayerStateTilesManager
>;
export type MoveSequenceManager = ReturnType<typeof createMoveSequenceManager>;
export type OtherPlayersStateManager = ReturnType<
  typeof createOtherPlayersStateManager
>;
export type ArrowManager = ReturnType<typeof createArrowManager>;

export enum Direction {
  UP = 0,
  DOWN = 1,
  LEFT = 2,
  RIGHT = 3,
}

export enum Terrain {
  BARE = 0,
  MOUNTAIN = 1,
  WATER = 2,
}

export type Move = {
  coord: Coord;
  direction: Direction;
};

export enum MoveState {
  QUEUED,
  COMPLETED,
  FAILED,
}
