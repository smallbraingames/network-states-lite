// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {StateOwnerTable, StateOwnerTableTableId, FoundedTable, HomeStateTable} from "codegen/Tables.sol";

import {Coord} from "common/Coord.sol";
import {LibTile} from "libraries/LibTile.sol";

import {getKeysWithValue} from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";
import {getUniqueEntity} from "@latticexyz/world/src/modules/uniqueentity/getUniqueEntity.sol";

library LibSpawn {
    function getUniqueStateId() internal returns (uint256) {
        return uint256(getUniqueEntity());
    }

    function spawnPlayerAtCoordUnchecked(
        uint256 stateId,
        address player,
        Coord memory coord
    ) internal {
        StateOwnerTable.set(stateId, player);
        LibTile.setTileState(coord, stateId);
        LibTile.setTroopCount(coord, 1);
        LibTile.setTileIsCapital(coord, true);
        LibTile.setTileLastUpdate(coord);
        FoundedTable.set(stateId, block.number);
        HomeStateTable.set(player, stateId);
    }

    function isPlayerAlive(address player) internal view returns (bool) {
        bytes32[] memory playerTiles = getKeysWithValue(
            StateOwnerTableTableId,
            StateOwnerTable.encode(player)
        );
        return playerTiles.length > 0;
    }

    function getSpawnCoord() internal view returns (Coord memory) {
        Coord memory max = Coord({x: 6, y: 6});
        Coord memory min = Coord({x: -6, y: -6});

        Coord memory spawnCoord;
        bool isTileEmpty = false;
        uint32 seed = 0;
        while (!isTileEmpty) {
            spawnCoord = getPsuedoRandomCoordInRange(min, max, seed);
            isTileEmpty = LibTile.isTileEmpty(spawnCoord);
            seed++;
        }
        return spawnCoord;
    }

    function getPsuedoRandomCoordInRange(
        Coord memory start,
        Coord memory end,
        uint32 seed
    ) private view returns (Coord memory) {
        int32 x = getPseudoRandomNumberInRange(start.x, end.x, seed);
        int32 y = getPseudoRandomNumberInRange(start.y, end.y, seed + 1);
        return Coord({x: x, y: y});
    }

    function getPseudoRandomNumberInRange(
        int32 start,
        int32 end,
        uint32 seed
    ) private view returns (int32) {
        require(end > start, "Invalid range");
        int32 range = end - start + 1;
        int32 positiveRandom = absoluteValue(
            int32(
                uint32(
                    uint(
                        keccak256(
                            abi.encodePacked(
                                block.number,
                                seed,
                                block.prevrandao
                            )
                        )
                    )
                )
            )
        );
        int32 positiveRandomInRange = positiveRandom % range;
        return start + positiveRandomInRange;
    }

    function absoluteValue(int32 x) internal pure returns (int32) {
        return x >= 0 ? x : -x;
    }
}
