import {
  EntityIndex,
  Has,
  World,
  defineUpdateSystem,
  getComponentEntities,
  getComponentValueStrict,
  removeComponent,
  setComponent,
} from "@latticexyz/recs";
import { MainClientComponents, MainConfig } from "../../types";

import { Input } from "../../../phaser/types";
import { Network } from "../../../../network/types";
import { SingletonID } from "@latticexyz/network";
import { firstValueFrom } from "rxjs";
import formatNumber from "../../utils/formatNumber";
import getCoordEntityIndex from "../../../../network/utils/getCoordEntityIndex";
import getPlayerEntityIndex from "../../../../network/utils/getPlayerEntityIndex";
import getStateEntityIndex from "../../../../network/utils/getStateEntityIndex";
import getTimeSince from "../../utils/getTimeSince";
import { pixelCoordToTileCoord } from "../../../phaser/utils/pixelCoordToTileCoord";

// TODO: this method is inefficient, loops through all tiles every update
const setupHeaderInfoComponent = (
  mainWorld: World,
  clientComponents: MainClientComponents,
  network: Network,
  player: string,
  input: Input,
  config: MainConfig
) => {
  const {
    tilemap: { tileWidth, tileHeight },
  } = config;
  const {
    components: { FoundedTable, HomeStateTable },
    network: { blockNumber$ },
  } = network;
  const { Player, TroopCount, HeaderInfo } = clientComponents;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const singletonEntity = mainWorld.entityToIndex.get(SingletonID)!;

  let activePlayer = player;

  const updateHeaderInfo = async () => {
    let playerEntityIndex: EntityIndex | undefined = undefined;
    try {
      playerEntityIndex = getPlayerEntityIndex(activePlayer, mainWorld);
    } catch (e) {
      // No player entity index
      removeComponent(HeaderInfo, singletonEntity);
      return;
    }

    const troopCountEntities = [...getComponentEntities(Player)].filter(
      (entityIndex) => {
        return (
          activePlayer.toLowerCase() ===
          getComponentValueStrict(Player, entityIndex).value.toLowerCase()
        );
      }
    );
    let totalTroopCount = 0;
    troopCountEntities.forEach((entityIndex) => {
      totalTroopCount += getComponentValueStrict(TroopCount, entityIndex).value;
    });
    const formattedTotalTroopCount = formatNumber(totalTroopCount);
    const currentBlockNumber = await firstValueFrom(blockNumber$);

    const playerHomeStateId = getComponentValueStrict(
      HomeStateTable,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      playerEntityIndex!
    );
    const stateIdEntityIndex = getStateEntityIndex(
      playerHomeStateId.value,
      mainWorld
    );
    const foundedBlockNumber = getComponentValueStrict(
      FoundedTable,
      stateIdEntityIndex
    );
    const time = getTimeSince(
      Number(foundedBlockNumber.value),
      currentBlockNumber,
      config
    );

    setComponent(HeaderInfo, singletonEntity, {
      networkState: "Network States",
      numCitizens: formattedTotalTroopCount,
      months: time.months.toString(),
      years: time.years.toString(),
      homeStateId: `0x${getComponentValueStrict(
        HomeStateTable,
        playerEntityIndex
      )
        .value.toString()
        .padStart(64, "0")}`,
    });
  };

  input.pointermove$.subscribe((position) => {
    const tileCoord = pixelCoordToTileCoord(
      { x: position.pointer.worldX, y: position.pointer.worldY },
      tileWidth,
      tileHeight
    );
    let coordEntity = undefined;
    try {
      coordEntity = getCoordEntityIndex(tileCoord, mainWorld);
    } catch (e) {
      activePlayer = player;
      updateHeaderInfo();
      return;
    }
    const tilePlayer = getComponentValueStrict(Player, coordEntity);
    if (activePlayer.toLowerCase() !== tilePlayer.value.toLowerCase()) {
      activePlayer = tilePlayer.value;
      updateHeaderInfo();
    }
  });

  const updateHeaderIfNecessary = (entityIndex: EntityIndex) => {
    const player = getComponentValueStrict(Player, entityIndex);
    if (player.value.toLowerCase() !== activePlayer.toLowerCase()) {
      return;
    }
    updateHeaderInfo();
  };

  defineUpdateSystem(mainWorld, [Has(Player), Has(TroopCount)], (update) => {
    updateHeaderIfNecessary(update.entity);
  });
};

export default setupHeaderInfoComponent;
