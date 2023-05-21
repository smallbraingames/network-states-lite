import { Coord, coordToKey } from "@latticexyz/utils";

import { createPerlin } from "@latticexyz/noise";
import { GameObjects } from "phaser";
import config from "../../../../contracts/out/Config.sol/Config.json";
import { tileCoordToPixelCoord } from "../phaser/utils/tileCoordToPixelCoord";
import { Game } from "../types";
import createLazyGameObjectManager from "./setup/createLazyGameObjectManager";
import { Terrain } from "./types";

const getValueOfSymbol = (name: string): string => {
  const node = config.ast.nodes.find((node) => node.name === name);
  if (!node) {
    throw Error(`No node with name ${name} found in config`);
  }
  const value = node.value?.value;
  if (value === undefined) {
    throw Error(`Node with name ${name} has no value`);
  }
  return value;
};

const perlinDenom = parseInt(getValueOfSymbol("PERLIN_DENOM"));
const perlinDigits = parseInt(getValueOfSymbol("PERLIN_DIGITS"));
const perlinThresholdMountain = parseInt(
  getValueOfSymbol("PERLIN_THRESHOLD_MOUNTAIN")
);
const perlinThresholdWater = parseInt(
  getValueOfSymbol("PERLIN_THRESHOLD_WATER")
);

const createTerrainManager = async (game: Game) => {
  const perlin = await createPerlin();
  const {
    main: {
      scene,
      config: {
        tilemap: { gridSize, tileWidth, tileHeight },
        text: { fontFamily, fontSize, darkColor },
      },
    },
  } = game;

  const createGameObject = (coord: Coord, _: string) => {
    return createTerrain(coord);
  };

  const getTerrainText = (terrain: Terrain) => {
    if (terrain === Terrain.BARE) {
      throw Error("No text for terrain BARE");
    }
    return terrain === Terrain.MOUNTAIN ? "Hill" : "Water";
  };

  const createTerrain = (coord: Coord) => {
    const terrain = getTerrainAtCoord(coord);
    if (terrain === Terrain.BARE) {
      throw Error("No terrain at bare tile");
    }
    const position = tileCoordToPixelCoord(coord, tileWidth, tileHeight);
    const text = getTerrainText(terrain);

    const textGameObject = scene.add.text(position.x, position.y, text, {
      fontSize,
      color: darkColor,
      fontFamily,
    });
    textGameObject.setPosition(
      position.x + tileWidth / 2 - textGameObject.width / 2,
      position.y + tileHeight / 2 - textGameObject.height / 2
    );
    return textGameObject;
  };

  const terrainMemo = new Map<number, Terrain>();
  const getTerrainAtCoord = (coord: Coord) => {
    const coordKey = coordToKey(coord);
    if (terrainMemo.has(coordKey)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return terrainMemo.get(coordKey)!;
    }
    const perlinValue = Math.floor(
      perlin(coord.x, coord.y, 0, perlinDenom) * 10 ** perlinDigits
    );

    let terrain: Terrain;
    if (perlinValue >= perlinThresholdMountain) {
      terrain = Terrain.MOUNTAIN;
    } else if (perlinValue <= perlinThresholdWater) {
      terrain = Terrain.WATER;
    } else {
      terrain = Terrain.BARE;
    }
    terrainMemo.set(coordKey, terrain);
    return terrain;
  };

  const lazyGameObjectManager = createLazyGameObjectManager<GameObjects.Text>(
    game,
    createGameObject
  );

  const lazyAddTerrain = async () => {
    const halfGridSize = gridSize / 2;
    for (let x = -halfGridSize; x < halfGridSize; x++) {
      for (let y = -halfGridSize; y < halfGridSize; y++) {
        const coord = { x, y };
        if (getTerrainAtCoord(coord) !== Terrain.BARE) {
          lazyGameObjectManager.addGameObject(coord, "");
        }
      }
    }
    lazyGameObjectManager.initialize();
  };

  return { getTerrainAtCoord, lazyAddTerrain };
};

export default createTerrainManager;
