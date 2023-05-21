// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {StateOwnerTable} from "codegen/Tables.sol";
import {Direction, Terrain} from "codegen/Types.sol";

import {Coord} from "common/Coord.sol";
import {LibTile} from "libraries/LibTile.sol";

import {LibTerrain} from "libraries/LibTerrain.sol";

library LibMove {
    function updateRelevantTiles(
        Coord memory start,
        Coord memory move
    ) internal {
        LibTile.updateTile(start);
        LibTile.updateTile(move);
    }

    function canMoveTroops(
        Coord memory start,
        Coord memory move
    ) internal view returns (bool) {
        uint32 troops = LibTile.getTroopCount(start);
        if (troops <= 1) {
            return false;
        }
        Terrain terrain = LibTerrain.getTerrainAtPosition(move);
        if (terrain == Terrain.MOUNTAIN || terrain == Terrain.WATER) {
            return false;
        }
        return true;
    }

    function moveTroops(Coord memory start, Coord memory move) internal {
        uint32 startTileTroopCount = LibTile.getTroopCount(start);
        uint256 attacker = LibTile.getTileState(start);
        uint32 attackingTroops = startTileTroopCount - 1;
        uint256 defender = LibTile.getTileState(move);
        uint32 defendingTroops = LibTile.getTroopCount(move);

        LibTile.decrementTroopCount(start, attackingTroops);

        if (attacker == defender) {
            LibTile.incrementTroopCount(move, attackingTroops);
        } else if (attackingTroops > defendingTroops) {
            LibTile.setTroopCount(move, attackingTroops - defendingTroops);
            LibTile.setTileState(move, attacker);
            bool isCapital = LibTile.getTileIsCapital(move);
            if (isCapital) {
                address attackingStateOwner = StateOwnerTable.get(attacker);
                StateOwnerTable.set(defender, attackingStateOwner);
            }
        } else if (attackingTroops < defendingTroops) {
            LibTile.setTroopCount(move, defendingTroops - attackingTroops);
        } else if (attackingTroops == defendingTroops) {
            LibTile.setTroopCount(move, 0);
            LibTile.setTileState(move, LibTile.getEmptyStateId());
        }
    }

    function getMoveCoord(
        Coord memory start,
        Direction direction
    ) internal pure returns (Coord memory) {
        if (direction == Direction.UP) {
            return Coord({x: start.x, y: start.y - 1});
        }
        if (direction == Direction.DOWN) {
            return Coord({x: start.x, y: start.y + 1});
        }
        if (direction == Direction.LEFT) {
            return Coord({x: start.x + 1, y: start.y});
        }
        if (direction == Direction.RIGHT) {
            return Coord({x: start.x - 1, y: start.y});
        }
    }
}
