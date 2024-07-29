// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {MyContract} from "../src/MyContract.sol";

contract CounterScript is Script {
    MyContract public myContract;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        myContract = new MyContract();

        vm.stopBroadcast();
    }
}
