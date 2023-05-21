import { Coord, coordToKey, keyToCoord } from "@latticexyz/utils";

import { Game } from "../types";
import createLazyGameObjectManager from "./setup/createLazyGameObjectManager";
import { tileCoordToPixelCoord } from "../phaser/utils/tileCoordToPixelCoord";

enum Border {
  LEFT = "left",
  RIGHT = "right",
  TOP = "top",
  BOTTOM = "bottom",
}

type PlayerArea = { coord: Coord; borders: Border[] }[];

const createOtherPlayersStateManager = (game: Game) => {
  const {
    main: {
      scene,
      config: {
        tilemap: { tileWidth, tileHeight },
      },
    },
  } = game;

  const getPlayerArea = (coords: Set<number>): PlayerArea => {
    const playerArea: PlayerArea = [];
    coords.forEach((coordKey) => {
      const borders = [];
      const { x, y } = keyToCoord(coordKey);
      if (!coords.has(coordToKey({ x: x - 1, y }))) borders.push(Border.LEFT);
      if (!coords.has(coordToKey({ x: x + 1, y }))) borders.push(Border.RIGHT);
      if (!coords.has(coordToKey({ x, y: y - 1 }))) borders.push(Border.TOP);
      if (!coords.has(coordToKey({ x, y: y + 1 }))) borders.push(Border.BOTTOM);
      if (borders.length > 0) {
        playerArea.push({ coord: { x, y }, borders });
      }
    });
    return playerArea;
  };

  let playerArea: PlayerArea = [];

  const createGameObject = (coord: Coord, key: string) => {
    const border = key as Border;
    const tilePosition = tileCoordToPixelCoord(coord, tileWidth, tileHeight);

    const borderConfig: Record<
      Border,
      { x1: number; y1: number; x2: number; y2: number }
    > = {
      top: {
        x1: tilePosition.x + tileWidth / 2,
        y1: tilePosition.y,
        x2: tilePosition.x + tileWidth + tileWidth / 2,
        y2: tilePosition.y,
      },
      bottom: {
        x1: tilePosition.x + tileWidth / 2,
        y1: tilePosition.y + tileHeight,
        x2: tilePosition.x + tileWidth + tileWidth / 2,
        y2: tilePosition.y + tileHeight,
      },
      right: {
        x1: tilePosition.x + tileWidth,
        y1: tilePosition.y + tileHeight / 2,
        x2: tilePosition.x + tileWidth,
        y2: tilePosition.y + tileHeight + tileHeight / 2,
      },
      left: {
        x1: tilePosition.x,
        y1: tilePosition.y + tileHeight / 2,
        x2: tilePosition.x,
        y2: tilePosition.y + tileHeight + tileHeight / 2,
      },
    };

    const { x1, y1, x2, y2 } = borderConfig[border];
    const line = scene.add.line(0, 0, x1, y1, x2, y2, 0xff0000, 1);
    return line;
  };

  const lazyGameObjectManager =
    createLazyGameObjectManager<Phaser.GameObjects.Line>(
      game,
      createGameObject
    );
  const clearPlayerArea = (playerArea: PlayerArea) => {
    playerArea.forEach((area) =>
      lazyGameObjectManager.removeCoordGameObjects(area.coord)
    );
  };

  const updatePlayerCoords = (coords: Set<number>) => {
    clearPlayerArea(playerArea);
    playerArea = getPlayerArea(coords);
    playerArea.forEach((area) => {
      area.borders.forEach((border) => {
        lazyGameObjectManager.addGameObject(area.coord, border);
      });
    });
  };

  lazyGameObjectManager.initialize();

  return { updatePlayerCoords };
};

export default createOtherPlayersStateManager;
