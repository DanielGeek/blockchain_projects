pragma solidity ^0.8.7;
pragma experimental ABIEncoderV2;

contract mas_variables{

    string my_first_string;
    string public sayHello = "Hello";
    string public empty_string = "";

    bool my_first_boolean;
    bool public  flag_true =true;
    bool public flag_false = false;

    bytes32 my_first_bytes;
    bytes4 second_byte;
    string public name = "Daniel";
    bytes32 public hash = keccak256(abi.encodePacked(name));
    bytes4 public identifier;

    function exampleBytes4() public{
        identifier = msg.sig;
    }

    address my_first_address;
    address public local_address_1 = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
    address public local_address_2 = 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2;

}