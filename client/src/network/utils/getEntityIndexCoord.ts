import { EntityIndex, World } from "@latticexyz/recs";

import getEntityCoord from "./getEntityCoord";

const getEntityIndexCoord = (entityIndex: EntityIndex, world: World) => {
  const entity = world.entities[entityIndex];
  return getEntityCoord(entity);
};

export default getEntityIndexCoord;
