import { Type, World, defineComponent } from "@latticexyz/recs";

import { Input } from "../../../phaser/types";
import { MainConfig } from "../../types";
import { Network } from "../../../../network/types";
import setupHeaderInfoComponent from "./setupHeaderInfoComponent";
import setupPlayerComponent from "./setupPlayerComponent";
import setupTroopCountComponent from "./setupTroopCountComponent";

const createClientComponents = (
  player: string,
  network: Network,
  mainWorld: World,
  input: Input,
  config: MainConfig
) => {
  const {
    components: { IsCapitalTable, StateOwnerTable, StateTable },
  } = network;

  const clientComponents = {
    TroopCount: defineComponent(
      mainWorld,
      { value: Type.Number },
      { id: "client.TroopCount" }
    ),
    IsCapital: IsCapitalTable,
    StateOwner: StateOwnerTable,
    State: StateTable,
    Player: defineComponent(mainWorld, { value: Type.String }),
    SelectedTile: defineComponent(mainWorld, {
      x: Type.Number,
      y: Type.Number,
    }),
    HeaderInfo: defineComponent(mainWorld, {
      networkState: Type.String,
      numCitizens: Type.String,
      months: Type.String,
      years: Type.String,
      homeStateId: Type.String,
    }),
  };

  setupTroopCountComponent(network, mainWorld, clientComponents);
  setupPlayerComponent(mainWorld, clientComponents);
  setupHeaderInfoComponent(
    mainWorld,
    clientComponents,
    network,
    player,
    input,
    config
  );

  return clientComponents;
};

export default createClientComponents;
