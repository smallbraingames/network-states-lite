// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {Terrain} from "codegen/Types.sol";

import {PERLIN_DENOM, PERLIN_PRECISION, PERLIN_DIGITS, PERLIN_THRESHOLD_MOUNTAIN, PERLIN_THRESHOLD_WATER} from "common/Config.sol";
import {Coord} from "common/Coord.sol";
import {LibPerlin} from "libraries/LibPerlin.sol";

import {ABDKMath64x64 as Math} from "abdk-libraries-solidity/ABDKMath64x64.sol";

library LibTerrain {
    function getTerrainAtPosition(
        Coord memory position
    ) internal pure returns (Terrain) {
        int256 perlin = getPerlinAtPosition(position);
        if (perlin >= PERLIN_THRESHOLD_MOUNTAIN) {
            return Terrain.MOUNTAIN;
        } else if (perlin <= PERLIN_THRESHOLD_WATER) {
            return Terrain.WATER;
        } else {
            return Terrain.BARE;
        }
    }

    function getPerlinAtPosition(
        Coord memory position
    ) private pure returns (int256) {
        return
            Math.muli(
                LibPerlin.noise2d(
                    position.x,
                    position.y,
                    PERLIN_DENOM,
                    PERLIN_PRECISION
                ),
                int256(10) ** PERLIN_DIGITS
            );
    }
}
