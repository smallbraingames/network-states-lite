import { coordToKey, keyToCoord } from "@latticexyz/utils";

import { Game } from "../../../types";
import { PlayerStateTilesManager } from "../../types";
import { defineComponentSystem } from "@latticexyz/recs";
import getEntityIndexCoord from "../../../../network/utils/getEntityIndexCoord";

const setupPlayerStateTilesSystem = async (
  game: Game,
  playerStateTilesManager: PlayerStateTilesManager
) => {
  const {
    player,
    main: {
      mainWorld,
      clientComponents: { Player },
    },
  } = game;

  const tiles: Set<number> = new Set();

  const { updatePlayerStateTiles } = playerStateTilesManager;

  defineComponentSystem(mainWorld, Player, (update) => {
    const coord = getEntityIndexCoord(update.entity, mainWorld);
    const coordKey = coordToKey(coord);
    const playerKey = player.toLowerCase();

    if (update.value[0]?.value.toLowerCase() === playerKey) {
      tiles.add(coordKey);
      updatePlayerStateTiles(
        player,
        [...tiles].map((key) => keyToCoord(key))
      );
      return;
    }

    if (tiles.has(coordKey)) {
      tiles.delete(coordKey);
      updatePlayerStateTiles(
        player,
        [...tiles].map((key) => keyToCoord(key))
      );
      return;
    }
  });
};

export default setupPlayerStateTilesSystem;
