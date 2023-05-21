import { Contract } from "ethers";
import { SetupContractConfig } from "@latticexyz/std-client";
import createNetwork from "./createNetwork";

export type Network = Awaited<ReturnType<typeof createNetwork>>;

export type NetworkConfig = SetupContractConfig & {
  privateKey: string;
  faucetServiceUrl?: string;
};

export type BoundFastTxExecuteFn<C extends Contract> = <F extends keyof C>(
  func: F,
  args: Parameters<C[F]>,
  options?: {
    retryCount?: number;
  }
) => Promise<ReturnType<C[F]>>;

export enum TransactionSequenceManagerState {
  SENDING,
  PAUSED,
  ERROR,
}

export enum TransactionState {
  QUEUED,
  SENDING,
  COMPLETED,
  ERROR,
}
