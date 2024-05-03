import { useMoralis, useWeb3Contract } from "react-moralis";
import { qiteAddresses, qiteDexAbi } from "@/constants/qite-dex-constant";
import CreateModal from './CreateModal';
import { useState } from 'react';

const LiquidityPools = () => {
    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const qiteContractAddress =
        parseInt(chainIdHex) in qiteAddresses 
            ? qiteAddresses[parseInt(chainIdHex)].qiteSwap 
            : null
        const { runContractFunction: createLiquidityPool } = useWeb3Contract({
            abi: qiteDexAbi,
            contractAddress: qiteContractAddress,
            functionName: "createPairs",
        })

        const handleConfirmModal = async (token1, token2, token1Name, token2Name) => {
            try {
                console.log("Create liquidity pool for ", token1, token2);
                await createLiquidityPool({
                    params: {
                        params: {
                            token1: token1,
                            token2: token2,
                            token1Name: token1Name,
                            token2Name: token2Name
                        }
                    }, onSuccess: (tx) => {
                        console.log("Liquidity pool created successfully ", tx)
                    }, onError: (err) => {
                        console.log(err)
                    }
                })
                setIsModalOpen(false)
            } catch (error) {
                console.log("Error when creating liquidity pool: ", error);
            }
        }

        const handleCloseModal = () => {
            setIsModalOpen(false);
        }

        return (
            <div className="mt-8 p-8 bg-white rounded-lg shadow-md max-w-lg mx-auto">
                <h2 className="text-2xl font-bold mb-4">Liquidity Pools</h2>
                {isWeb3Enabled && qiteContractAddress != null ? (
                        <div>
                            <p className="mb-4">Welcome, {account}!</p>
                            <button className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                                onClick={(e) => setIsModalOpen(true)}
                            >
                                Create Liquidity Pool
                            </button>
                            <CreateModal
                                isOpen={isModalOpen}
                                onClose={handleCloseModal}
                                onConfirm={handleConfirmModal}
                            />
                        </div>
                    ) : ( 
                        <div>Please Log In!</div>
                    )}
            </div>
        );
}

export default LiquidityPools;
