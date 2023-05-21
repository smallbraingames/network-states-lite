import { Coord, coordToKey, keyToCoord } from "@latticexyz/utils";

import { Game } from "../../types";
import { pixelCoordToTileCoord } from "../../phaser/utils/pixelCoordToTileCoord";

const getRectTileCoords = (
  rect: Phaser.Geom.Rectangle,
  tileWidth: number,
  tileHeight: number
): Coord[] => {
  const topLeft = { x: rect.x, y: rect.y };
  const bottomRight = { x: rect.x + rect.width, y: rect.y + rect.height };
  const tileCoords: Coord[] = [];
  const startTile = pixelCoordToTileCoord(topLeft, tileWidth, tileHeight);
  const endTile = pixelCoordToTileCoord(bottomRight, tileWidth, tileHeight);
  for (let x = startTile.x; x <= endTile.x; x++) {
    for (let y = startTile.y; y <= endTile.y; y++) {
      tileCoords.push({ x, y });
    }
  }
  return tileCoords;
};

const createLazyGameObjectManager = <
  T extends Phaser.GameObjects.GameObject | Phaser.GameObjects.Group
>(
  game: Game,
  createGameObject: (coord: Coord, key: string) => T
) => {
  const {
    main: {
      config: {
        tilemap: { tileHeight, tileWidth },
      },
      camera: {
        worldView$,
        phaserCamera: { worldView },
      },
    },
  } = game;

  let initialized = false;
  let activeCoords = new Set<number>();
  const gameObjects = new Map<number, Set<{ gameObject: T; key: string }>>();
  let gameObjectKeys = new Map<number, Set<string>>();

  const addGameObject = (coord: Coord, key: string) => {
    const coordKey = coordToKey(coord);
    let keys: Set<string>;
    if (!gameObjectKeys.has(coordKey)) {
      keys = new Set();
      gameObjectKeys.set(coordKey, keys);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      keys = gameObjectKeys.get(coordKey)!;
    }
    keys.add(key);
    if (initialized) {
      activeCoords.delete(coordKey);
      render(worldView);
    }
  };

  const removeAll = () => {
    gameObjectKeys = new Map();
    refresh();
  };

  const removeCoordGameObjects = (coord: Coord) => {
    const coordKey = coordToKey(coord);
    gameObjectKeys.delete(coordKey);
    gameObjects.get(coordKey)?.forEach((gameObject) => {
      gameObject.gameObject.destroy();
    });
    gameObjects.delete(coordKey);
    activeCoords.delete(coordKey);
    render(worldView);
  };

  const removeGameObject = (coord: Coord, key: string) => {
    const coordKey = coordToKey(coord);
    const coordObjects = gameObjects.get(coordKey);
    if (!coordObjects) {
      return;
    }
    coordObjects.forEach((gameObject) => {
      if (gameObject.key == key) {
        gameObject.gameObject.destroy();
        coordObjects.delete(gameObject);
      }
    });
    gameObjectKeys.get(coordKey)?.delete(key);
    activeCoords.delete(coordKey);
    render(worldView);
  };

  const createCoordGameObjects = (coordKey: number) => {
    if (!gameObjectKeys.has(coordKey)) {
      return;
    }

    // Delete previous game objects at key
    gameObjects
      .get(coordKey)
      ?.forEach((gameObject) => gameObject.gameObject.destroy());
    gameObjects.delete(coordKey);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const keys = gameObjectKeys.get(coordKey)!;
    let gameObjectSet = gameObjects.get(coordKey);
    if (!gameObjectSet) {
      gameObjectSet = new Set<{ gameObject: T; key: string }>();
    }
    keys.forEach((key) => {
      const gameObject = createGameObject(keyToCoord(coordKey), key);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      gameObjectSet!.add({ gameObject, key });
    });
    gameObjects.set(coordKey, gameObjectSet);
  };

  const refresh = () => {
    activeCoords = new Set();
    [...gameObjects.entries()].forEach((value) => {
      value[1].forEach((gameObject) => {
        gameObject.gameObject.destroy();
      });
    });
    render(worldView);
  };

  const render = (worldView: Phaser.Geom.Rectangle) => {
    const visibleCoords = getRectTileCoords(worldView, tileWidth, tileHeight);
    const visibleCoordKeys = new Set(
      visibleCoords.map((coord) => coordToKey(coord))
    );

    const offscreenCoordKeys = [...activeCoords].filter(
      (x) => !visibleCoordKeys.has(x)
    );

    const newVisibleCoordKeys = [...visibleCoordKeys].filter(
      (x) => !activeCoords.has(x)
    );

    offscreenCoordKeys.forEach((key) => {
      gameObjects
        .get(key)
        ?.forEach((gameObject) => gameObject.gameObject.destroy());
      gameObjects.delete(key);
    });

    newVisibleCoordKeys.forEach((key) => {
      createCoordGameObjects(key);
    });

    activeCoords = new Set(visibleCoordKeys);
  };

  const initialize = () => {
    render(worldView);

    worldView$.subscribe((worldView) => {
      render(worldView);
    });
    initialized = true;
  };

  return {
    addGameObject,
    initialize,
    removeCoordGameObjects,
    removeAll,
    removeGameObject,
  };
};

export default createLazyGameObjectManager;
