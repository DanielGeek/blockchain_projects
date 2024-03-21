"use client";
import { ethers } from 'ethers';
import MessageHistory from '@/components/MessageHistory';
import ScrollableBox from '@/components/ScrollableBox';
import SendMessage from '@/components/SendMessage';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useFeeData } from 'wagmi';
import { useEffect } from 'react';

const network = "maticmum"; // maticmum is the network name for Polygon Mumbai in ethers.js
// const provider = new ethers.AlchemyProvider(network, 'dnx6iguNj8FaItnQETo-E1UnhLJrSxH6');
// const provider = new ethers.AlchemyProvider(network, 'https://polygon-mumbai.g.alchemy.com/v2/dnx6iguNj8FaItnQETo-E1UnhLJrSxH6');
const contractAddress = '0x57C98f1f2BC34A0054CBc1257fcc9333c1b6730c';

const provider = new ethers.providers.AlchemyProvider(network, 'dnx6iguNj8FaItnQETo-E1UnhLJrSxH6');

export default function Home() {

  async function getProviderOrSigner(needSigner = false) {
    console.log({needSigner})
    // Ensure Ethereum object is available in window (MetaMask injects this)
    if (window.ethereum) {
      console.log("entro en requestAcc")
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log("paso en requestAcc")
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log({provider})
      // If a signer is needed, return the signer instead of the provider
      return needSigner ? provider.getSigner() : provider;
    } else {
      console.error('Please install MetaMask!');
    }
  }
  async function callViewFunction() {
    const functionSignature = '0x838ad0ee'; // Function selector
    const functionSignature2 = '0xddc24be3'; // Function selector
    const callData = functionSignature; // Since there are no arguments, callData is just the function selector
    const callData2 = functionSignature; // Since there are no arguments, callData is just the function selector
  
    try {
      const result = await provider.call({ to: contractAddress, data: callData });
      // const result = "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000cf43616c6c207468697320636f6e747261637420776974682066756e6374696f6e207369676e6174757265202730786464633234626533272070726f766964696e672061202775696e743235362720617267756d656e74206f662076616c75653a20323237383137393730393238363831363932383837323536343431383433323338313336303133363830363431383135313932383334363635383039363531373931303039303331383138383720416c736f2073656d65207765693a20343230303030303030303030";
      console.log('Function call result:', result);
      const types = ['string'];
      // Decode the data
      const decodedString = ethers.utils.defaultAbiCoder.encode(types, [result]);
      console.log({decodedString})

      const valueArgument = '22781797092868169288725644184323813601368064181519283466580965179100903181887';
      const encodedData = ethers.utils.defaultAbiCoder.encode(
        ['bytes4', 'uint256'],
        [functionSignature2, valueArgument]
      );

      const tx = {
        to: contractAddress,
        data: encodedData,
        value: ethers.utils.parseUnits("0.00042", "ether") // Sending some wei as suggested
      };

      const signer = await getProviderOrSigner(true);
      console.log({signer})

      // const signer = provider.getSigner();
      const txResponse = await signer?.sendTransaction(tx);
      console.log('Transaction response:', txResponse);


    } catch (error) {
      console.error('Error:', error);
    }
  }
  useEffect(() => {
    callViewFunction();
  }, [])
  
  console.log('hello1')
  const {address} = useAccount();

  return (
    <main className="container max-w-xl mx-auto">
      <div className='flex flex-col h-screen justify-between gap-5'>
        <div className='py-5 flex justify-center'>
          <ConnectButton />
          <button onClick={() => getProviderOrSigner(true)}>Connect signer</button>
        </div>
        <MessageHistory address={address} />
        <SendMessage />
      </div>
    </main>
  );
}
