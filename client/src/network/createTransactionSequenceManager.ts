import {
  BoundFastTxExecuteFn,
  TransactionSequenceManagerState,
  TransactionState,
} from "./types";

import { Contract } from "ethers";
import { IWorld } from "../../../contracts/types/ethers-contracts/IWorld";
import { Subject } from "rxjs";

type TransactionArgs<IWorld extends Contract, F extends keyof IWorld> = [
  func: F,
  args: Parameters<IWorld[F]>,
  options: { retryCount?: number }
];

const createTransactionSequenceManager = <F extends keyof IWorld>(
  worldSend: BoundFastTxExecuteFn<IWorld>
) => {
  const queue: { args: TransactionArgs<IWorld, F>; id: string }[] = [];

  const transactions$ = new Subject<{ id: string; state: TransactionState }>();
  let sequenceManagerState = TransactionSequenceManagerState.PAUSED;

  const add = (args: TransactionArgs<IWorld, F>, id: string) => {
    queue.push({ args, id });
    transactions$.next({ id, state: TransactionState.QUEUED });
    if (sequenceManagerState === TransactionSequenceManagerState.PAUSED) {
      send();
    }
  };

  const send = async () => {
    if (sequenceManagerState === TransactionSequenceManagerState.SENDING) {
      console.warn("Already sending transactions");
      return;
    }
    sequenceManagerState = TransactionSequenceManagerState.SENDING;
    while (queue.length > 0) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (sequenceManagerState === TransactionSequenceManagerState.ERROR) {
        console.error("Sequence manager in error state, aborting");
        break;
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { args, id } = queue.shift()!;
      transactions$.next({ id, state: TransactionState.SENDING });
      const tx = await worldSend(...args);
      await tx
        .wait()
        .then(() => {
          transactions$.next({ id, state: TransactionState.COMPLETED });
        })
        .catch((e: any) => {
          handleError(e, id);
        });
    }
    sequenceManagerState = TransactionSequenceManagerState.PAUSED;
  };

  const handleError = (_: any, id: string) => {
    console.log("Transaction errored");
    sequenceManagerState = TransactionSequenceManagerState.ERROR;
    transactions$.next({ id, state: TransactionState.ERROR });
  };

  const clear = () => {
    while (queue.length > 0) {
      queue.pop();
    }
  };

  const getQueue = () => {
    return queue;
  };

  return {
    add,
    send,
    clear,
    getQueue,
    transactions$,
  };
};

export default createTransactionSequenceManager;
