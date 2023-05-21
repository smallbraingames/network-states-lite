import {
  Has,
  World,
  defineEnterSystem,
  getComponentValue,
  getComponentValueStrict,
  setComponent,
} from "@latticexyz/recs";
import { coordToKey, keyToCoord } from "@latticexyz/utils";

import { MainClientComponents } from "../../types";
import { Network } from "../../../../network/types";
import getCapitalTroopCount from "../../getCapitalTroopCount";
import getCoordEntityIndex from "../../../../network/utils/getCoordEntityIndex";
import getEntityIndexCoord from "../../../../network/utils/getEntityIndexCoord";
import getNonCapitalTroopCount from "../../getNonCapitalTroopCount";

const setupTroopCountComponent = (
  network: Network,
  mainWorld: World,
  clientComponents: MainClientComponents
) => {
  const { TroopCount, IsCapital } = clientComponents;
  const {
    world,
    components: { TroopCountTable, LastUpdateTable },
    network: { blockNumber$ },
  } = network;

  const liveCoords = new Set<number>();

  defineEnterSystem(mainWorld, [Has(TroopCountTable)], (update) => {
    const troopCount = getComponentValueStrict(TroopCountTable, update.entity);
    setComponent(TroopCount, update.entity, troopCount);
    const coord = getEntityIndexCoord(update.entity, world);
    liveCoords.add(coordToKey(coord));
  });

  blockNumber$.subscribe((blockNumber) => {
    liveCoords.forEach((coordKey) => {
      const coord = keyToCoord(coordKey);
      const entityIndex = getCoordEntityIndex(coord, world);

      const troopCount = getComponentValueStrict(TroopCountTable, entityIndex);
      const lastUpdate = getComponentValueStrict(LastUpdateTable, entityIndex);
      const isCapital = getComponentValue(IsCapital, entityIndex);

      let currentTroops;
      if (isCapital && isCapital.value) {
        currentTroops = getCapitalTroopCount(
          troopCount.value,
          Number(lastUpdate.value),
          blockNumber
        );
      } else {
        currentTroops = getNonCapitalTroopCount(
          troopCount.value,
          Number(lastUpdate.value),
          blockNumber
        );
      }
      setComponent(TroopCount, entityIndex, { value: currentTroops });
    });
  });
};

export default setupTroopCountComponent;
