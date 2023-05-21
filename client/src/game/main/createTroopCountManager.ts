import { Coord, coordToKey } from "@latticexyz/utils";

import { Game } from "../types";
import { GameObjects } from "phaser";
import { PlayerStateTilesManager } from "./types";
import formatNumber from "./utils/formatNumber";
import { getComponentValueStrict } from "@latticexyz/recs";
import getCoordEntityIndex from "../../network/utils/getCoordEntityIndex";
import { tileCoordToPixelCoord } from "../phaser/utils/tileCoordToPixelCoord";

const createTroopCountManager = (
  game: Game,
  playerStateTilesManager: PlayerStateTilesManager
) => {
  const {
    player: mainPlayer,
    main: {
      scene,
      mainWorld,
      clientComponents: { Player },
      config: {
        tilemap: { tileWidth, tileHeight, solidColorTextIsDark },
        text: { fontFamily, fontSize, darkColor, lightColor },
      },
    },
  } = game;

  const { getPlayerColorTile } = playerStateTilesManager;

  const troopCountTexts = new Map<number, GameObjects.Text>();

  const getTextColor = (coord: Coord) => {
    // Get the player at this coord
    const coordEntityIndex = getCoordEntityIndex(coord, mainWorld);
    const player = getComponentValueStrict(Player, coordEntityIndex).value;

    if (player.toLowerCase() !== mainPlayer.toLowerCase()) {
      return darkColor;
    }

    const colorTileIndex = getPlayerColorTile(player);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (solidColorTextIsDark[colorTileIndex]) {
      return darkColor;
    }
    return lightColor;
  };

  const createCoordText = (coord: Coord) => {
    const key = coordToKey(coord);
    const position = tileCoordToPixelCoord(coord, tileWidth, tileHeight);
    const text = scene.add.text(position.x, position.y, "", {
      fontFamily,
      fontSize,
      color: getTextColor(coord),
    });
    troopCountTexts.set(key, text);
    return text;
  };

  const setCoordTroopCount = (coord: Coord, troopCount: number) => {
    const key = coordToKey(coord);
    let textObject = troopCountTexts.get(key);
    if (!textObject) {
      textObject = createCoordText(coord);
    }
    textObject.setText(formatNumber(troopCount));
    const position = tileCoordToPixelCoord(coord, tileWidth, tileHeight);
    textObject.setPosition(
      position.x + tileWidth / 2 - textObject.width / 2,
      position.y + tileHeight / 2 - textObject.height / 2
    );
  };

  return { setCoordTroopCount };
};

export default createTroopCountManager;
