// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Script } from "../lib/forge-std/src/Script.sol";
import { Chatter } from "../src/Chatter.sol";

contract ChatterScript is Script {
    function run() public {
        Chatter chat = Chatter(0xd0F90CDF11516Ea23aEA3aCD602d94d262676846);
        vm.broadcast();
        chat.sendMessage("hello hello");
    }
}
