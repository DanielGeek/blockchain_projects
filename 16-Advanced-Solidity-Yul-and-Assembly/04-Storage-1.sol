// SPDX-License-Identifier: MIT

pragma solidity ^0.8.23;

contract StorageBasics {
    uint256 x = 2;
    uint256 y = 13;
    uint256 z = 54;
    uint256 p;
    uint128 a = 1;
    uint128 b = 2;

    function getSlot() external pure returns (uint256 slot) {
        assembly {
            slot := b.slot
        }
    }

    function getP() external view returns (uint256) {
        return p; // p.slot
    }

    function getVarYul(uint256 slot) external view returns (bytes32 ret) {
        assembly {
            ret := sload(slot)
        }
    }

    function setVarYul(uint256 slot, uint256 value) external {
        assembly {
            sstore(slot, value)
        }
    }

    function setX(uint256 newVal) external {
        x = newVal;
    }

    function getX() external view returns (uint256) {
        return x;
    }
}
