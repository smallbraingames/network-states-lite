import {
  defineComponentSystem,
  getComponentValueStrict,
} from "@latticexyz/recs";

import { Coord } from "@latticexyz/utils";
import { Game } from "../../../types";
import getEntityIndexCoord from "../../../../network/utils/getEntityIndexCoord";
import { tileCoordToPixelCoord } from "../../../phaser/utils/tileCoordToPixelCoord";

const setupCameraSystem = (game: Game) => {
  const {
    player: gamePlayer,
    main: {
      input,
      config: {
        tilemap: { tileWidth, tileHeight },
      },
      camera,
      mainWorld,
      clientComponents: { IsCapital, Player },
    },
  } = game;

  let playerCapitalCoord: Coord | undefined = undefined;

  defineComponentSystem(mainWorld, IsCapital, (update) => {
    const player = getComponentValueStrict(Player, update.entity).value;
    if (player.toLowerCase() !== gamePlayer.toLowerCase()) {
      return;
    }
    playerCapitalCoord = getEntityIndexCoord(update.entity, mainWorld);
  });

  input.keyboard$.subscribe((key) => {
    if (key.keyCode === Phaser.Input.Keyboard.KeyCodes.C && key.isDown) {
      if (playerCapitalCoord === undefined) {
        return;
      }
      const center = tileCoordToPixelCoord(
        playerCapitalCoord,
        tileWidth,
        tileHeight
      );
      camera.centerOn(center.x, center.y);
    }
  });
};

export default setupCameraSystem;
