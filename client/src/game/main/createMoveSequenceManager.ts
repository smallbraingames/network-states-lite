import { Coord } from "@latticexyz/utils";
import { Direction } from "./types";
import { Game } from "../types";
import { Move } from "./types";
import { TransactionState } from "../../network/types";
import createTransactionSequenceManager from "../../network/createTransactionSequenceManager";

const createMoveSequenceManager = (game: Game) => {
  let currentTransactionId = 0;

  const transactions = new Map<number, Move>();

  const {
    network: { worldSend },
    main: {
      config: {
        network: { gasLimit, retryCount },
      },
    },
  } = game;

  const {
    add: addTransaction,
    clear,
    transactions$,
  } = createTransactionSequenceManager(worldSend);

  const isAdjacent = (coord1: Coord, coord2: Coord): boolean => {
    return Math.abs(coord1.x - coord2.x) + Math.abs(coord1.y - coord2.y) === 1;
  };

  const getDirection = (start: Coord, end: Coord): Direction => {
    if (start.x === end.x && start.y > end.y) {
      return Direction.UP;
    } else if (start.x === end.x && start.y < end.y) {
      return Direction.DOWN;
    } else if (start.y === end.y && start.x > end.x) {
      return Direction.RIGHT;
    } else if (start.y === end.y && start.x < end.x) {
      return Direction.LEFT;
    } else {
      throw new Error("End coord is not adjacent to start coord");
    }
  };

  const getCoordsMove = (start: Coord, end: Coord): Move => {
    if (!isAdjacent(start, end)) {
      throw new Error("End coord is not adjacent to start coord");
    }

    const direction = getDirection(start, end);
    return { coord: start, direction };
  };

  const add = (move: Move) => {
    currentTransactionId++;
    transactions.set(currentTransactionId, move);
    addTransaction(
      ["move", [move.coord, move.direction, { gasLimit }], { retryCount }],
      currentTransactionId.toString()
    );
  };

  transactions$.subscribe((tx) => {
    if (tx.state === TransactionState.ERROR) {
      clear();
    }
  });

  const getTransactionMove = (txId: string) => {
    console.log(txId);
    console.log(transactions);
    const move = transactions.get(parseInt(txId));
    if (!move) {
      throw Error("No move for transaction");
    }
    return move;
  };

  return { isAdjacent, getCoordsMove, add, transactions$, getTransactionMove };
};

export default createMoveSequenceManager;
