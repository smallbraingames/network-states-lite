// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {StateOwnerTable} from "codegen/Tables.sol";
import {Direction} from "codegen/Types.sol";

import {Coord} from "common/Coord.sol";
import {LibMove} from "libraries/LibMove.sol";
import {LibTile} from "libraries/LibMove.sol";

import {System} from "@latticexyz/world/src/System.sol";

contract MoveSystem is System {
    function move(Coord memory start, Direction direction) public {
        Coord memory moveCoord = LibMove.getMoveCoord(start, direction);
        require(
            _msgSender() == StateOwnerTable.get(LibTile.getTileState(start)),
            "Invalid tile owner"
        );
        LibMove.updateRelevantTiles(start, moveCoord);
        LibTile.setTileLastUpdate(start);
        LibTile.setTileLastUpdate(moveCoord);
        require(LibMove.canMoveTroops(start, moveCoord), "Invalid move");
        LibMove.moveTroops(start, moveCoord);
    }
}
