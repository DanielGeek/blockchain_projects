// Solidity version
pragma solidity ^0.8.7;
pragma experimental ABIEncoderV2;

contract hash{

    function calculateHash(string memory _cadena) public pure returns(bytes32){
        return keccak256(abi.encodePacked(_cadena));
    }

    function calculateHash2(string memory _cadena, uint _k, address _address) public pure returns(bytes32){
        return keccak256(abi.encodePacked(_cadena, _k, _address));
    }

    function calculateHash3(string memory _cadena, uint _k, address _address) public pure returns(bytes32){
        return keccak256(abi.encodePacked(_cadena, _k, _address, "hello", uint(2)));
    }
}