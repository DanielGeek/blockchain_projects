// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;

contract time{

    uint public actual_time = block.timestamp;
    uint public one_minute = 1 minutes;
    uint public two_hours = 2 hours;
    uint public fifty_days = 50 days;
    uint public one_week = 1 weeks;

    function MoreSeconds() public view returns(uint){
        return block.timestamp + 50 seconds;
    }

    function MoreHours() public view returns(uint){
        return block.timestamp + 1 hours;
    }

    function MoreDays() public view returns(uint){
        return block.timestamp + 3 days;
    }

    function MoreWeeks() public view returns(uint){
        return block.timestamp + 1 weeks;
    }
}