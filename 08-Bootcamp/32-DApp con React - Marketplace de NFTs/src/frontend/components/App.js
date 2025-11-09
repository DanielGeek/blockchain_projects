import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Spinner, Alert } from 'react-bootstrap';
import Navigation from './Navbar';
import Home from './Home';
import Create from './Create';
import MyListedItems from './MyListedItems';
import MyPurchases from './MyPurchases';
import MarketplaceAbi from '../contractsData/Marketplace.json';
import MarketplaceAddress from '../contractsData/Marketplace-address.json';
import NFTAbi from '../contractsData/NFT.json';
import NFTAddress from '../contractsData/NFT-address.json';
import './App.css';

const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111 in hexadecimal

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [account, setAccount] = useState(null);
  const [nft, setNFT] = useState({});
  const [marketplace, setMarketplace] = useState({});

  const checkNetwork = async () => {
    if (!window.ethereum) return false;
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    return chainId === SEPOLIA_CHAIN_ID;
  };

  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
      return true;
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: SEPOLIA_CHAIN_ID,
              chainName: 'Sepolia Test Network',
              nativeCurrency: {
                name: 'Sepolia ETH',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: [process.env.REACT_APP_SEPOLIA_RPC_URL],
              blockExplorerUrls: ['https://sepolia.etherscan.io']
            }],
          });
          return true;
        } catch (addError) {
          console.error('Error adding Sepolia network:', addError);
          return false;
        }
      }
      console.error('Error switching to Sepolia:', switchError);
      return false;
    }
  };

  const loadContracts = async (signer) => {
    try {
      const marketplace = new ethers.Contract(
        MarketplaceAddress.address,
        MarketplaceAbi.abi,
        signer
      );
      const nft = new ethers.Contract(
        NFTAddress.address,
        NFTAbi.abi,
        signer
      );
      setMarketplace(marketplace);
      setNFT(nft);
      setLoading(false);
    } catch (err) {
      console.error("Error loading contracts:", err);
      setError("Error loading contracts. Please refresh the page.");
      setLoading(false);
    }
  };

  const web3Handler = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
      }

      // Check or switch to Sepolia
      const isSepolia = await checkNetwork();
      if (!isSepolia) {
        const switched = await switchToSepolia();
        if (!switched) {
          throw new Error("Por favor cambia a la red Sepolia en MetaMask");
        }
      }

      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (accounts.length === 0) {
        throw new Error("No se encontraron cuentas en MetaMask");
      }

      setAccount(accounts[0]);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      await loadContracts(signer);

      // Configure listeners
      window.ethereum.on('accountsChanged', (newAccounts) => {
        if (newAccounts.length > 0) {
          setAccount(newAccounts[0]);
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          loadContracts(provider.getSigner());
        } else {
          setAccount(null);
          setLoading(false);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });

    } catch (error) {
      console.error("Error in web3Handler:", error);
      setError(`Error: ${error.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts' 
        });
        
        if (accounts.length > 0) {
          await web3Handler();
        } else {
          setLoading(false);
        }

        // Check if the network changes
        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });
      } else {
        setLoading(false);
      }
    };

    init();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners();
      }
    };
  }, []);

  return (
    <BrowserRouter>
      <div className='App'>
        <Navigation web3Handler={web3Handler} account={account} />
        <div className="container mt-4">
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-2">Connecting to the blockchain...</p>
            </div>
          ) : !account ? (
            <div className="text-center my-5">
              <h4>Connect your wallet to start</h4>
              <button 
                onClick={web3Handler} 
                className="btn btn-primary mt-3"
              >
                Connect MetaMask
              </button>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={
                <Home marketplace={marketplace} nft={nft} account={account} />
              } />
              <Route path="/create" element={
                <Create marketplace={marketplace} nft={nft} />
              } />
              <Route path="/my-listed-items" element={
                <MyListedItems marketplace={marketplace} nft={nft} account={account} />
              } />
              <Route path="/my-purchases" element={
                <MyPurchases marketplace={marketplace} nft={nft} account={account} />
              } />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
