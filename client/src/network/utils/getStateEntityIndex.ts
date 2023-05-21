import { EntityIndex, World } from "@latticexyz/recs";

const getStateEntityIndex = (stateId: bigint, world: World): EntityIndex => {
  for (let i = 0; i < world.entities.length; i++) {
    const entity = world.entities[i];
    let entityValue = -1;
    try {
      entityValue = Number(BigInt(entity));
    } catch (e) {
      //
    }
    if (entityValue === Number(stateId)) {
      return i as EntityIndex;
    }
  }
  throw Error("No entity index found for state");
};

export default getStateEntityIndex;
