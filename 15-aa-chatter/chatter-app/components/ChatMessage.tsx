import { useAccount } from 'wagmi'
import JazziconImage from './JazzinconImage'

export default function ChatMessage({ address, message }: { address: string, message: string }) {
    const { address: connectedAddress } = useAccount();
    return <div className={["flex flex-row gap-2", connectedAddress == address ? "justify-end" : ""].join(" ")}>
        <JazziconImage address={address} className={['w-6 h-6 rounded-full', address == connectedAddress ? 'order-2' : ''].join(" ")} />
        {message}
    </div>
}
