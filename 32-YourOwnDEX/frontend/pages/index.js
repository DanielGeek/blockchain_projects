import { useRouter } from "next/router";

export default function Home() {
    const router = useRouter();

    return (
        <>
            <main className="w-screen flex justify-center items-center">
                <div className="py-8 mx-32">
                    <h1 className="text-white text-3xl font-bold">
                        My Beauty DEX
                    </h1>
                    <h3 className="text-white text-xl font-bold pt-12">
                        A decentralized exchange (DEX) is a peer-to-peer (P2P) marketplace that connects cryptocurrency buyers 
                        and sellers. In contrast to centralized exchanges (CEXs), decentralized platforms are non-custodial, 
                        meaning a user remains in control of their private keys when transacting on a DEX platform.
                    </h3>
                    <div className="pt-12">
                        <button
                            className="bg-pink-500 hover:bg-pink-600 text-white font-bold rounded px-8 py-2"
                            onClick={async function () {
                                router.push("/swap")
                            }}
                        >
                            Swap
                        </button>
                        <button
                            className="bg-pink-500 hover:bg-pink-600 text-white font-bold rounded px-8 py-2 ml-8"
                            onClick={async function () {
                                router.push("/pools")
                            }}
                        >
                            Liquidity
                        </button>
                    </div>
                </div>
            </main>
        </>
    )
}
