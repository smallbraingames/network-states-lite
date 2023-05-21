import { HasValue, defineComponentSystem, runQuery } from "@latticexyz/recs";

import { Game } from "../../../types";
import { OtherPlayersStateManager } from "../../types";
import { coordToKey } from "@latticexyz/utils";
import createOtherPlayersStateManager from "../../createOtherPlayersStateManager";
import getEntityIndexCoord from "../../../../network/utils/getEntityIndexCoord";

const setupOtherPlayersStateSystem = async (game: Game) => {
  const {
    player,
    main: {
      mainWorld,
      clientComponents: { Player },
    },
  } = game;

  const stateManagers: Map<string, OtherPlayersStateManager> = new Map();

  defineComponentSystem(mainWorld, Player, (update) => {
    const playerKey = player.toLowerCase();
    if (
      (update.value[0]?.value.toLowerCase() === playerKey ||
        update.value[0] === undefined) &&
      (update.value[1]?.value.toLowerCase() === playerKey ||
        update.value[1] === undefined)
    ) {
      return;
    }

    const players = [];
    if (update.value[0]) players.push(update.value[0]);
    if (update.value[1]) players.push(update.value[1]);

    players.forEach((player) => {
      let stateManager = stateManagers.get(player.value);
      if (!stateManager) {
        stateManager = createOtherPlayersStateManager(game);
        stateManagers.set(player.value, stateManager);
      }
      const coordEntityIndexes = runQuery([
        HasValue(Player, { value: player.value }),
      ]);
      const coordKeys = new Set(
        [...coordEntityIndexes].map((entityIndex) =>
          coordToKey(getEntityIndexCoord(entityIndex, mainWorld))
        )
      );
      stateManager.updatePlayerCoords(coordKeys);
    });
  });
};

export default setupOtherPlayersStateSystem;
