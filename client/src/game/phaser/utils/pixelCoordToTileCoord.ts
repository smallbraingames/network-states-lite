import { Coord } from "@latticexyz/utils";

export const pixelCoordToTileCoord = (
  pixelCoord: Coord,
  tileWidth: number,
  tileHeight: number
): Coord => {
  return {
    x: Math.floor(pixelCoord.x / tileWidth),
    y: Math.floor(pixelCoord.y / tileHeight),
  };
};
