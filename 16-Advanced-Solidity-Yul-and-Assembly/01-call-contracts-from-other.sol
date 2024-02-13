// SPDX-License-Identifier: MIT

pragma solidity ^0.8.23;

// Interface for ContractB
interface IContractB {
    function calledFunction(string calldata _message) external returns (string memory);
}

// ContractA is the caller
contract ContractA {
    // This function will call ContractB's calledFunction
    function callContractBFunction(address _addressB, string memory _message) public returns (string memory) {
        // Interface is used to call the function from ContractB
        IContractB contractB = IContractB(_addressB);
        return contractB.calledFunction(_message);
    }
}

// ContractB has a function to be called from ContractA
contract ContractB {
    // Function that can be called by ContractA
    function calledFunction(string calldata _message) external pure returns (string memory) {
        return string(abi.encodePacked("Message received: ", _message));
    }
}
