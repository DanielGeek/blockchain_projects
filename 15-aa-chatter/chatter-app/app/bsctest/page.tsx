"use client";
import MessageHistory from '@/components/MessageHistory';
import SendMessage from '@/components/SendMessage';
import { useEthersSigner } from '@/lib/ethers';
import { ConnectButton, connectorsForWallets, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
import { Presets, Client } from "userop";
import { SimpleAccount } from 'userop/dist/typechain';
import { Chain, createClient, encodeFunctionData } from 'viem';
import { configureChains, createConfig, useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { utils } from 'ethers';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

const rpcUrl = "https://api.stackup.sh/v1/node/971491705717593ded418093ab6a4eb2d54d287743c11872760209be14f83e01";
const paymasterUrl = "https://api.stackup.sh/v1/paymaster/971491705717593ded418093ab6a4eb2d54d287743c11872760209be14f83e01"; // Optional - you can get one at https://app.stackup.sh/

const chatterjson = require("../../../chatter-contracts/out/Chatter.sol/Chatter.json");
const chatterAddress = "0xd0F90CDF11516Ea23aEA3aCD602d94d262676846";

const RewardsContractAddress = "0x723Acc4cA859F2d95Ec69748Ce1D9c28a3C13024";
const RewardsAbiJson = require("../../utils/bscABi.json");

// // Definir la configuración de la Binance Smart Chain
// const binanceSmartChain: Chain = {
//     id: 56, // ID de la cadena para BSC Mainnet
//     name: 'Binance Smart Chain Mainnet',
//     network: 'bsc',
//     nativeCurrency: {
//       name: 'Binance Coin',
//       symbol: 'BNB',
//       decimals: 18,
//     },
//     rpcUrls: {
//       default: {
//         http: ['https://bsc-dataseed.binance.org/'], // URL predeterminada
//       },
//       public: {
//         http: ['https://bsc-dataseed.binance.org/'], // URL pública, reutiliza la predeterminada si es aplicable
//       },
//     },
//     blockExplorers: {
//       default: { name: 'BscScan', url: 'https://bscscan.com' },
//     },
//     testnet: false,
//   };

export default function Stackup() {

    // const { chains, publicClient, webSocketPublicClient } = configureChains(
    //     [
    //       binanceSmartChain, // Usa BSC aquí
    //       // Otras cadenas que necesites
    //     ],
    //     [publicProvider()] // Puedes agregar otros proveedores si lo necesitas
    // );

    // const projectId = 'YOUR_PROJECT_ID';

    // const { wallets } = getDefaultWallets({
    // appName: 'Tu Nombre de Aplicación',
    // projectId,
    // chains,
    // });
    
    // // Configuración de los conectores, asegúrate de que tus billeteras soporten BSC
    // const connectors = connectorsForWallets([...wallets]);

    // const wagmiConfig = createConfig({
    //     autoConnect: true, // Opcional, basado en tu preferencia
    //     connectors,
    //     publicClient,
    //     webSocketPublicClient,
    //   });

    const [connectedAddress, setConnectedAddress] = useState<`0x${string}` | undefined>();
    const { address } = useAccount();

    const signer = useEthersSigner();

    const [useSmartWallet, setUseSmartWallet] = useState<boolean>(false);

    const [builder, setBuilder] = useState<Presets.Builder.SimpleAccount>();

    useEffect(() => {
        console.log(useSmartWallet);
        if (useSmartWallet && signer) {
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
                setBuilder(builder)
            })
        } else {
            setConnectedAddress(address)
        }
    }, [useSmartWallet]);

    const [message, setMessage] = useState<string>("");

    const { config, error } = usePrepareContractWrite({
        address: chatterAddress,
        abi: chatterjson.abi,
        functionName: "sendMessage",
        args: [message]
    });

    // Read values from the smart contract
    const { data: readData, isLoading: readLoading } = useContractRead({
        address: RewardsContractAddress,
        abi: RewardsAbiJson,
        functionName: 'getPendingRewards',
        chainId: 56
    });

    console.log({readData});

    useEffect(() => {
      console.log({readData});
    }, [readData])
    

    const { write, data } = useContractWrite(config);

    function sendMessage() {
        if (message && message.length > 0) {
            if (useSmartWallet) {
                if (builder) {
                    const value = "0"; // Amount of the ERC-20 token to transfer

                    // Encode the calls
                    const callTo = [chatterAddress];
                    const data = encodeFunctionData({
                        abi: chatterjson.abi,
                        functionName: 'sendMessage',
                        args: [message]
                    })
                    const callData = [data];
                    // Send the User Operation to the ERC-4337 mempool
                    Client.init(rpcUrl).then(async client => {
                        const res = await client.sendUserOperation(builder.executeBatch(callTo, callData), {
                            onBuild: (op) => console.log("Signed UserOperation:", op),
                        });

                        // Return receipt
                        console.log(`UserOpHash: ${res.userOpHash}`);
                        console.log("Waiting for transaction...");
                        const ev = await res.wait();
                        console.log(`Transaction hash: ${ev?.transactionHash ?? null}`);
                        console.log(`View here: https://jiffyscan.xyz/userOpHash/${res.userOpHash}`);
                    });
                }
            } else {
                write?.();
            }
        }
    }

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onSettled() {
            setMessage("");
        }
    });

    
    if (readLoading) return <p>Loading...</p>

    return (
        <div>
        {readData && (
            <p>
                Data is {readData}
            </p>
        )}
        </div>
    );


    // return (
    //     <main className="container max-w-xl mx-auto py-3">
    //         <div className='flex flex-col h-screen justify-between'>
    //             <div className='flex flex-col gap-5 py-5'>
    //                 <div className='flex justify-between items-center'>
    //                     <ConnectButton />
    //                     <div>
    //                         <label className="relative inline-flex items-center cursor-pointer">
    //                             <input type="checkbox" checked={useSmartWallet} className="sr-only peer" onChange={() => { setUseSmartWallet(!useSmartWallet) }} />
    //                             <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
    //                             <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Smart Wallet</span>
    //                         </label>
    //                     </div>
    //                 </div>
    //                 <div className='flex justify-between items-center'>
    //                     Account: {connectedAddress}
    //                 </div>
    //             </div>
    //             <MessageHistory address={connectedAddress} />
    //             <div className='flex w-full p-5 border-t-2'>
    //                 <input
    //                     type='text'
    //                     value={message}
    //                     onChange={(e) => { setMessage(e.target.value) }}
    //                     onKeyDown={event => {
    //                         if (event.key == "Enter" && (event.metaKey || event.ctrlKey)) {
    //                             sendMessage();
    //                         }
    //                     }}
    //                     placeholder='Hi there...'
    //                     className='w-full text-gray-600 p-3 bg-gray-200 rounded-l-md focus:outline-none focus:placeholder-gray-300'
    //                 />
    //                 <button
    //                     onClick={(e) => { e.preventDefault(), sendMessage() }}
    //                     type='button'
    //                     className='px-4 py-3 bg-blue-500 rounded-r-lg hover:bg-blue-400 ease-in-out duration-500'
    //                 >📩</button>
    //             </div>
    //         </div>
    //     </main>
    // );
}
