import {
  EntityIndex,
  Has,
  defineEnterSystem,
  defineExitSystem,
  defineUpdateSystem,
  getComponentValue,
} from "@latticexyz/recs";

import { Game } from "../../../types";
import { TileManager } from "../../types";
import getEntityIndexCoord from "../../../../network/utils/getEntityIndexCoord";

const setupTroopCountSystem = (game: Game, tileManager: TileManager) => {
  const {
    main: {
      mainWorld,
      clientComponents: { TroopCount, Player },
    },
  } = game;

  const { setCoordTroopCount: setCoordText } = tileManager;

  const query = [Has(Player), Has(TroopCount)];

  const updateTroopCount = (entityIndex: EntityIndex) => {
    const troopCount = getComponentValue(TroopCount, entityIndex)?.value;
    const coord = getEntityIndexCoord(entityIndex, mainWorld);
    setCoordText(coord, troopCount ? troopCount : 0);
  };

  defineEnterSystem(mainWorld, query, (update) => {
    updateTroopCount(update.entity);
  });

  defineUpdateSystem(mainWorld, query, (update) => {
    updateTroopCount(update.entity);
  });

  defineExitSystem(mainWorld, query, (update) => {
    updateTroopCount(update.entity);
  });
};

export default setupTroopCountSystem;
