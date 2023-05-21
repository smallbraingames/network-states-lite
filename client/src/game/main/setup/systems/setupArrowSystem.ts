import { ArrowManager, MoveSequenceManager } from "../../types";

import { TransactionState } from "../../../../network/types";

const setupArrowSystem = async (
  moveSequenceManager: MoveSequenceManager,
  arrowManager: ArrowManager
) => {
  const { transactions$, getTransactionMove } = moveSequenceManager;
  const { addArrow, removeArrow } = arrowManager;

  transactions$.subscribe((tx) => {
    const move = getTransactionMove(tx.id);
    if (
      tx.state === TransactionState.SENDING ||
      tx.state == TransactionState.QUEUED
    ) {
      addArrow(move);
    } else if (tx.state === TransactionState.ERROR) {
      removeArrow(move);
    } else {
      removeArrow(move);
    }
  });
};

export default setupArrowSystem;
