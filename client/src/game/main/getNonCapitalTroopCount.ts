const getBlocksPerTroopIncrease = (): number => {
  return parseInt(import.meta.env.VITE_BLOCKS_PER_TROOP_INCREASE);
};

const getNonCapitalTroopCount = (
  lastUpdateTroopCount: number,
  lastUpdateBlockNumber: number,
  currentBlockNumber: number
) => {
  const blocksPerTroopIncrease = getBlocksPerTroopIncrease();
  let troopIncrement = 0;
  for (let i = lastUpdateBlockNumber + 1; i <= currentBlockNumber; i++) {
    if (i % blocksPerTroopIncrease === 0) {
      troopIncrement++;
    }
  }
  return lastUpdateTroopCount + troopIncrement;
};

export default getNonCapitalTroopCount;
