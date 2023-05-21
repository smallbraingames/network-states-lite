import { Coord } from "@latticexyz/utils";
import { EntityID } from "@latticexyz/recs";

const encodeNumber = (num: number): string => {
  const hexString = (num >= 0 ? num : 0xffffffff + num + 1)
    .toString(16)
    .padStart(8, "0");
  return hexString;
};

const getCoordEntity = (coord: Coord): EntityID => {
  const x = `0x${encodeNumber(coord.x).padStart(64, "0")}`;
  const y = `0x${encodeNumber(coord.y).padStart(64, "0")}`;
  return `${x}:${y}` as EntityID;
};

export default getCoordEntity;
