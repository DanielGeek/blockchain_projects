// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "./CommissionManager.sol";

contract Spozz721 is ERC721URIStorage, ERC721Burnable, ReentrancyGuard, CommissionManager, ERC2981 {
    string private _customBaseURI;
    string public _contractURI;

    mapping(address => bool) public authorizedAddresses;


    uint256 public maxSupply = 0;  // Set your max supply
    uint256 public currentSupply = 0;  // total supply in circulation

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool putOnSale;
        address payable royaltyBeneficiary;
    }

    mapping(uint256 => MarketItem) private idToMarketItem;

    struct Bid {
        address bidder;
        uint256 amount;
        bool accepted;
        bool placed;
        uint256 buyerFee;
    }

    mapping(uint256 => mapping(address => Bid)) public bids;

    event MarketItemCreated(
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool putOnSale,
        address payable royaltyBeneficiary
    );

    event MarketItemSold(
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool putOnSale,
        address payable royaltyBeneficiary
    );

    event BidMade(uint256 indexed tokenId, address indexed bidder, uint256 amount, uint256 buyerFee);
    event BidAccepted(uint256 indexed tokenId, address indexed bidder, uint256 amount, uint256 buyerFee, uint256 sellerFee);
    event BidWithdrawn(uint256 indexed tokenId, address indexed bidder, uint256 amount, uint256 buyerFee);
    event BidRejected(uint256 indexed tokenId, address indexed bidder, uint256 amount, uint256 buyerFee);

    event SellerCommissionTransfered(uint256 indexed tokenId, address indexed fromAddress, uint256 sellerFee);
    event BuyerCommissionTransfered(uint256 indexed tokenId, address indexed fromAddress, uint256 buyerFee);

    event TokenTransferred(address indexed from, address indexed to, uint256 tokenId);

    event TokenBurned(uint256 indexed tokenId, address owner);

    modifier onlyAuthorized() override {
            require(authorizedAddresses[msg.sender] || msg.sender == commisionAddress, "only admin or authorized addresses of the marketplace can use it");
        _;
    }

    constructor(
        string memory name_,
        string memory symbol_,
        string memory uri_,
        string memory contractURI_,
        uint256 maxSupply_
    ) ERC721(name_, symbol_) {
        _customBaseURI = uri_;
        _contractURI = contractURI_;
        if (maxSupply_ > 0) {
            maxSupply = maxSupply_;
        }
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _customBaseURI;
    }

    function setContractURI(string memory contractURI_) external onlyAuthorized {
        _contractURI = contractURI_;
    }

    function contractURI() public view returns (string memory) {
        return _contractURI;
    }

    /* Mints a token and lists it in the marketplace */
    function createToken(
        string memory tokenCID,
        uint256 price,
        address payable royaltyReceiver,
        uint32 royaltyNumerator,
        bool putOnSale,
        address tokenOwner
    ) public payable returns (uint256) {
        require(price > 0, "Price must be greater than 0");

        if(maxSupply > 0) {
            require(_tokenIds.current() < maxSupply, "Max supply reached");
        }

        _tokenIds.increment();
        currentSupply++;
        uint256 newTokenId = _tokenIds.current();

        if(tokenOwner == address(0)) {
            tokenOwner = msg.sender;
        }
        _safeMint(tokenOwner, newTokenId);
        _setTokenURI(newTokenId, tokenCID);
        // _setTokenRoyalty(newTokenId, royaltyNumerator);
        _setTokenRoyalty(newTokenId, royaltyReceiver, royaltyNumerator);
        createMarketItem(newTokenId, price, royaltyReceiver, putOnSale, tokenOwner);
        return newTokenId;
    }

    function createMarketItem(uint256 tokenId, uint256 price, address payable royaltyReceiver, bool putOnSale, address tokenOwner) private {

        idToMarketItem[tokenId] = MarketItem(
            tokenId,
            payable(tokenOwner),
            payable(tokenOwner),
            price,
            putOnSale,
            royaltyReceiver
        );

        emit MarketItemCreated(
            tokenId,
            tokenOwner,
            tokenOwner,
            price,
            putOnSale,
            royaltyReceiver
        );
    }

    /* allows someone to edit token price and  putOnSale state */
    function editToken(uint256 tokenId, uint256 price, bool putOnSale) public payable {
        require(tokenExists(tokenId), "Token ID does not exist");
        require(
            idToMarketItem[tokenId].owner == msg.sender,
            "Only item owner can perform this operation"
        );
        idToMarketItem[tokenId].price = price;
        idToMarketItem[tokenId].seller = payable(msg.sender);
        idToMarketItem[tokenId].putOnSale = putOnSale;
    }

    function tokenExists(uint256 tokenId) public view returns (bool) {
        return idToMarketItem[tokenId].owner != address(0);
    }


    /* Creates the sale of a marketplace item */
    /* Transfers ownership of the item, as well as funds between parties */
    function createMarketSale(
            uint256 tokenId, 
            bool isSellerMember, 
            bool isBuyerMember, 
            uint32 _userSellerFee,
            uint32 _memberSellerFee, 
            uint32 _userBuyerFee, 
            uint32 _memberBuyerFee
    ) public payable nonReentrant {
        MarketItem storage item = idToMarketItem[tokenId];
        validateSale(tokenId, item);
        
        uint256 price = item.price;
        uint256 royaltyAmount = calculateRoyalty(tokenId, price);
        uint256 sellerFee = calculateFee(isSellerMember, price, _userSellerFee, _memberSellerFee);
        uint256 buyerFee = calculateFee(isBuyerMember, price, _userBuyerFee, _memberBuyerFee);
        
        require(msg.value == price + royaltyAmount + buyerFee, "Please submit total payment in order to complete the purchase");

        transferOwnershipAndHandlePayments(tokenId, item, sellerFee, buyerFee, royaltyAmount);
    }

    function validateSale(uint256 tokenId, MarketItem storage item) internal view {
        require(tokenExists(tokenId), "Token ID does not exist");
        require(item.putOnSale, "The token must be for sale");
        require(item.owner != msg.sender, "You are the owner token");
    }

    function calculateRoyalty(uint256 tokenId, uint256 price) internal view returns (uint256) {
        (, uint256 royaltyAmount) = royaltyInfo(tokenId, price);
        return royaltyAmount;
    }

    function transferOwnershipAndHandlePayments(uint256 tokenId, MarketItem storage item, uint256 sellerFee, uint256 buyerFee, uint256 royaltyAmount) internal {
        address seller = item.seller;
        address tokenOwner = item.owner;

        // Ownership transfer and status update
        item.owner = payable(msg.sender);
        item.putOnSale = false;
        _transfer(tokenOwner, msg.sender, tokenId);

        // Transfer fees and sale price
        uint256 sellerReceivable = item.price - sellerFee;

        if (commisionAddress == seller) {
            payable(seller).transfer(buyerFee + sellerFee + sellerReceivable);
        } else {
            payable(commisionAddress).transfer(buyerFee + sellerFee);
            payable(seller).transfer(sellerReceivable);
        }

        emit SellerCommissionTransfered(tokenId, msg.sender, sellerFee);
        emit BuyerCommissionTransfered(tokenId, msg.sender, buyerFee);

        if (royaltyAmount > 0) {
            item.royaltyBeneficiary.transfer(royaltyAmount);
        }

        emitMarketItemSoldEvent(tokenId, item);
    }

    /* Returns only items that a user has purchased */
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns only items a user has listed */
    function fetchItemsListed() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender && idToMarketItem[i + 1].putOnSale == true) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function transferToken(address to, uint256 tokenId) public {
        require(tokenExists(tokenId), "Token ID does not exist");
        require(ownerOf(tokenId) == msg.sender, "Only the owner of the token can transfer it");
        require(to != msg.sender, "Enter an address different from yours");
        safeTransferFrom(msg.sender, to, tokenId);
        idToMarketItem[tokenId].owner = payable(to);
        idToMarketItem[tokenId].seller = payable(to);
        
        emit TokenTransferred(msg.sender, to, tokenId);
    }

    function makeBid(
        uint256 _tokenId,
        bool isBuyerMember,
        uint32 _userBuyerFee,
        uint32 _memberBuyerFee,
        uint256 providedBuyerFee
    ) public payable {
        MarketItem storage marketItem = idToMarketItem[_tokenId];
        require(marketItem.putOnSale == true, "Token is not on sale or nonexistent token");

        uint256 totalAmount = msg.value; // bid + buyerFee
        require(totalAmount > providedBuyerFee, "The provided total amount should be greater than the buyer's fee.");
        uint256 netBidAmount = totalAmount - providedBuyerFee;

        // Calculate the expected buyerFee based on the net bid amount
        uint256 expectedBuyerFee = calculateFee(isBuyerMember, netBidAmount, _userBuyerFee, _memberBuyerFee);

        // Validate that the provided buyerFee matches the expected buyerFee
        require(providedBuyerFee == expectedBuyerFee, "Provided buyerFee does not match expected buyerFee.");

        if (bids[_tokenId][msg.sender].placed) {
            // Refund the previous bid
            payable(msg.sender).transfer(bids[_tokenId][msg.sender].amount + bids[_tokenId][msg.sender].buyerFee);  // also refund the buyer fee
        }

        Bid memory bid = Bid(msg.sender, netBidAmount, false, true, providedBuyerFee);
        bids[_tokenId][msg.sender] = bid;

        emit BidMade(_tokenId, msg.sender, netBidAmount, providedBuyerFee);
    }

    function acceptBid(
        uint256 _tokenId,
        address _bidder,
        bool isSellerMember,
        uint32 _userSellerFee,
        uint32 _memberSellerFee
    ) public {
        MarketItem storage marketItem = idToMarketItem[_tokenId];
        require(_msgSender() == marketItem.owner, "Only the owner can accept bids");

        Bid storage bid = bids[_tokenId][_bidder];
        require(bid.bidder == _bidder, "Bid does not exist");

        uint256 netBidAmount = bid.amount;  // The net bid amount without the fees
        uint256 buyerFee = bid.buyerFee;    // The buyer fee associated with the bid
        
        // Calculate the seller's fee
        uint256 sellerFee = calculateFee(isSellerMember, netBidAmount, _userSellerFee, _memberSellerFee);
        uint256 sellerReceivable = netBidAmount - sellerFee;  // Amount the seller will receive after deducting the fee

        bid.accepted = true;

        address seller = marketItem.owner;
        // Transfer fees and amounts
        if (commisionAddress == seller) {
            payable(seller).transfer(buyerFee + sellerFee + sellerReceivable);
        } else {
            payable(commisionAddress).transfer(buyerFee + sellerFee);
            payable(seller).transfer(sellerReceivable);
        }
        
        // Transfer the NFT from the owner to the bidder
        safeTransferFrom(marketItem.owner, _bidder, _tokenId);

        // Remove the bid from the bids mapping
        delete bids[_tokenId][_bidder];

        marketItem.owner = payable(_bidder);
        marketItem.seller = payable(_bidder);
        marketItem.putOnSale = false;

        // Emit relevant events
        emit BidAccepted(_tokenId, _bidder, netBidAmount, buyerFee, sellerFee);
        emit MarketItemSold(
            _tokenId,
            marketItem.seller,
            marketItem.owner,
            marketItem.price,
            marketItem.putOnSale,
            marketItem.royaltyBeneficiary
        );
    }

    function withdrawBid(uint256 _tokenId) public {
        Bid storage bid = bids[_tokenId][msg.sender];
        require(bid.bidder == msg.sender, "Only bidder can withdraw the bid");

        uint256 netBidAmount = bid.amount; // The net bid amount without the fees
        uint256 buyerFee = bid.buyerFee;   // The buyer fee associated with the bid

        uint256 totalRefundAmount = netBidAmount + buyerFee; // Total refund amount including the buyer fee
        
        // Reset the bid values
        bid.amount = 0;
        bid.buyerFee = 0;
        bid.accepted = false;

        // Transfer the total refund amount back to the bidder
        payable(msg.sender).transfer(totalRefundAmount);

        // Remove the bid from the bids mapping
        delete bids[_tokenId][msg.sender];
        
        emit BidWithdrawn(_tokenId, msg.sender, netBidAmount, buyerFee);
    }

    function rejectBid(uint256 _tokenId, address _bidder) public {
        MarketItem storage marketItem = idToMarketItem[_tokenId];
        require(_msgSender() == marketItem.owner, "Only the owner can reject bids");

        Bid storage bid = bids[_tokenId][_bidder];
        require(bid.bidder == _bidder, "Bid does not exist");

        uint256 totalRefundAmount = bid.amount + bid.buyerFee;  // Amount to be refunded including the buyer fee

        payable(_bidder).transfer(totalRefundAmount);

        delete bids[_tokenId][_bidder];

        emit BidRejected(_tokenId, _bidder, bid.amount, bid.buyerFee);
    }

    function setAuthorizeAddress(address _address) external onlyAuthorized {
        authorizedAddresses[_address] = true;
    }
    
    function revokeAuthorization(address _address) external onlyAuthorized {
        authorizedAddresses[_address] = false;
    }

    function emitMarketItemSoldEvent(
        uint256 _tokenId,
        MarketItem storage _marketItem
    ) internal {
        emit MarketItemSold(
            _tokenId,
            _marketItem.seller,
            payable(msg.sender),
            _marketItem.price,
            false,
            _marketItem.royaltyBeneficiary
        );
    }

    // function _burn(uint256 tokenId) internal virtual override(ERC721, ERC721URIStorage) {
    //     ERC721URIStorage._burn(tokenId); 
    // }

    function tokenURI(uint256 tokenId) public view virtual override(ERC721, ERC721URIStorage) returns (string memory) {
        return ERC721URIStorage.tokenURI(tokenId);
    }

    function burnToken(uint256 tokenId) public {
        MarketItem storage marketItem = idToMarketItem[tokenId];
        require(marketItem.owner == msg.sender, "Only the owner can burn the token");
        
        burn(tokenId);
        currentSupply--;
        delete idToMarketItem[tokenId];
        emit TokenBurned(tokenId, msg.sender);
    }

    // function burnMultiTokens(uint256[] memory tokenIds) public {
    //     for (uint256 i = 0; i < tokenIds.length; i++) {
    //         burnToken(tokenIds[i]);
    //     }
    // }

    // get total tokens minted
    function getCurrentMinted() public view returns (uint256) {
        return _tokenIds.current();
    }

    function supportsInterface(bytes4 interfaceId) 
        public 
        view 
        virtual 
        override(ERC721, ERC721URIStorage, ERC2981) 
        returns (bool) 
    {
        return ERC721.supportsInterface(interfaceId) 
            || ERC2981.supportsInterface(interfaceId) 
            || super.supportsInterface(interfaceId);
    }

}