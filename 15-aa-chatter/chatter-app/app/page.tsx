"use client";
import MessageHistory from '@/components/MessageHistory';
import SendMessage from '@/components/SendMessage';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between container max-w-xl mx-auto py-3">
      <ConnectButton />
      <MessageHistory />
      <SendMessage />
    </main>
  );
}
