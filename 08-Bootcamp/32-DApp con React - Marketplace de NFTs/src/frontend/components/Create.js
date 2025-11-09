import { useState } from 'react';
import { ethers } from 'ethers';
import { Row, Form, Button } from 'react-bootstrap';
import axios from 'axios';

// Configuring Pinata from environment variables
const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.REACT_APP_PINATA_SECRET_API_KEY;

// Function to upload files to Pinata
const uploadToPinata = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const metadata = JSON.stringify({
        name: file.name,
    });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
        cidVersion: 0,
    });
    formData.append('pinataOptions', options);

    try {
        const res = await axios.post(
            'https://api.pinata.cloud/pinning/pinFileToIPFS',
            formData,
            {
                maxBodyLength: 'Infinity',
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                    'pinata_api_key': PINATA_API_KEY,
                    'pinata_secret_api_key': PINATA_SECRET_API_KEY
                }
            }
        );
        return res.data;
    } catch (error) {
        console.log('Error al subir a Pinata: ', error);
        throw error;
    }
};

const Create = ({ marketplace, nft }) => {
    const [image, setImage] = useState('');
    const [price, setPrice] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const uploadToIPFS = async (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (typeof file !== 'undefined') {
            try {
                const result = await uploadToPinata(file);
                console.log('File uploaded to IPFS via Pinata:', result);
                setImage(`https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`);
            } catch (error) {
                console.log("Error uploading image to IPFS: ", error);
            }
        }
    }

    const createNFT = async () => {
        if (!image || !price || !name || !description) {
            alert('Please fill in all fields');
            return;
        }
        try {
            const metadata = {
                image,
                price,
                name,
                description,
                attributes: []
            };

            // Convert metadata object to a file for Pinata upload
            const metadataFile = new File(
                [JSON.stringify(metadata)],
                'metadata.json',
                { type: 'application/json' }
            );

            const result = await uploadToPinata(metadataFile);
            console.log('Metadata uploaded to IPFS:', result);
            await mintThenList({ path: result.IpfsHash });
        } catch (error) {
            console.log("Error uploading metadata to IPFS: ", error);
        }
    }

    const mintThenList = async (result) => {
        const uri = `https://gateway.pinata.cloud/ipfs/${result.path}`;
        try {
            // Mint el NFT
            await (await nft.mint(uri)).wait();
            const id = await nft.tokenCount();

            // Aprobar el marketplace para transferir el NFT
            await (await nft.setApprovalForAll(marketplace.address, true)).wait();

            // Listar el NFT en el marketplace
            const listingPrice = ethers.utils.parseEther(price.toString());
            await (await marketplace.makeItem(nft.address, id, listingPrice)).wait();

            alert('¡NFT successfully created and listed!');

            // Clear the form
            setImage('');
            setPrice(null);
            setName('');
            setDescription('');

        } catch (error) {
            console.log('Error in mintThenList:', error);
        }
    }

    return (
        <div className="container-fluid mt-5">
            <div className='row'>
                <main role="main" className='col-lg-12 mx-auto' style={{ maxWidth: '1000px' }}>
                    <div className='content mx-auto'>
                        <Row className='g-4'>
                            <Form.Control
                                type="file"
                                required
                                name="file"
                                onChange={uploadToIPFS}
                                className="mb-3"
                            />
                            {image && (
                                <div className="mb-3">
                                    <img src={image} alt="NFT Preview" style={{ maxWidth: '200px' }} />
                                </div>
                            )}
                            <Form.Control
                                onChange={(e) => setName(e.target.value)}
                                size="lg"
                                required
                                type="text"
                                placeholder="NFT name"
                                className="mb-3"
                                value={name}
                            />
                            <Form.Control
                                onChange={(e) => setDescription(e.target.value)}
                                size="lg"
                                required
                                as="textarea"
                                placeholder="Description"
                                className="mb-3"
                                value={description}
                                rows={3}
                            />
                            <Form.Control
                                onChange={(e) => setPrice(e.target.value)}
                                size="lg"
                                required
                                type="number"
                                placeholder='Price in ETH'
                                className="mb-3"
                                value={price || ''}
                            />
                            <div className='d-grid px-0'>
                                <Button
                                    onClick={createNFT}
                                    variant="primary"
                                    size="lg"
                                    className="mt-3"
                                >
                                    Create and list NFT
                                </Button>
                            </div>
                        </Row>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Create;
