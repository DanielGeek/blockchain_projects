"use client";
import { useEffect, useState } from 'react';
import { Log } from 'viem';
import { useContractEvent, usePublicClient } from 'wagmi';
import ChatMessage from './ChatMessage';

const chatterjson = require("../../chatter-contracts/out/Chatter.sol/Chatter.json");
const chatterAddress = "0xd0F90CDF11516Ea23aEA3aCD602d94d262676846";

export default function MessageHistory() {

    const [messages, setMessages] = useState<Log[]>();
    const publicClient = usePublicClient();
    useEffect(() => {
        setMessages([]);

        publicClient.getContractEvents({
            address: chatterAddress,
            abi: chatterjson.abi,
            eventName: "Message",
            fromBlock: BigInt(5212661),
            toBlock: 'latest'
        }).then(setMessages).catch(console.error);
    }, []);

    useContractEvent({
        address: chatterAddress,
        abi: chatterjson.abi,
        eventName: "Message",
        listener(logs) {
            setMessages(oldMessages => { return oldMessages ? [...oldMessages, ...logs] : logs });
        }
    })

    return <div className='flex flex-col gap-2 w-full'>{messages?.map((logmsg, i) => <ChatMessage address={logmsg.args.sender} message={logmsg.args.message} />)}</div>
}
