"use client";
import { useEffect, useState } from 'react';
import { Log } from 'viem';
import { useBlockNumber, useContractEvent, usePublicClient } from 'wagmi';
import ChatMessage from './ChatMessage';

const chatterjson = require("../../chatter-contracts/out/Chatter.sol/Chatter.json");
const chatterAddress = "0xd0F90CDF11516Ea23aEA3aCD602d94d262676846";

export default function MessageHistory({address} : {address: `0x${string}` | undefined}) {

    const [messages, setMessages] = useState<Log[]>();
    const publicClient = usePublicClient();
    const { data: blocknumber } = useBlockNumber();

    useEffect(() => {
        setMessages([]);

        if(blocknumber) {
            publicClient.getContractEvents({
                address: chatterAddress,
                abi: chatterjson.abi,
                eventName: "Messages",
                fromBlock: blocknumber - BigInt(100),
                toBlock: 'latest'
            }).then(setMessages).catch(console.error);
        }
    }, []);

    useContractEvent({
        address: chatterAddress,
        abi: chatterjson.abi,
        eventName: "Message",
        listener(logs) {
            setMessages(oldMessages => { return oldMessages ? [...oldMessages, ...logs] : logs });
        }
    })

    return <div className='flex flex-col gap-2 w-full'>{messages?.map((logmsg, i) => <ChatMessage address={logmsg.args.sender} message={logmsg.args.message} connectedAddress={address} />)}</div>
}
