// SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

contract Encoding {
  function combineStrings() public pure returns (string memory) {
    return string(abi.encodePacked("Hi Mon! ", "Miss you!"));
  }

  function encodeNumber() public pure returns(bytes memory) {
    bytes memory number = abi.encode(1);
    return number;
  }

  function encodeString() public pure returns(bytes memory) {
    bytes memory someString = abi.encode("Some string");
    return someString;
  }

  function encodeStringPacked() public pure returns(bytes memory) {
    bytes memory someString = abi.encodePacked("Some string");
    return someString;
  }

    function encodeStringPacked() public pure returns(bytes memory) {
        bytes memory someString = abi.encodePacked("Some string");
        return someString;
    }
}
