import { Coord } from "@latticexyz/utils";
import { EntityID } from "@latticexyz/recs";

const parseHex = (hexString: string): number => {
  hexString = hexString.slice(2);
  const bigInt = BigInt("0x" + hexString);
  const isNegative = (bigInt & BigInt(0x80000000)) !== BigInt(0);
  if (isNegative) {
    const complement = (~bigInt + BigInt(1)) & BigInt(0xffffffff);
    return Number(complement) * -1;
  }
  const number = Number(bigInt);
  return number;
};

const getEntityCoord = (entity: EntityID): Coord => {
  const [x, y] = entity.split(":");
  return { x: parseHex(x), y: parseHex(y) };
};

export default getEntityCoord;
