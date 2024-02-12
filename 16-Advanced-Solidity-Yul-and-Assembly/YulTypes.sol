// SPDX-License-Identifier: MIT

pragma solidity ^0.8.23;

contract YulTypes {
    function getNumber() external pure returns (uint256) {
        uint256 x;

        assembly {
            x := 42
        }

        return x;
    }

    function getHex() external pure returns (uint256) {
        uint256 x;

        assembly {
            x := 0xa
        }

        return x;
    }

    function demoString() external pure returns (string memory) {
        bytes32 myString = "";

        assembly {
            myString := "lorem ipsum dolor set amet..."
        }

        return string(abi.encode(myString));
    }

    function representation() external pure returns (address) {
        address x;

        assembly {
            x := 1
        }

        return x;
    }

}
