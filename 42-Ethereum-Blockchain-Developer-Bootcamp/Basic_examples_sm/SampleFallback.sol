//SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

contract SampleFallback {
    
    uint public lastValueSent;
    string public lastFunctionCalled;

    uint public myUint;

    // "setMyUint(uint256)"
    // 0xe492fd840000000000000000000000000000000000000000000000000000000000000001
    // 0xe492fd842fb25dc4b3c624c80776108b452a545c682a78e4252b5560c6537b79

    function setMyUint(uint _myNewUint) public {
        myUint = _myNewUint;
    }

    receive() external payable {
        lastValueSent = msg.value;
        lastFunctionCalled = "receive";
    }

    fallback() external payable {
        lastValueSent = msg.value;
        lastFunctionCalled = "fallback";
    }

    
}
