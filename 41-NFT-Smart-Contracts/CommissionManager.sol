// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

abstract contract CommissionManager {

    // This is the owner contract address, which receives commissions. 
    // It can be changed using the transferOwnership(_ownerAddress) function.
    // address payable public commisionAddress = payable(0xdD870fA1b7C4700F2BD7f44238821C26f7392148);
    // address payable public commisionAddress = payable(0xD0aFb575CB9f44529A65679Fd3F480F265e5A289);
    address payable public commisionAddress = payable(0x670793729eEB363a83354F4E5Bd429A486bac41d);

    // uint32 public _userSellerFee = 200;
    // uint32 public _memberSellerFee = 150;
    // uint32 public _userBuyerFee = 400;
    // uint32 public _memberBuyerFee = 400;
    
    uint32 public COMMISSION_DENOMINATOR = 10000;

    modifier onlyAuthorized() virtual;

    /* function setSellerFee(uint32 newSellerFee, uint32 newMemberSellerFee) internal onlyAuthorized {
    //     require(newSellerFee <= COMMISSION_DENOMINATOR && newMemberSellerFee <= COMMISSION_DENOMINATOR, "Fee cannot be greater than 100%");
    //     _userSellerFee = newSellerFee;
    //     _memberSellerFee = newMemberSellerFee;
    // }

    // function setBuyerFee(uint32 newUserBuyerFee, uint32 newMemberBuyerFee) internal onlyAuthorized {
    //     require(newUserBuyerFee <= COMMISSION_DENOMINATOR && newMemberBuyerFee <= COMMISSION_DENOMINATOR, "Fee cannot be greater than 100%");
    //     _userBuyerFee = newUserBuyerFee;
    //      _memberBuyerFee = newMemberBuyerFee;
     } */

    function updateCommissionDenominator(uint32 newDenominator) internal onlyAuthorized {
        require(newDenominator > 0, "Denominator cannot be zero");
        COMMISSION_DENOMINATOR = newDenominator;
    }

    function calculateFee(bool isMember, uint256 price, uint32 userFee, uint32 memberFee) internal view returns (uint256) {
        return (price * (isMember ? memberFee : userFee)) / COMMISSION_DENOMINATOR;
    }
}