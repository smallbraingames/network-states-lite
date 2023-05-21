// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {IWorld} from "codegen/world/IWorld.sol";
import {Direction} from "codegen/Types.sol";

import {Coord} from "common/Coord.sol";

import "forge-std/Test.sol";
import {MudV2Test} from "@latticexyz/std-contracts/src/test/MudV2Test.t.sol";

contract SetupBoardTest is MudV2Test {
    IWorld private world;

    function setUp() public override {
        super.setUp();
        world = IWorld(worldAddress);
    }

    function testLargeMove() public {
        Coord memory spawnCoord = world.spawn();
        // Move in all directions
        for (uint i = 0; i <= 3; i++) {
            vm.roll(block.number + 1);
            Direction direction = Direction(i);
            world.move(spawnCoord, direction);
        }
        vm.roll(block.number + 1e6);
        for (uint i = 0; i <= 3; i++) {
            vm.roll(block.number + 1);
            Direction direction = Direction(i);
            world.move(spawnCoord, direction);
        }
    }
}
