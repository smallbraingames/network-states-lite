import getNonCapitalTroopCount from "./getNonCapitalTroopCount";

const getCapitalTroopCount = (
  lastUpdateTroopCount: number,
  lastUpdateBlockNumber: number,
  currentBlockNumber: number
) => {
  if (lastUpdateTroopCount === 0) {
    return 0;
  }
  const blockDiff = currentBlockNumber - lastUpdateBlockNumber;
  if (blockDiff < 0) {
    throw Error("Current block number before last updated block number");
  }
  return (
    lastUpdateTroopCount +
    blockDiff +
    getNonCapitalTroopCount(
      lastUpdateTroopCount,
      lastUpdateBlockNumber,
      currentBlockNumber
    )
  );
};

export default getCapitalTroopCount;
