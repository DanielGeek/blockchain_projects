// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract PetAdoption {
    address public owner;
    uint public petIndex = 0;

    constructor(uint initialPetIndex) {
        owner = msg.sender;
        petIndex = initialPetIndex;
    }

    function addPet() public {
        require(msg.sender == owner, "Only a contract owner can add a new pet!");
        petIndex++;
    }

    function getOwner() public view returns(address) {
        return owner;
    }
}
