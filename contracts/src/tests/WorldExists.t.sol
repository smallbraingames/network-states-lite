// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {IWorld} from "codegen/world/IWorld.sol";

import "forge-std/Test.sol";
import {MudV2Test} from "@latticexyz/std-contracts/src/test/MudV2Test.t.sol";

contract SetupBoardTest is MudV2Test {
    IWorld private world;

    function setUp() public override {
        super.setUp();
        world = IWorld(worldAddress);
    }

    function testWorldExists() public {
        uint256 codeSize;
        address addr = worldAddress;
        assembly {
            codeSize := extcodesize(addr)
        }
        assertTrue(codeSize > 0);
    }
}
