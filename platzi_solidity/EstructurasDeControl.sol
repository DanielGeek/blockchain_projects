// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract EstructurasDeControl {

    uint[] public numeros;
    string public resultado;

    constructor(bool condicion) {
        if(condicion) {
            resultado = "Condicion true";
        } else {
            resultado = "Condicion false";
        }

        for(uint iterador = 0; iterador < 10; iterador++) {
            numeros.push(iterador);
        }
    }
}