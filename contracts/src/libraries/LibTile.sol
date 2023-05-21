// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {Terrain} from "codegen/Types.sol";
import {TroopCountTable, IsCapitalTable, LastUpdateTable, StateTable, StateOwnerTable} from "codegen/Tables.sol";

import {Coord} from "common/Coord.sol";

import {LibTerrain} from "libraries/LibTerrain.sol";

library LibTile {
    function updateTile(Coord memory coord) internal {
        uint32 tileTroopCount = getTroopCount(coord);
        bool isCapital = IsCapitalTable.get(coord.x, coord.y);
        if (tileTroopCount == 0 && !isCapital) {
            return;
        }
        uint256 lastUpdate = LastUpdateTable.get(coord.x, coord.y);
        uint32 increment = 0;
        if (isCapital) {
            increment += uint32(block.number - lastUpdate);
        }

        increment += getNumTroopIncrements(lastUpdate);

        incrementTroopCount(coord, increment);
    }

    function getEmptyStateId() internal pure returns (uint256) {
        return 0;
    }

    function getNumTroopIncrements(
        uint256 lastUpdateBlockNumber
    ) internal view returns (uint32) {
        require(
            block.number > lastUpdateBlockNumber,
            "Already updated this block"
        );
        (bool exists, uint256 numBlocks) = getFirstTroopIncrementInRange(
            lastUpdateBlockNumber + 1,
            min(lastUpdateBlockNumber + 50, block.number)
        );
        if (!exists) {
            return 0;
        }
        uint32 increment = 1;
        uint256 diff = block.number - lastUpdateBlockNumber - numBlocks;
        increment += uint32(diff / 50);
        return increment;
    }

    function getFirstTroopIncrementInRange(
        uint256 startBlock,
        uint256 endBlock
    ) private pure returns (bool, uint256) {
        bool exists = false;
        uint256 numBlocks = 0;
        for (uint256 i = startBlock; i <= endBlock; i++) {
            numBlocks++;
            if (i % 50 == 0) {
                exists = true;
                break;
            }
        }
        return (exists, numBlocks);
    }

    function min(uint256 a, uint256 b) private pure returns (uint) {
        if (a < b) {
            return a;
        }
        return b;
    }

    function isTileEmpty(Coord memory coord) internal view returns (bool) {
        uint32 tileTroopCount = getTroopCount(coord);
        if (tileTroopCount > 0) {
            return false;
        }
        bool isCapital = getTileIsCapital(coord);
        if (isCapital) {
            return false;
        }
        Terrain terrain = LibTerrain.getTerrainAtPosition(coord);
        if (terrain == Terrain.MOUNTAIN || terrain == Terrain.WATER) {
            return false;
        }
        return true;
    }

    function setTileLastUpdate(Coord memory coord) internal {
        LastUpdateTable.set(coord.x, coord.y, block.number);
    }

    function getTileLastUpdate(
        Coord memory coord
    ) internal view returns (uint256) {
        return LastUpdateTable.get(coord.x, coord.y);
    }

    function setTileIsCapital(Coord memory coord, bool isCapital) internal {
        IsCapitalTable.set(coord.x, coord.y, isCapital);
    }

    function getTileIsCapital(Coord memory coord) internal view returns (bool) {
        return IsCapitalTable.get(coord.x, coord.y);
    }

    function setTileState(Coord memory coord, uint256 stateId) internal {
        StateTable.set(coord.x, coord.y, stateId);
    }

    function getTileState(Coord memory coord) internal view returns (uint256) {
        return StateTable.get(coord.x, coord.y);
    }

    function setTroopCount(Coord memory coord, uint32 troopCount) internal {
        TroopCountTable.set(coord.x, coord.y, troopCount);
    }

    function getTroopCount(Coord memory coord) internal view returns (uint32) {
        return TroopCountTable.get(coord.x, coord.y);
    }

    function incrementTroopCount(
        Coord memory coord,
        uint32 increment
    ) internal {
        uint32 tileTroopCount = getTroopCount(coord);
        setTroopCount(coord, tileTroopCount + increment);
    }

    function decrementTroopCount(
        Coord memory coord,
        uint32 decrement
    ) internal {
        uint32 tileTroopCount = getTroopCount(coord);
        setTroopCount(coord, tileTroopCount - decrement);
    }
}
