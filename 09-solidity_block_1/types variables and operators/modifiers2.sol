// SPDX-License-Identifier: MIT
pragma solidity >=0.4.4 <0.7.0;
pragma experimental ABIEncoderV2;

contract view_pure_payable{

  string[] student_list;

  function new_students(string memory _student) public{
    student_list.push(_student);
  }

  function show_student(uint _position) public view returns(string memory){
    return student_list[_position];
  }

  uint x=10;
  function addAx(uint _a) public view returns(uint){
    return x+_a;
  }

  function exponentiation(uint _a, uint _b) public pure returns(uint){
    return _a**_b;
  }

  mapping(address=>myWalletStruct) walletMoney;

  struct myWalletStruct{
    string person_name;
    address person_direction;
    uint person_money;
  }

  function Pay(string memory _personName, uint _amount) public payable{
    myWalletStruct memory my_wallet;
    my_wallet = myWalletStruct(_personName, msg.sender, _amount);
    walletMoney[msg.sender] = my_wallet;
  }

}