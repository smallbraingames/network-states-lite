import { Coord, coordToKey } from "@latticexyz/utils";
import { Direction, Move } from "./types";

import { Game } from "../types";
import createLazyGameObjectManager from "./setup/createLazyGameObjectManager";
import { tileCoordToPixelCoord } from "../phaser/utils/tileCoordToPixelCoord";

const PI = 3.1415926;

const createArrowManager = (game: Game) => {
  const {
    main: {
      scene,

      config: {
        tilemap: { tileWidth, tileHeight },
        assetKeys: { arrow },
      },
    },
  } = game;

  const moves: Map<string, Move> = new Map();

  const moveToId = (move: Move) => {
    return `${coordToKey(move.coord)}:${move.direction}`;
  };

  const createGameObject = (_: Coord, key: string) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const move = moves.get(key)!;
    return createArrowGameObject(move);
  };

  const createArrowGameObject = (move: Move) => {
    const position = tileCoordToPixelCoord(move.coord, tileWidth, tileHeight);
    let rotation = 0;
    const image = scene.add.image(position.x, position.y, arrow);
    switch (move.direction) {
      case Direction.UP:
        rotation = (3 * PI) / 2;
        position.x += tileWidth / 2 - image.width / 2;
        break;
      case Direction.DOWN:
        rotation = PI / 2;
        position.y += tileHeight;
        position.x += tileWidth / 2 - image.width / 2;
        break;
      case Direction.LEFT:
        position.x += tileWidth;
        position.y += tileHeight / 2 - image.height / 2;
        break;
      case Direction.RIGHT:
        rotation = PI;
        position.y += tileHeight / 2 - image.height / 2;
        break;
    }
    image.setRotation(rotation);
    image.setPosition(position.x, position.y);
    return image;
  };

  const lazyGameObjectManager = createLazyGameObjectManager(
    game,
    createGameObject
  );

  const addArrow = (move: Move) => {
    const id = moveToId(move);
    moves.set(id, move);
    lazyGameObjectManager.addGameObject(move.coord, id);
  };

  const removeArrow = (move: Move) => {
    lazyGameObjectManager.removeGameObject(move.coord, moveToId(move));
  };

  lazyGameObjectManager.initialize();

  return { addArrow, removeArrow };
};

export default createArrowManager;
