//Especificamos la version
pragma solidity >=0.4.4 <0.7.0;

contract Estructures{

    //client de una pagina web de pago
    struct client{
        uint id;
        string name;
        string dni;
        string mail;
        uint phone_number;
        uint credit_number;
        uint secret_number;
    }

    //Declaramos una variable de tipo client
    client client_1 = client(1,"Daniel", "12345678B", "daniel@udemy.com", 12345678, 1234, 11);

    //Amazon (cualquier pagina de compra venta de products)
    struct product{
        string name;
        uint price;
    }

    //Declaramos una variable de tipo product
    product movil = product("samsung", 300);


    //Proyecto cooperativo de ONGs para ayudar en diversas causas
    struct ONG{
        address ong;
        string name;
    }
    //Declaramos una variable de tipo ONG
    //ONG caritas;
    ONG caritas = ONG(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4, "Caritas");

    struct Cause{
        uint id;
        string name;
        uint target_price;
    }
    //Declaramos una variable de tipo Cause
    Cause medicamentos = Cause(1, "medicamentos", 1000);
}