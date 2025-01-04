// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.27;

import {Token} from "./Token.sol";

error FeeIncorrect();
error NotEnoughEther();
error BuyingClosed();
error AmountTooLow();
error AmountExceeded();

contract Factory {
    uint256 public constant TARGET = 3 ether;
    uint256 public constant TOKEN_LIMIT = 500_000 ether;

    uint256 public immutable fee;
    address public owner;

    uint256 public totalTokens;
    address[] public tokens;
    mapping(address => TokenSale) public tokenToSale;

    struct TokenSale {
        address token;
        string name;
        address creator;
        uint256 sold;
        uint256 raised;
        bool isOpen;
    }

    event Created(address indexed token);
    event Buy(address indexed token, uint256 amount);

    constructor(uint256 _fee) {
        fee = _fee;
        owner = msg.sender;
    }

    function getTokenSale(uint256 _index) public view returns (TokenSale memory) {
        return tokenToSale[tokens[_index]];
    }

    function getCost(uint256 _sold) public pure returns (uint256) {
        uint256 floor = 0.0001 ether;
        uint256 step = 0.0001 ether;
        uint256 increment = 10000 ether;

        uint256 cost = (step * (_sold / increment)) + floor;
        return cost;
    }

    function create(
        string memory _name,
        string memory _symbol
    ) external payable{
        // Make sure that the fee is correct
        if (msg.value < fee) {
            revert FeeIncorrect();
        }

        // Create a new token
        Token token = new Token(msg.sender, _name, _symbol, 1_000_000 ether);

        // Save the token for later use
        tokens.push(address(token));

        totalTokens++;

        // List the token for sale
        TokenSale memory sale = TokenSale(
            address(token),
            _name,
            msg.sender,
            0,
            0,
            true
        );

        tokenToSale[address(token)] = sale;

        // Tell people it's live
        emit Created(address(token));
    }

    function buy(address _token, uint256 _amount) external payable {
        TokenSale storage sale = tokenToSale[_token];
        // Check conditions
        if (!sale.isOpen) {
            revert BuyingClosed();
        }

        if (_amount < 1 ether) {
            revert AmountTooLow();
        }

        if (_amount > 10000 ether) {
            revert AmountExceeded();
        }

        // Calculate the price of 1 token based upon the total bought.
        uint256 cost = getCost(sale.sold);

        uint256 price = cost * (_amount / 10 ** 18);

        // Make sure enough ether is sent
        if (msg.value < price) {
            revert NotEnoughEther();
        }

        // Update the sale
        sale.sold += _amount;
        sale.raised += price;

        // Make sure fund raising goal isn't met
        if(sale.sold >= TOKEN_LIMIT || sale.raised >= TARGET) {
            sale.isOpen = false;
        }

        Token(_token).transfer(msg.sender, _amount);

        // Emit an event
        emit Buy(_token, _amount);
    }
}
