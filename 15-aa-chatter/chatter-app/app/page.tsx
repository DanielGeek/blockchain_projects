"use client";
import MessageHistory from '@/components/MessageHistory';
import ScrollableBox from '@/components/ScrollableBox';
import SendMessage from '@/components/SendMessage';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export default function Home() {

  const {address} = useAccount();

  return (
    <main className="container max-w-xl mx-auto">
      <div className='flex flex-col h-screen justify-between gap-5'>
        <div className='py-5 flex justify-center'>
          <ConnectButton />
        </div>
        <MessageHistory address={address} />
        <SendMessage />
      </div>
    </main>
  );
}
