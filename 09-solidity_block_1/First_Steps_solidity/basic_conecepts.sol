// 21. Smart Contract version
// pragma solidity >=0.4.0 < 0.8.11;
pragma solidity ^0.8.7;
import "./ERC20.sol";

contract FirstContract {

    address owner;
    ERC20Basic token;

    constructor() public{
        owner = msg.sender;
        token = new ERC20Basic(1000);
    }
}
