import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { Row, Col, Card, Alert, Spinner } from 'react-bootstrap';

export default function MyPurchases({ marketplace, nft, account }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [purchases, setPurchases] = useState([]);

    const loadPurchasedItems = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Check if all required contracts and account are available
            if (!marketplace || !nft || !account) {
                throw new Error('Failed to connect to the blockchain. Please check your wallet connection.');
            }

            console.log('Loading purchases for account:', account);
            console.log('Marketplace address:', marketplace.address);
            console.log('NFT address:', nft.address);

            // Get current block number
            const provider = marketplace.provider;
            const currentBlock = await provider.getBlockNumber();
            console.log('Current block:', currentBlock);

            // Search only in the last 10,000 blocks (approximately last 1-2 days on Sepolia)
            // You can adjust this number based on when your marketplace was deployed
            const fromBlock = Math.max(0, currentBlock - 10000);
            console.log('Searching from block:', fromBlock, 'to', currentBlock);

            // Get all Bought events (no filter, we'll filter manually)
            const filter = marketplace.filters.Bought();

            // Query the blockchain for Bought events with block range
            let results;
            try {
                results = await marketplace.queryFilter(filter, fromBlock, currentBlock);
                console.log('Total Bought events found:', results.length);
            } catch (filterError) {
                console.error('Error querying events:', filterError);
                // If still fails, try with even smaller range
                try {
                    const smallerFromBlock = Math.max(0, currentBlock - 1000);
                    console.log('Retrying with smaller range:', smallerFromBlock, 'to', currentBlock);
                    results = await marketplace.queryFilter(filter, smallerFromBlock, currentBlock);
                    console.log('Total Bought events found (retry):', results.length);
                } catch (retryError) {
                    console.error('Retry also failed:', retryError);
                    results = [];
                }
            }

            // Filter events where the buyer is the current account
            // Event signature: Bought(uint itemId, address indexed nft, uint tokenId, uint price, address indexed seller, address indexed buyer)
            const myPurchases = results.filter(event => {
                const buyer = event.args.buyer || event.args[5]; // buyer is the 6th parameter (index 5)
                const buyerAddress = buyer.toLowerCase();
                const accountAddress = account.toLowerCase();
                console.log('Event buyer:', buyerAddress, 'My account:', accountAddress, 'Match:', buyerAddress === accountAddress);
                return buyerAddress === accountAddress;
            });

            console.log('My purchases found from events:', myPurchases.length);

            // Alternative approach: Check all items in the marketplace to see which ones we own
            // This is more reliable but slower for large marketplaces
            if (myPurchases.length === 0) {
                console.log('No purchases found in events, checking NFT ownership...');
                const itemCount = await marketplace.itemCount();
                console.log('Total items in marketplace:', itemCount.toString());

                const ownedItems = [];
                for (let i = 1; i <= itemCount; i++) {
                    try {
                        const item = await marketplace.items(i);
                        // Check if item is sold and we own the NFT
                        if (item.sold) {
                            const owner = await nft.ownerOf(item.tokenId);
                            if (owner.toLowerCase() === account.toLowerCase()) {
                                console.log('Found owned NFT - Item:', i, 'TokenId:', item.tokenId.toString());
                                ownedItems.push({
                                    itemId: i,
                                    tokenId: item.tokenId,
                                    price: item.price,
                                    nftAddress: item.nft
                                });
                            }
                        }
                    } catch (err) {
                        console.warn('Error checking item', i, err);
                    }
                }

                console.log('Owned items found:', ownedItems.length);

                // If we found owned items, process them
                if (ownedItems.length > 0) {
                    const ownedPurchasePromises = ownedItems.map(async (item) => {
                        try {
                            const uri = await nft.tokenURI(item.tokenId);
                            console.log('Token URI:', uri);

                            const response = await fetch(uri);
                            if (!response.ok) {
                                console.warn(`Failed to fetch metadata for token ${item.tokenId}`);
                                return null;
                            }

                            const metadata = await response.json();
                            const totalPrice = await marketplace.getTotalPrice(item.itemId);

                            return {
                                totalPrice,
                                price: item.price.toString(),
                                itemId: item.itemId.toString(),
                                tokenId: item.tokenId.toString(),
                                name: metadata.name || 'Unnamed NFT',
                                description: metadata.description || 'No description available',
                                image: metadata.image || 'https://via.placeholder.com/200',
                                timestamp: 0
                            };
                        } catch (err) {
                            console.error('Error processing owned item:', err);
                            return null;
                        }
                    });

                    const ownedPurchases = (await Promise.all(ownedPurchasePromises))
                        .filter(purchase => purchase !== null);

                    if (ownedPurchases.length > 0) {
                        console.log('Final owned purchases loaded:', ownedPurchases.length);
                        setPurchases(ownedPurchases);
                        setLoading(false);
                        return;
                    }
                }
            }

            // If no purchases found, set empty array and return
            if (!myPurchases || myPurchases.length === 0) {
                setPurchases([]);
                setLoading(false);
                return;
            }

            // Process each purchase
            const purchasePromises = myPurchases.map(async (event) => {
                try {
                    const { itemId, tokenId, price } = event.args;

                    console.log('Processing purchase - ItemId:', itemId.toString(), 'TokenId:', tokenId.toString());

                    // Get token metadata
                    const uri = await nft.tokenURI(tokenId);
                    console.log('Token URI:', uri);

                    const response = await fetch(uri);

                    if (!response.ok) {
                        console.warn(`Failed to fetch metadata for token ${tokenId}`);
                        return null;
                    }

                    const metadata = await response.json();
                    console.log('Metadata:', metadata);

                    // Get the total price from the item
                    const totalPrice = await marketplace.getTotalPrice(itemId);

                    return {
                        totalPrice,
                        price: price.toString(),
                        itemId: itemId.toString(),
                        tokenId: tokenId.toString(),
                        name: metadata.name || 'Unnamed NFT',
                        description: metadata.description || 'No description available',
                        image: metadata.image || 'https://via.placeholder.com/200',
                        timestamp: event.blockNumber // Add block number for sorting
                    };
                } catch (err) {
                    console.error(`Error processing purchase:`, err);
                    return null;
                }
            });

            // Wait for all promises to resolve and filter out any failed ones
            const purchases = (await Promise.all(purchasePromises))
                .filter(purchase => purchase !== null)
                .sort((a, b) => b.timestamp - a.timestamp); // Sort by most recent

            console.log('Final purchases loaded:', purchases.length);
            setPurchases(purchases);

            if (purchases.length === 0 && myPurchases.length > 0) {
                console.warn('Purchases found but could not load any details');
            }

        } catch (err) {
            console.error('Error loading purchases:', err);
            setError('Error loading your purchases. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    }, [marketplace, nft, account]);

    useEffect(() => {
        // Only load if we have all required data
        if (marketplace && marketplace.address && nft && nft.address && account) {
            console.log('useEffect triggered - loading purchases');
            loadPurchasedItems();
        } else {
            console.log('useEffect - waiting for contracts/account', {
                hasMarketplace: !!marketplace,
                hasMarketplaceAddress: marketplace?.address,
                hasNFT: !!nft,
                hasNFTAddress: nft?.address,
                hasAccount: !!account
            });
            setLoading(false);
        }
        // Añadimos las dependencias para que se actualice cuando cambien
    }, [marketplace, nft, account, loadPurchasedItems]);
    // Show loading state
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p className="mt-2">Loading your purchases...</p>
                </div>
            </div>
        );
    }

    // Show error state if there was an error
    if (error) {
        return (
            <div className="container mt-4">
                <Alert variant="danger">
                    <Alert.Heading>Error</Alert.Heading>
                    <p>{error}</p>
                    <div className="d-flex justify-content-end">
                        <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={loadPurchasedItems}
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Try Again'}
                        </button>
                    </div>
                </Alert>
            </div>
        );
    }

    // Main content
    return (
        <div className='container py-4'>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>My Purchases</h2>
                <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={loadPurchasedItems}
                    disabled={loading}
                >
                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {purchases.length > 0 ? (
                <Row xs={1} md={2} lg={3} xl={4} className="g-4">
                    {purchases.map((item) => (
                        <Col key={`${item.itemId}-${item.tokenId}`}>
                            <Card className="h-100 shadow-sm">
                                <div style={{ height: '200px', overflow: 'hidden' }}>
                                    <Card.Img
                                        variant="top"
                                        src={item.image}
                                        style={{
                                            height: '100%',
                                            width: '100%',
                                            objectFit: 'cover'
                                        }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/200';
                                        }}
                                        alt={item.name}
                                    />
                                </div>
                                <Card.Body>
                                    <Card.Title className="text-truncate" title={item.name}>
                                        {item.name}
                                    </Card.Title>
                                    <Card.Text className="text-muted small">
                                        {item.description.length > 100
                                            ? `${item.description.substring(0, 100)}...`
                                            : item.description}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer className="bg-white border-top-0">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="fw-bold text-primary">
                                            {ethers.utils.formatEther(item.totalPrice)} ETH
                                        </span>
                                        <small className="text-muted">
                                            ID: {item.itemId}
                                        </small>
                                    </div>
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <div className="text-center py-5 border rounded bg-light">
                    <div className="mb-3">
                        <i className="bi bi-cart-x" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                    </div>
                    <h4>No Purchases Yet</h4>
                    <p className="text-muted">Your purchased NFTs will appear here</p>
                    <button
                        className="btn btn-primary mt-2"
                        onClick={() => window.location.href = '/'}
                    >
                        Browse Marketplace
                    </button>
                </div>
            )}
        </div>
    );

}