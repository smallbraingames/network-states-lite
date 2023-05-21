import { Coord } from "@latticexyz/utils";
import { Game } from "../types";
import createTileGroupManager from "./createTileGroupManager";

const createPlayerStateTilesManager = (game: Game) => {
  const {
    main: {
      config: {
        tilemap: { solidColorTileIndices },
      },
    },
  } = game;

  const { setTileGroup } = createTileGroupManager(game);

  const getPlayerColorTile = (address: string) => {
    return solidColorTileIndices[
      Number(address.slice(0, 14)) % solidColorTileIndices.length
    ];
  };

  const updatePlayerStateTiles = (address: string, playerCoords: Coord[]) => {
    const tileIndex = getPlayerColorTile(address);
    const tileIndices = playerCoords.map(() => tileIndex);
    setTileGroup(tileIndices, playerCoords);
  };

  return { updatePlayerStateTiles, getPlayerColorTile };
};

export default createPlayerStateTilesManager;
