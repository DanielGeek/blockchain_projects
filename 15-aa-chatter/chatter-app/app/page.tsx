"use client";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
import { Log } from 'viem';
import { useContractEvent, useContractWrite, usePrepareContractWrite, usePublicClient } from 'wagmi';

const chatterjson = require("../../chatter-contracts/out/Chatter.sol/Chatter.json");
const chatterAddress = "0xd0F90CDF11516Ea23aEA3aCD602d94d262676846";

export default function Home() {
  const [message, setMessage] = useState<string>();
  const [messages, setMessages] = useState<Log[]>();
  const publicClient = usePublicClient();

  useEffect(() => {
    setMessages([]);

    publicClient.getContractEvents({
      address: chatterAddress,
      abi: chatterjson.abi,
      eventName: "Message",
      fromBlock: BigInt(0),
      toBlock: 'latest'
    }).then(setMessages).catch(console.error);
  }, []);

  useContractEvent({
    address: chatterAddress,
    abi: chatterjson.abi,
    eventName: "Message",
    listener(logs) {
      setMessages(oldMessages => { return oldMessages ? [ ...oldMessages, ...logs ] : logs });
    }
  })

  const { config, error } = usePrepareContractWrite({
    address: chatterAddress,
    abi:  chatterjson.abi,
    functionName: "sendMessage",
    args: [message]
  });

  const { write } = useContractWrite(config);

  function sendMessage() {
    if(message && message.length > 0) {
      write?.();
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ConnectButton />
      <div>{messages?.map((logmsg, i) => <div key={i}>{logmsg.args.sender} - {logmsg.args.message}</div>)}</div>
      <div>
        <input type='text' onChange={(e) => {setMessage(e.target.value)}} placeholder='Hi there...' />
        <button onClick={(e) => {e.preventDefault(), sendMessage()}} type='button'>📩</button>
      </div>
    </main>
  );
}
