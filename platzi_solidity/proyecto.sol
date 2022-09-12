// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;


import "@openzeppelin/contracts/access/Ownable.sol";

contract Proyecto is Ownable {

    address public comprador;
    address public vendedor;

    bool public depositoListo;
    bool public compradorOK;
    bool public pagoListo;

    uint public montoPago;

    modifier onlyComprador() {
        require(msg.sender == comprador, "No es el comprador");
        _;
    }

    constructor(address _comprador, address _vendedor, uint _monto) {
        comprador = _comprador;
        vendedor = _vendedor;
        montoPago = _monto;
        depositoListo = false;
        compradorOK = false;
        pagoListo = false;
    }

    //deposita el comprador
    function depositarPago() payable public onlyComprador {
        require(msg.value == montoPago, "No es el valor correcto");
        depositoListo = true;
    }

    function compradorConfirmaOK() public onlyComprador {
        compradorOK = true;
    }

    //retira el vendedor
    function retirarPago() public {
        require(compradorOK, "El comprador no ha dado el OK");
        payable(vendedor).transfer(montoPago);
        pagoListo = true;
    }

    //si el vendedor no entrega el producto, interviene el arbitro
    function pagarPorArbitro() public onlyOwner {
        payable(vendedor).transfer(montoPago);
        pagoListo = true;
    }
}