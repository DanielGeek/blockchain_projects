// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ERC20 {
    function transfer(address recipient, uint256 amount) external returns(bool);
    function balanceOf(address account) external view returns(uint256);
    function allowance(address owner, address spender) external view returns(uint256);
    function approve(address spender, uint256 amount) external returns(bool);
    function transferFrom(address spender, address recipient, uint256 amount) external returns(bool);
    function symbol() external view returns(string memory);
    function totalSupply() external view returns(uint256);
    function name() external view returns(string memory);
}

error OnlyOwner();
error InsufficientEtherProvidedForTheTokenPurchase();
error InsufficientTokenBalance();
error TokenTransferFailed();
error NoTokenToWithdraw();

contract TokenICO {
    address public owner;
    address public tokenAddress;
    uint256 public tokenSalePrice;
    uint256 public soldTokens;


    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert OnlyOwner();
        }
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function updateToken(address _tokenAddress) public onlyOwner {
        tokenAddress = _tokenAddress;
    }

    function updateTokenSalePrice(uint256 _tokenSalePrice) public onlyOwner {
        tokenSalePrice = _tokenSalePrice;
    }

    function multiply(uint256 x, uint256 y) internal pure returns(uint256 z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function buyToken(uint256 _tokenAmount) public payable {
        if (msg.value != multiply(_tokenAmount, tokenSalePrice)) {
            revert InsufficientEtherProvidedForTheTokenPurchase();
        }

        ERC20 token = ERC20(tokenAddress);
        if (_tokenAmount > token.balanceOf(address(this))) {
            revert InsufficientTokenBalance();
        }

        if (!token.transfer(msg.sender, _tokenAmount * 1e18)) {
            revert TokenTransferFailed();
        }

        payable(owner).transfer(msg.value);

        soldTokens += _tokenAmount;
    }

    function getTokenDetails() public view returns(
        string memory name,
        string memory symbol,
        uint256 balance,
        uint256 supply,
        uint256 tokenPrice,
        address tokenAddr
    ) {
        ERC20 token = ERC20(tokenAddress);

        return (
            token.name(),
            token.symbol(),
            token.balanceOf(address(this)),
            token.totalSupply(),
            tokenSalePrice,
            tokenAddress
        );
    }

    function withdrawAllTokens() public onlyOwner {
        ERC20 token = ERC20(tokenAddress);

        uint256 balance = token.balanceOf(address(this));

        if (balance == 0) {
            revert NoTokenToWithdraw();
        }

        if (!token.transfer(owner, balance)) {
            revert TokenTransferFailed();
        }
    }
}
