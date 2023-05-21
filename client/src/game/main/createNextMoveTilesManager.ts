import { Coord, coordToKey } from "@latticexyz/utils";
import { Terrain, TerrainManager } from "./types";

import { Game } from "../types";
import { SingletonID } from "@latticexyz/network";
import createLazyGameObjectManager from "./setup/createLazyGameObjectManager";
import { getComponentValueStrict } from "@latticexyz/recs";
import { tileCoordToPixelCoord } from "../phaser/utils/tileCoordToPixelCoord";

const createNextMoveTilesManager = (
  game: Game,
  terrainManager: TerrainManager
) => {
  const {
    main: {
      scene,

      mainWorld,
      clientComponents: { SelectedTile },
      config: {
        tilemap: { tileWidth, tileHeight },
        assetKeys: { next, selection },
      },
    },
  } = game;

  const { getTerrainAtCoord } = terrainManager;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const singletonEntity = mainWorld.entityToIndex.get(SingletonID)!;

  const findNextMoveCoords = (
    selectedCoord: Coord,
    playerStateCoords: Coord[]
  ): Coord[] => {
    const coordSet = new Set(
      playerStateCoords.map((coord) => coordToKey(coord))
    );
    const { x, y } = selectedCoord;
    const adjacentCoords = [];
    for (let i = -1; i <= 1; i += 2) {
      const leftCoord = { x: x + i, y };
      const rightCoord = { x: x - i, y };
      const topCoord = { x, y: y + i };
      const bottomCoord = { x, y: y - i };
      if (!coordSet.has(coordToKey(leftCoord))) {
        adjacentCoords.push(leftCoord);
      }
      if (!coordSet.has(coordToKey(rightCoord))) {
        adjacentCoords.push(rightCoord);
      }
      if (!coordSet.has(coordToKey(topCoord))) {
        adjacentCoords.push(topCoord);
      }
      if (!coordSet.has(coordToKey(bottomCoord))) {
        adjacentCoords.push(bottomCoord);
      }
    }
    return adjacentCoords;
  };

  const getNextMoveCoords = (selectedCoord: Coord, playerCoords: Coord[]) => {
    const nextMoveCoords = findNextMoveCoords(selectedCoord, playerCoords);
    return nextMoveCoords.filter(
      (coord) => getTerrainAtCoord(coord) === Terrain.BARE
    );
  };

  const createGameObject = (coord: Coord, _: string) => {
    const selectedCoord = getComponentValueStrict(
      SelectedTile,
      singletonEntity
    );
    const position = tileCoordToPixelCoord(coord, tileWidth, tileHeight);
    position.x += tileWidth / 2;
    position.y += tileHeight / 2;
    if (coordToKey(coord) === coordToKey(selectedCoord)) {
      return scene.add.image(position.x, position.y, selection);
    }
    return scene.add.image(position.x, position.y, next);
  };

  const lazyGameObjectManager = createLazyGameObjectManager(
    game,
    createGameObject
  );

  const updateNextMoveTiles = (playerCoords: Coord[]) => {
    const selectedCoord = getComponentValueStrict(
      SelectedTile,
      singletonEntity
    );
    lazyGameObjectManager.removeAll();
    const newNextMoveCoords = getNextMoveCoords(selectedCoord, playerCoords);
    newNextMoveCoords.forEach((coord) => {
      lazyGameObjectManager.addGameObject(coord, "");
    });
    lazyGameObjectManager.addGameObject(selectedCoord, "");
  };

  const clearNextMoveTiles = () => {
    lazyGameObjectManager.removeAll();
  };

  lazyGameObjectManager.initialize();

  return { updateNextMoveTiles, clearNextMoveTiles };
};

export default createNextMoveTilesManager;
