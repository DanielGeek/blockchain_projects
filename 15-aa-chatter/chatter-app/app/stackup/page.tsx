"use client";
import MessageHistory from '@/components/MessageHistory';
import SendMessage from '@/components/SendMessage';
import { useEthersSigner } from '@/lib/ethers';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
import { Presets, Client } from "userop";
import { useAccount } from 'wagmi';

const rpcUrl ="https://public.stackup.sh/api/v1/node/ethereum-sepolia";
const paymasterUrl = ""; // Optional - you can get one at https://app.stackup.sh/

export default function Stackup() {

    const [connectedAddress, setConnectedAddress] = useState<`0x${string}` | undefined>();
    const {address} = useAccount();

    const signer = useEthersSigner();

    const [useSmartWallet, setUseSmartWallet] = useState<boolean>(false);

    useEffect(() => {
        console.log(useSmartWallet);
        if(useSmartWallet && signer) {
            setConnectedAddress(undefined);
            const paymasterContext = { type: "payg" };
            const paymasterMiddleware = Presets.Middleware.verifyingPaymaster(
            paymasterUrl,
            paymasterContext
            );
            const opts = paymasterUrl === "" ? {} : {
                paymasterMiddleware: paymasterMiddleware,
            }
            Presets.Builder.SimpleAccount.init(signer, rpcUrl, opts).then(builder => {
                const smartWalletAddress = builder.getSender();
                console.log(`Account address: ${address} with smart wallet address ${smartWalletAddress}`);
                setConnectedAddress(smartWalletAddress as `0x${string}`);
            })
        } else {
            setConnectedAddress(address)
        }
    }, [useSmartWallet])
    

    return (
        <main className="container max-w-xl mx-auto py-3">
            <div className='flex flex-col h-screen justify-between'>
                <div className='flex flex-col gap-5 py-5'>
                    <div className='flex justify-between items-center'>
                        <ConnectButton />
                        <div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={useSmartWallet} className="sr-only peer" onChange={() => {setUseSmartWallet(!useSmartWallet)}} />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Smart Wallet</span>
                            </label>
                        </div>
                    </div>
                    <div className='flex justify-between items-center'>
                        Account: {connectedAddress}
                    </div>
                </div>
                <MessageHistory />
                <SendMessage />
            </div>
        </main>
    );
}
