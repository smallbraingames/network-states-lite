import { Direction, MainScene } from "../types";

import { Coord } from "@latticexyz/utils";
import { Network } from "../../../network/types";

const connectNetwork = (network: Network, main: MainScene) => {
  const { worldSend } = network;

  const spawn = () => {
    return worldSend("spawn", [{ gasLimit: 5_000_000 }]);
  };

  const move = (from: Coord, direction: Direction) => {
    return worldSend("move", [from, direction]);
  };

  const context = {
    api: { spawn, move },
    ...main,
  };

  return context;
};

export default connectNetwork;
