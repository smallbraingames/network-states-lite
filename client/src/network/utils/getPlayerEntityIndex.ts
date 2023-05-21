import { World } from "@latticexyz/recs";
import getPlayerEntity from "./getPlayerEntity";

const getPlayerEntityIndex = (player: string, world: World) => {
  const playerEntity = getPlayerEntity(player, world);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return world.entityToIndex.get(playerEntity)!;
};

export default getPlayerEntityIndex;
