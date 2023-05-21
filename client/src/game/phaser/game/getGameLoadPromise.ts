import { deferred } from "@latticexyz/utils";

const getGameLoadPromise = async (game: Phaser.Game) => {
  const [resolve, , promise] = deferred();
  game.events.on("ready", resolve);
  await promise;
};

export default getGameLoadPromise;
