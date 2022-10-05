// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Lottery {
    uint public minFee;
    address public owner;
    address[] public players;
    mapping (address => uint) public playerBalances;

    constructor(uint _minFee) {
        minFee = _minFee;
        owner = msg.sender;
    }

    function play() public payable minFeePay {
        players.push(msg.sender);
        playerBalances[msg.sender] += msg.value;
    }

    function getBalance() public view returns(uint) {
        return address(this).balance;
    }

    function getRandomNumber() public view returns(uint) {
        return uint(keccak256(abi.encodePacked(owner, block.timestamp)));
    }

    function pickWinner() public onlyOwner {
        uint index = getRandomNumber() % players.length;
        (bool sucess, ) = players[index].call{value:getBalance()}("");
        require(sucess, "payment failed, please try again");
        players = new address[](0);
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier minFeePay() {
        require(msg.value >= minFee, "Please pay more");
        _;
    }
}