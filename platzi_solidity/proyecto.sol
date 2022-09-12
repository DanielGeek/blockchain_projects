// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Proyecto {

    address public comprador;
    address public vendedor;

    address public arbitro;

    bool public depositoListo;
    bool public compradorOK;
    bool public pagoListo;

    uint public montoPago;

    constructor(address _comprador, address _vendedor, uint _monto, address _arbitro){
    }

    //deposita el comprador
    function despositarPago() public {}

    function compradorConfirmaOK() public {
    }

    //retira el vendedor
    function retirarPago() public {}

    // si el vendedor no entrega el producto, interviene el _arbitro
    function cancelarPorArbitro() public {}
}
