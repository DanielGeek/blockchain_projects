// SPDX-License-Identifier: MIT

pragma solidity ^0.8.23;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// Example 1
contract MyContract {
    uint256 public balance;
    address public owner;
    bool private locked;

    constructor() {
        owner = msg.sender;
        locked = false;
    }

    modifier noReentrancy() {
        require(!locked, "No reentrancy");
        locked = true;
        _;
        locked = false;
    }

    function withdraw(uint256 _amount) public noReentrancy {
        require(msg.sender == owner, "Only the owner can withdraw");
        require(_amount <= balance, "Insufficient balance");

        balance -= _amount; // Effects: Update state variables before external calls

        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Transfer failed"); // Interactions: External call after state update
    }

    // Function to deposit Ether into the contract
    receive() external payable {
        balance += msg.value;
    }
}

// Example 2
contract MyContract2 is ReentrancyGuard {
    uint256 public balance;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    // Function to deposit Ether into the contract
    receive() external payable {
        balance += msg.value;
    }

    function withdraw(uint256 _amount) public nonReentrant {
        require(msg.sender == owner, "Only the owner can withdraw");
        require(_amount <= balance, "Insufficient balance");

        balance -= _amount; // Update state variables before making external calls

        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Transfer failed"); // External call
    }
}
