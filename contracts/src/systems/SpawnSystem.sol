// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {Coord} from "common/Coord.sol";
import {LibSpawn} from "libraries/LibSpawn.sol";

import {System} from "@latticexyz/world/src/System.sol";

contract SpawnSystem is System {
    function spawn() public returns (Coord memory) {
        require(!LibSpawn.isPlayerAlive(_msgSender()), "Player exists");
        Coord memory spawnCoord = LibSpawn.getSpawnCoord();
        uint256 stateId = LibSpawn.getUniqueStateId();
        LibSpawn.spawnPlayerAtCoordUnchecked(stateId, _msgSender(), spawnCoord);
        return spawnCoord;
    }
}
