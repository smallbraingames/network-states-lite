import { MainConfig } from "../types";

const MONTHS_PER_YEAR = 12;

const getTimeSince = (
  foundedBlockNumber: number,
  currentBlockNumber: number,
  config: MainConfig
): { months: number; years: number } => {
  const {
    time: { blocksPerMonth },
  } = config;

  const diff = currentBlockNumber - foundedBlockNumber;
  const months = Math.floor(diff / blocksPerMonth);
  const years = Math.floor(months / MONTHS_PER_YEAR);
  const remainingMonths = months - years * MONTHS_PER_YEAR;
  return { months: remainingMonths, years };
};

export default getTimeSince;
