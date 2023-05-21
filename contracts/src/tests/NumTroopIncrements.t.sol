// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {LibTile} from "libraries/LibTile.sol";

import "forge-std/Test.sol";
import {MudV2Test} from "@latticexyz/std-contracts/src/test/MudV2Test.t.sol";

contract SetupBoardTest is MudV2Test {
    function testNumTroopIncrements() public {
        vm.roll(49);
        uint32 troopIncrementsOne = LibTile.getNumTroopIncrements(0);
        assertEq(troopIncrementsOne, 0);

        vm.roll(50);
        uint32 troopIncrementsTwo = LibTile.getNumTroopIncrements(0);
        assertEq(troopIncrementsTwo, 1);

        vm.roll(50);
        uint32 troopIncrementsThree = LibTile.getNumTroopIncrements(1);
        assertEq(troopIncrementsThree, 1);

        vm.roll(100);
        uint32 troopIncrementsFour = LibTile.getNumTroopIncrements(1);
        assertEq(troopIncrementsFour, 2);

        vm.roll(100);
        uint32 troopIncrementsFive = LibTile.getNumTroopIncrements(49);
        assertEq(troopIncrementsFive, 2);

        vm.roll(149);
        uint32 troopIncrementsSix = LibTile.getNumTroopIncrements(49);
        assertEq(troopIncrementsSix, 2);
    }
}
