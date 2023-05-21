import { EntityIndex, World } from "@latticexyz/recs";

import { Coord } from "@latticexyz/utils";
import getCoordEntity from "./getCoordEntity";

const getCoordEntityIndex = (coord: Coord, world: World): EntityIndex => {
  const entityID = getCoordEntity(coord);
  const entityIndex = world.entityToIndex.get(entityID);
  if (!entityIndex) {
    throw Error(
      `Coord to entity index: No entity index for coord ${coord.x},${coord.y} with entity id ${entityID}`
    );
  }
  return entityIndex;
};

export default getCoordEntityIndex;
