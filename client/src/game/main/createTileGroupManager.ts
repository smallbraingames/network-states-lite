import { Coord, coordToKey, keyToCoord } from "@latticexyz/utils";

import { Game } from "../types";

const createTileGroupManager = (game: Game) => {
  const {
    main: {
      tilemap: { putTileAt, removeTileAt },
    },
  } = game;

  let groupCoordKeys = new Set<number>();

  const setTileGroup = (tileIndices: number[], coords: Coord[]) => {
    const newGroupCoordKeys = new Set<number>();
    coords.forEach((coord, index) => {
      const key = coordToKey(coord);
      newGroupCoordKeys.add(key);
      if (groupCoordKeys.has(key)) {
        return;
      }
      putTileAt(tileIndices[index], coord);
    });
    const oldCoords = [...groupCoordKeys].filter(
      (x) => !newGroupCoordKeys.has(x)
    );
    oldCoords.forEach((coord) => removeTileAt(keyToCoord(coord)));
    groupCoordKeys = newGroupCoordKeys;
  };

  return { setTileGroup };
};

export default createTileGroupManager;
