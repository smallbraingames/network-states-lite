import { Contract, Signer, utils } from "ethers";
import { createFastTxExecutor, createFaucetService } from "@latticexyz/network";

import { BoundFastTxExecuteFn } from "./types";
import { IWorld__factory } from "../../../contracts/types/ethers-contracts/factories/IWorld__factory";
import { JsonRpcProvider } from "@ethersproject/providers";
import { createWorld } from "@latticexyz/recs";
import { defineContractComponents } from "../mud/contractComponents";
import getNetworkConfig from "./getNetworkConfig";
import { setupMUDV2Network } from "@latticexyz/std-client";

const createNetwork = async () => {
  const world = createWorld();
  const contractComponents = defineContractComponents(world);
  const networkConfig = getNetworkConfig();
  console.log("Creating network with config", networkConfig);
  const result = await setupMUDV2Network<typeof contractComponents>({
    networkConfig,
    world,
    contractComponents,
    syncThread: "main",
  });

  result.startSync();

  // Request drip from faucet
  const signer = result.network.signer.get();
  if (networkConfig.faucetServiceUrl && signer) {
    const address = await signer.getAddress();
    console.info("[Dev Faucet]: Player address -> ", address);

    const faucet = createFaucetService(networkConfig.faucetServiceUrl);

    const requestDrip = async () => {
      const balance = await signer.getBalance();
      const lowBalance = balance?.lte(utils.parseEther("1"));
      if (lowBalance) {
        console.info("[Dev Faucet]: Balance is low, dripping funds to player");
        // Double drip
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await faucet.dripDev({ address });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await faucet.dripDev({ address });
      }
    };

    requestDrip();
    // Request a drip every 20 seconds
    setInterval(requestDrip, 20000);
  }

  // Create a World contract instance
  const worldContract = IWorld__factory.connect(
    networkConfig.worldAddress,
    signer ?? result.network.providers.get().json
  );

  // Create a fast tx executor
  const fastTxExecutor =
    signer?.provider instanceof JsonRpcProvider
      ? await createFastTxExecutor(
          signer as Signer & { provider: JsonRpcProvider },
          { priorityFeeMultiplier: 2 }
        )
      : null;

  function bindFastTxExecute<C extends Contract>(
    contract: C
  ): BoundFastTxExecuteFn<C> {
    return async function (...args) {
      if (!fastTxExecutor) {
        throw new Error("No signer");
      }
      const { tx } = await fastTxExecutor.fastTxExecute(contract, ...args);
      return await tx;
    };
  }

  const worldSend = bindFastTxExecute(worldContract);

  const context = {
    ...result,
    components: {
      ...result.components,
      ...{},
    },
    worldContract,
    worldSend,
    fastTxExecutor,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).network = context;

  return context;
};

export default createNetwork;
