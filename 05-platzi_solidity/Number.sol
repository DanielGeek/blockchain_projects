// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Number {

  function getNumber() private returns (int number) {
    number = 1984;
  }

  function changeNumber() public returns (int number) {
    number = getNumber() * -1;
  }

}