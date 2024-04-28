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

    constructor(address _token1, address _token2) {
        token1 = _token1;
        token2 = _token2;
        liquidityToken = new QiteLiquidityToken();
    }

}
