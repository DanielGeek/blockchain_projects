// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Enums_examples {
    enum state_enum {ON, OFF}

    state_enum state;

    function start() public {
        state = state_enum.ON;
    }

    function fixedState(uint _k) public {
        state = state_enum(_k);
    }

    function State() public view returns(state_enum) {
        return state;
    }

    enum addresses {TOP, DOWN, RIGH, LEFT}

    addresses address_one = addresses.TOP;

    function TOP() public{
        address_one = addresses.TOP;
    }

    function DOWN() public {
        address_one = addresses.DOWN;
    }

    function RIGH() public {
        address_one = addresses.RIGH;
    }

    function LEFT() public {
        address_one = addresses.LEFT;
    }

    function fixedAddresses(uint _k) public {
        address_one = addresses(_k);
    }

    function Addresses() public view returns(addresses){
        return address_one;
    }
}