import { Link } from "react-router-dom";
import { Navbar, Nav, Button, Container, NavDropdown, Badge } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import nft from './nft.png';

const NETWORK_NAMES = {
    '0x1': 'Ethereum Mainnet',
    '0xaa36a7': 'Sepolia Testnet',
    '0x5': 'Goerli Testnet',
    '0x13881': 'Mumbai Testnet',
    '0x89': 'Polygon Mainnet',
    '0x38': 'BSC Mainnet',
    '0x61': 'BSC Testnet'
};

const Navigation = ({ web3Handler, account, onDisconnect }) => {
    const [network, setNetwork] = useState(null);
    const [balance, setBalance] = useState('0');
    const [isSepolia, setIsSepolia] = useState(false);

    useEffect(() => {
        const checkNetwork = async () => {
            if (window.ethereum) {
                try {
                    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                    setNetwork(NETWORK_NAMES[chainId] || `Unknown (${chainId})`);
                    setIsSepolia(chainId === '0xaa36a7');
                    
                    if (account) {
                        const provider = new ethers.providers.Web3Provider(window.ethereum);
                        const balance = await provider.getBalance(account);
                        setBalance(ethers.utils.formatEther(balance).substring(0, 6));
                    }
                } catch (error) {
                    console.error('Error checking network:', error);
                }
            }
        };

        checkNetwork();

        // Listen for network changes
        if (window.ethereum) {
            window.ethereum.on('chainChanged', (chainId) => {
                window.location.reload();
            });
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeAllListeners('chainChanged');
            }
        };
    }, [account]);

    const formatAddress = (address) => {
        return `${address.substring(0, 6)}...${address.substring(38)}`;
    };

    const handleDisconnect = () => {
        if (typeof onDisconnect === 'function') {
            onDisconnect();
        }
    };

    const handleAddSepolia = async () => {
        try {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: '0xaa36a7',
                    chainName: 'Sepolia Test Network',
                    nativeCurrency: {
                        name: 'Sepolia ETH',
                        symbol: 'ETH',
                        decimals: 18
                    },
                    rpcUrls: ['https://rpc.sepolia.org'],
                    blockExplorerUrls: ['https://sepolia.etherscan.io']
                }],
            });
        } catch (error) {
            console.error('Error adding Sepolia network:', error);
        }
    };

    return (
        <Navbar expand="lg" bg="primary" variant="dark">
            <Container>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                    <img src={nft} width="40" height="40" className="me-2" alt="NFT Marketplace" />
                    <span className="d-none d-md-inline">NFT Marketplace</span>
                </Navbar.Brand>
                
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/create">Create</Nav.Link>
                        <Nav.Link as={Link} to="/my-listed-items">My Items</Nav.Link>
                        <Nav.Link as={Link} to="/my-purchases">My Purchases</Nav.Link>
                    </Nav>
                    
                    <div className="d-flex align-items-center">
                        {account ? (
                            <div className="d-flex align-items-center">
                                <div className="d-none d-md-flex align-items-center me-3">
                                    <div className="network-indicator me-2">
                                        {isSepolia ? (
                                            <Badge bg="success" className="me-2">
                                                {network}
                                            </Badge>
                                        ) : (
                                            <Button 
                                                variant="warning" 
                                                size="sm" 
                                                className="me-2"
                                                onClick={handleAddSepolia}
                                            >
                                                Switch to Sepolia
                                            </Button>
                                        )}
                                    </div>
                                    <div className="balance">
                                        <Badge bg="info">
                                            {balance} ETH
                                        </Badge>
                                    </div>
                                </div>
                                
                                <NavDropdown 
                                    title={
                                        <span className="d-flex align-items-center">
                                            <i className="bi bi-wallet2 me-1"></i>
                                            <span className="d-none d-md-inline">
                                                {formatAddress(account)}
                                            </span>
                                        </span>
                                    } 
                                    align="end"
                                    className="wallet-dropdown"
                                >
                                    <NavDropdown.Item 
                                        href={`https://sepolia.etherscan.io/address/${account}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <i className="bi bi-box-arrow-up-right me-2"></i>
                                        View on Explorer
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={handleDisconnect}>
                                        <i className="bi bi-box-arrow-right me-2"></i>
                                        Disconnect
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </div>
                        ) : (
                            <Button 
                                onClick={web3Handler} 
                                variant="outline-light"
                                className="d-flex align-items-center"
                            >
                                <i className="bi bi-plug me-2"></i>
                                <span className="d-none d-md-inline">Connect Wallet</span>
                            </Button>
                        )}
                    </div>
                </Navbar.Collapse>
            </Container>
            
            <style jsx>{`
                .wallet-dropdown :global(.dropdown-menu) {
                    min-width: 220px;
                }
                .network-indicator {
                    display: inline-flex;
                    align-items: center;
                }
                .balance {
                    font-size: 0.9rem;
                }
                @media (max-width: 767.98px) {
                    .navbar-nav .nav-link {
                        padding: 0.5rem 0;
                    }
                }
            `}</style>
        </Navbar>
    );
};

export default Navigation;