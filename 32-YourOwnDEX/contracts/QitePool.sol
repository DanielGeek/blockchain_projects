// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "./QiteLiquidityToken.sol";
import "@openzeppelin/contracts/token/IERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract QitePool {
    using SafeMath for uint;
    using Math for uint;

    address public token1;
    address public token2;

    uint256 public reserve1;
    uint256 public reserve2;

    // x * y = k
    uint256 public constantK;

    QiteLiquidityToken public liquidityToken;

    constructor(address _token1, address _token2, string memory _liquidityTokenName, string memory _liquidityTokenSymbol) {
        token1 = _token1;
        token2 = _token2;
        liquidityToken = new QiteLiquidityToken(_liquidityTokenName, _liquidityTokenSymbol);
    }

    function addLiquidity(uint amountToken1, uint amountToken2) external {
        // Create and send some liquidity token to the liquidity provider
        uint256 liquidity;
        uint256 totalSupplyOfToken = liquidityToken.totalSupply();
        if(totalSupplyOfToken == 0) {
            // amount of liquidity at initialization
            liquidity = amountToken1.mul(amountToken2).sqrt();
        } else {
            // amountToken1 * totalSupplyLiquidityToken / Reserve1, amountToken2 * totalSupplyLiquidityToken / Reserve2
            liquidity = amountToken1.mul(totalSupplyOfToken).div(reserve1).min(amountToken2.mul(totalSupplyOfToken).div(reserve2));
        }
        liquidityToken.mint(msg.sender, liquidity);
        // Transfer amountToken1 and amountToken2 inside this liquidity Pool
        require(IERC20(token1).transferFrom(msg.sender, address(this), amountToken1), "Transfer of token1 is failed");
        require(IERC20(token2).transferFrom(msg.sender, address(this), amountToken2), "Transfer of token2 is failed");
        // Update reserve1 and the reserve2
        reserve1 += amountToken1;
        reserve2 += amountToken2;
        // Update the constrant formula
        constantK = reserve1.mul(reserve2);
        require(constantK > 0, "Constant formula not update");
    }

}
