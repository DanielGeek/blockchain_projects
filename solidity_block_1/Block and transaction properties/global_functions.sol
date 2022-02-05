// Solidity version
pragma solidity ^0.8.7;

contract global_functions{
    
    function MsgSender() public view returns(address){
        return msg.sender;
    }

    function Timestamp() public view returns(uint){
        return block.timestamp;
    }

    function BlockCoinbase() public view returns(address){
        return block.coinbase;
    }

    function BlockDifficulty() public view returns(uint){
        return block.difficulty;
    }

    function BlockNumber() public view returns(uint){
        return block.number;
    }

    function MsgSig() public view returns(bytes4){
        return msg.sig;
    }

    function txGasPrice() public view returns(uint){
        return tx.gasprice;
    }
}
