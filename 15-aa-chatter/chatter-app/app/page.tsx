"use client";
import MessageHistory from '@/components/MessageHistory';
import ScrollableBox from '@/components/ScrollableBox';
import SendMessage from '@/components/SendMessage';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Home() {

  return (
    <main className="container max-w-xl mx-auto py-3">
      <div className='flex flex-col h-screen justify-between'>
        <ConnectButton />
        <ScrollableBox className='flex flex-col py-5 w-full h-full overflow-y-auto' />
        <MessageHistory />
        <MessageHistory />
        <MessageHistory />
        <ScrollableBox />
        <SendMessage />
      </div>
    </main>
  );
}
