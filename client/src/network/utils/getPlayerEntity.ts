import { World } from "@latticexyz/recs";

const getPlayerEntity = (player: string, world: World) => {
  // TODO: hack for now, fix after response from discord
  const playerEntity = world.entities.filter(
    (entityId) =>
      entityId.toLowerCase().slice(0, player.length) === player.toLowerCase() &&
      entityId.length == 66
  );
  if (playerEntity.length === 0) {
    throw Error("Header info: No entity for player found");
  }
  return playerEntity[0];
};

export default getPlayerEntity;
