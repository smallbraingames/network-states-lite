import {
  World,
  defineComponentSystem,
  getComponentEntities,
  getComponentValueStrict,
  removeComponent,
  setComponent,
} from "@latticexyz/recs";

import { MainClientComponents } from "../../types";
import getStateEntityIndex from "../../../../network/utils/getStateEntityIndex";

const setupPlayerComponent = (
  mainWorld: World,
  clientComponents: MainClientComponents
) => {
  const { State, StateOwner, Player } = clientComponents;

  defineComponentSystem(mainWorld, State, (update) => {
    const stateId = update.value[0]?.value;
    if (stateId === undefined) {
      // No state at this location
      removeComponent(Player, update.entity);
      return;
    }
    const owner = getComponentValueStrict(
      StateOwner,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      getStateEntityIndex(stateId, mainWorld)
    );
    setComponent(Player, update.entity, owner);
  });

  defineComponentSystem(mainWorld, StateOwner, (update) => {
    // State owner has an update, so get all tiles this state owner owns and then get their player
    const stateId = parseInt(mainWorld.entities[update.entity]);
    const newOwner = update.value[0]?.value;
    if (newOwner === undefined) {
      return;
    }

    const tileEntities = getComponentEntities(State);
    [...tileEntities].forEach((entity) => {
      if (Number(getComponentValueStrict(State, entity).value) === stateId) {
        setComponent(Player, update.entity, { value: newOwner });
      }
    });
  });
};

export default setupPlayerComponent;
