import { coordToKey, keyToCoord } from "@latticexyz/utils";
import { defineComponentSystem, getComponentValue } from "@latticexyz/recs";

import { Game } from "../../../types";
import { NextMoveTilesManager } from "../../types";
import { SingletonID } from "@latticexyz/network";
import getEntityIndexCoord from "../../../../network/utils/getEntityIndexCoord";

const setupNextMoveTilesSystem = async (
  game: Game,
  nextMoveTilesManager: NextMoveTilesManager
) => {
  const {
    player,
    main: {
      mainWorld,
      clientComponents: { Player, SelectedTile },
    },
  } = game;

  const { updateNextMoveTiles, clearNextMoveTiles } = nextMoveTilesManager;

  const playerCoords = new Set<number>();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const singletonEntity = mainWorld.entityToIndex.get(SingletonID)!;

  defineComponentSystem(mainWorld, Player, (update) => {
    const updatePlayer = update.value[0]?.value;
    if (player.toLowerCase() !== updatePlayer?.toLowerCase()) {
      return;
    }
    const coord = getEntityIndexCoord(update.entity, mainWorld);
    playerCoords.add(coordToKey(coord)); // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

    const selectedTile = getComponentValue(SelectedTile, singletonEntity);
    if (selectedTile === undefined) {
      return;
    }

    updateNextMoveTiles([...playerCoords].map((coord) => keyToCoord(coord)));
  });

  defineComponentSystem(mainWorld, SelectedTile, () => {
    const selectedTile = getComponentValue(SelectedTile, singletonEntity);
    if (selectedTile === undefined) {
      clearNextMoveTiles();
      return;
    }
    updateNextMoveTiles([...playerCoords].map((coord) => keyToCoord(coord)));
  });
};

export default setupNextMoveTilesSystem;
