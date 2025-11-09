import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Row, Col, Card, Alert, Spinner } from 'react-bootstrap';

export default function MyPurchases({ marketplace, nft, account }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [purchases, setPurchases] = useState([]);

    const loadPurchasedItems = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Check if all required contracts and account are available
            if (!marketplace || !nft || !account) {
                throw new Error('Failed to connect to the blockchain. Please check your wallet connection.');
            }

            // Create a filter for Bought events where the buyer is the current account
            const filter = marketplace.filters.Bought(null, null, null, null, null, account);
            
            // Query the blockchain for Bought events
            let results;
            try {
                results = await marketplace.queryFilter(filter);
            } catch (filterError) {
                console.warn('No purchase history found or error querying events:', filterError);
                results = [];
            }

            // If no purchases found, set empty array and return
            if (!results || results.length === 0) {
                setPurchases([]);
                setLoading(false);
                return;
            }

            // Process each purchase
            const purchasePromises = results.map(async (event) => {
                try {
                    const { itemId, nft: nftAddress, tokenId, price } = event.args;
                    
                    // Get token metadata
                    const uri = await nft.tokenURI(tokenId);
                    const response = await fetch(uri);
                    
                    if (!response.ok) {
                        console.warn(`Failed to fetch metadata for token ${tokenId}`);
                        return null;
                    }
                    
                    const metadata = await response.json();
                    
                    // Get the total price (including fees)
                    const totalPrice = price; // The price from the event already includes the fee
                    
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

            setPurchases(purchases);
            
            if (purchases.length === 0 && results.length > 0) {
                console.warn('Purchases found but could not load any details');
            }
            
        } catch (err) {
            console.error('Error loading purchases:', err);
            setError('Error loading your purchases. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPurchasedItems();
        // Añadimos las dependencias para que se actualice cuando cambien
    }, [marketplace, nft, account]);
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