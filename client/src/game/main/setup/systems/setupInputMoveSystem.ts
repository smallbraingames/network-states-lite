import {
  getComponentValue,
  removeComponent,
  setComponent,
} from "@latticexyz/recs";

import { Game } from "../../../types";
import { MoveSequenceManager } from "../../types";
import { SingletonID } from "@latticexyz/network";
import { coordToKey } from "@latticexyz/utils";
import getCoordEntityIndex from "../../../../network/utils/getCoordEntityIndex";
import { pixelCoordToTileCoord } from "../../../phaser/utils/pixelCoordToTileCoord";

const setupInputMoveSystem = async (
  game: Game,
  moveSequenceManager: MoveSequenceManager
) => {
  const {
    player,
    main: {
      mainWorld,
      input,
      config: {
        tilemap: { tileWidth, tileHeight },
      },
      clientComponents: { SelectedTile, Player },
    },
  } = game;

  const { add, isAdjacent, getCoordsMove } = moveSequenceManager;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const singletonEntity = mainWorld.entityToIndex.get(SingletonID)!;

  input.click$.subscribe((p) => {
    const pointer = p as Phaser.Input.Pointer;
    const tilePosition = pixelCoordToTileCoord(
      { x: pointer.worldX, y: pointer.worldY },
      tileWidth,
      tileHeight
    );

    const selectedTile = getComponentValue(SelectedTile, singletonEntity);
    if (selectedTile === undefined) {
      setComponent(SelectedTile, singletonEntity, tilePosition);
      return;
    }
    if (coordToKey(tilePosition) === coordToKey(selectedTile)) {
      removeComponent(SelectedTile, singletonEntity);
      return;
    }

    let coordEntity = undefined;
    try {
      coordEntity = getCoordEntityIndex(tilePosition, mainWorld);
    } catch (e) {
      //
    }

    if (
      coordEntity !== undefined &&
      getComponentValue(Player, coordEntity)?.value.toLowerCase() ===
        player.toLowerCase()
    ) {
      if (!isAdjacent(tilePosition, selectedTile)) {
        setComponent(SelectedTile, singletonEntity, tilePosition);
        return;
      }
    }

    if (isAdjacent(tilePosition, selectedTile)) {
      const move = getCoordsMove(selectedTile, tilePosition);
      add(move);
      setComponent(SelectedTile, singletonEntity, tilePosition);
    }
  });
};

export default setupInputMoveSystem;
