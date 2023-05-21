import { NetworkConfig } from "./types";
import { getBurnerWallet } from "@latticexyz/std-client";
import latestLatticeTestnetDeploy from "../../../contracts/deploys/4242/latest.json";
import latticeTestnet from "./supportedChains/latticeTestnet";

const getNetworkConfig = (): NetworkConfig => {
  const supportedChains = [latticeTestnet];
  const deploys = [latestLatticeTestnetDeploy];

  const chainId = Number(import.meta.env.VITE_CHAIN_ID);
  const chainIndex = supportedChains.findIndex((c) => c.id === chainId);
  const chain = supportedChains[chainIndex];
  if (!chain) {
    throw new Error(`Chain ${chainId} not found`);
  }

  const deploy = deploys[chainIndex];
  if (!deploy) {
    throw new Error(
      `No deployment found for chain ${chainId}. Did you run \`mud deploy\`?`
    );
  }

  const worldAddress = deploy.worldAddress;
  if (!worldAddress) {
    throw new Error("No world address provided");
  }

  return {
    clock: {
      period: 1000,
      initialTime: 0,
      syncInterval: 5000,
    },
    provider: {
      chainId,
      jsonRpcUrl: chain.rpcUrls.default.http[0],
      wsRpcUrl: chain.rpcUrls.default.webSocket?.[0],
    },
    privateKey: getBurnerWallet().value,
    chainId,
    modeUrl: chain.modeUrl,
    faucetServiceUrl: chain.faucetUrl,
    worldAddress,
    initialBlockNumber: deploy.blockNumber || 0,
    devMode: import.meta.env.VITE_DEV_MODE || false,
  };
};

export default getNetworkConfig;
