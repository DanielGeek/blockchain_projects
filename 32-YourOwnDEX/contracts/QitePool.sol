// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "./QiteLiquidityToken.sol";

contract QitePool {
    address public token1;
    address public token2;

    uint256 public reserve1;
    uint256 public reserve2;

    // x * y = k
    uint256 public constantK;

    QiteLiquidityToken public liquidityToken;

}
