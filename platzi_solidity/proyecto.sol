// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Proyecto is Ownable {
    
    address public comprador;
    address public vendedor;
    address public arbitro;
    bool public depositoListo;
    bool public compradorOK;
    bool public pagoListo;

    uint public montoPago;

    modifier onlyComprador() {
        require(msg.sender==comprador,"No es el comprador");
        _;
    }

    constructor(address _comprador, address _vendedor, uint _monto, address _arbitro) {
    }

    //deposita el comprador 
    function depositoPago() payable public onlyComprador {
        require(msg.value == montoPago,"No es el valor correcto");
        depositoListo = true;
    }

    function compradorConfirmaOK() public onlyComprador {
        compradorOK=true;
    }

    //retira el vendedor 
    function retiraPago() public {
        payable(vendedor).transfer(montoPago);
        pagoListo=true;
    }

    //si el vendedor no entrega el producto, intervien el arbitro
    function pagarPorArbitro() public onlyOwner {
        payable(vendedor).transfer(montoPago);
        pagoListo=true;
    }


}