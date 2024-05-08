// SPDX-License-Identifier: MIT

pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./CommissionManager.sol";

contract Spozz721Linked is ERC721URIStorage, ReentrancyGuard, CommissionManager {

    string private _customBaseURI;

    mapping(address => bool) public authorizedAddresses;

    struct MarketItem {
        uint256 tokenId;
        address contractAddress;
        address payable seller;
        address payable owner;
        uint256 price;
        bool putOnSale;
        address payable royaltyBeneficiary;
    }

    mapping(address => mapping(uint256 => MarketItem)) public idToMarketItem;

    struct Bid {
        address bidder;
        uint256 amount;
        bool accepted;
        bool placed;
        uint256 buyerFee;
    }

    mapping(address => mapping(uint256 => mapping(address => Bid))) public bids;

    event TokenListed(
        uint256 tokenId,
        address contractAddress,
        address seller,
        address owner,
        uint256 price,
        bool putOnSale,
        address royaltyBeneficiary
    );

    event TokenSold(
        uint256 tokenId,
        address contractAddress,
        address seller,
        address owner,
        uint256 price,
        bool putOnSale,
        address royaltyBeneficiary
    );

    event TokenEdited(
        uint256 tokenId,
        address contractAddress,
        address seller,
        address owner,
        uint256 price,
        bool putOnSale,
        address royaltyBeneficiary
    );

    event TokenTransfered(
        uint256 tokenId,
        address contractAddress,
        address seller,
        address owner,
        uint256 price,
        bool putOnSale,
        address royaltyBeneficiary
    );

    event BidMade(address contractAddress, uint256 tokenId, address bidder, uint256 amount, uint256 buyerFee);
    event BidAccepted(address contractAddress, uint256 indexed tokenId, address indexed bidder, uint256 amount, uint256 buyerFee, uint256 sellerFee);
    event BidWithdrawn(address contractAddress, uint256 indexed tokenId, address indexed bidder, uint256 amount, uint256 buyerFee);
    event BidRejected(address contractAddress, uint256 indexed tokenId, address indexed bidder, uint256 amount, uint256 buyerFee);

    event SellerCommissionTransfered(uint256 indexed tokenId, address indexed fromAddress, uint256 sellerFee);
    event BuyerCommissionTransfered(uint256 indexed tokenId, address indexed fromAddress, uint256 buyerFee);


    event TokenBurned(address contractAddress, uint256 indexed tokenId, address owner);

    modifier onlyAuthorized() override {
            require(authorizedAddresses[msg.sender] || msg.sender == commisionAddress, "only admin or authorized addresses of the marketplace can use it");
        _;
    }

    constructor( string memory name_, string memory symbol_, string memory uri_) ERC721(name_, symbol_) {
        _customBaseURI = uri_;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _customBaseURI;
    }

    function listTokenForSale( address contractAddress, uint256 tokenId, uint256 price, bool putOnSale) public {

        require(price > 0, "Price must be greater than zero");

        IERC721 externalContract = IERC721(contractAddress);
        address tokenOwner;
        address seller;
        try externalContract.ownerOf(tokenId) returns (address _owner) {
            tokenOwner = _owner;
            seller = _owner;
        } catch {
            revert("Token ID does not exist");
        }

        require(tokenOwner == msg.sender, "You must be the token owner to list this token");

        if(putOnSale) {
            externalContract.transferFrom(tokenOwner, address(this), tokenId);
            tokenOwner = address(this);
        }
        
        idToMarketItem[contractAddress][tokenId] = MarketItem(
            tokenId,
            contractAddress,
            payable(seller),
            payable(tokenOwner),
            price,
            putOnSale,
            payable(seller)
        );

        emit TokenListed(tokenId, contractAddress, seller, tokenOwner, price, putOnSale, seller);
    }

    function createMarketSale(
            address contractAddress, 
            uint256 tokenId,
            bool isSellerMember, 
            bool isBuyerMember, 
            uint32 _userSellerFee,
            uint32 _memberSellerFee, 
            uint32 _userBuyerFee, 
            uint32 _memberBuyerFee
    ) public payable nonReentrant {
        MarketItem storage item = idToMarketItem[contractAddress][tokenId];
        IERC721 externalContract = IERC721(contractAddress);

        address tokenOwner;

        try externalContract.ownerOf(tokenId) returns (address _owner) {
            tokenOwner = _owner;
        } catch {
            revert("Token ID does not exist");
        }

        require(item.putOnSale == true, "The token must be for sale");

        uint256 price = item.price;

        uint256 sellerFee = calculateFee(isSellerMember, price, _userSellerFee, _memberSellerFee);
        uint256 buyerFee = calculateFee(isBuyerMember, price, _userBuyerFee, _memberBuyerFee);
        
        require(msg.value == price + buyerFee, "Incorrect payment amount to buy token");

        transferOwnershipAndHandlePayments(externalContract, tokenId, item, sellerFee, buyerFee);
    }

    function transferOwnershipAndHandlePayments(IERC721 externalContract, uint256 tokenId, MarketItem storage item, uint256 sellerFee, uint256 buyerFee) internal {
        address seller = item.seller;

        // Ownership transfer and status update
        externalContract.transferFrom(address(this), msg.sender, tokenId);
        item.owner = payable(msg.sender);
        item.putOnSale = false;
        item.seller = payable(msg.sender);

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

        emit TokenSold(tokenId, item.contractAddress, seller, msg.sender, item.price, item.putOnSale, item.royaltyBeneficiary);
    }

     /* allows owner to edit token price and  putOnSale state */
    function editToken(address contractAddress, uint256 tokenId, uint256 price, bool putOnSale) public payable {
        require(price > 0, "Price must be greater than zero");

        IERC721 externalContract = IERC721(contractAddress);
        address tokenOwner;
        MarketItem storage item = idToMarketItem[contractAddress][tokenId];

        try externalContract.ownerOf(tokenId) returns (address _owner) {
            tokenOwner = _owner;
        } catch {
            revert("Token ID does not exist");
        }

        require(item.seller == msg.sender, "Only item owner can perform this operation");

        if(putOnSale && item.putOnSale == false) {
            externalContract.transferFrom(msg.sender, address(this), tokenId);
            item.owner = payable(address(this));
        }

        if(!putOnSale && item.putOnSale == true) {
            externalContract.transferFrom(address(this), msg.sender, tokenId);
            item.owner = payable(msg.sender);
        }

        item.price = price;
        item.putOnSale = putOnSale;

        emit TokenEdited(tokenId, contractAddress, item.seller, item.owner, price, putOnSale, item.royaltyBeneficiary);

    }

    function transferToken(address contractAddress, uint256 tokenId, address to) public {
         // Make sure the 'to' address is different from the current owner
        require(to != msg.sender, "Enter an address different from yours");

        // Get the external contract
        IERC721 externalContract = IERC721(contractAddress);

        // Recover the item from the mapping
        MarketItem storage item = idToMarketItem[contractAddress][tokenId];
        // Make sure the token exists and the caller is the owner of the token
        require(item.seller == msg.sender, "Only the owner of the token can transfer it");
        if(item.putOnSale) {
            // Transfer the token to the new owner
            externalContract.transferFrom(address(this), to, tokenId);
        } else {
            // Transfer the token to the new owner
            externalContract.transferFrom(msg.sender, to, tokenId);
        }
        
        // Update the item owner and seller in the mapping
        item.owner = payable(to);
        item.seller = payable(to);
        item.putOnSale = false;
        
        // Emit an event
        emit TokenTransfered(tokenId, contractAddress, item.seller, item.owner, item.price, item.putOnSale, item.royaltyBeneficiary);
    }

    function makeBid(
        address contractAddress,
        uint256 _tokenId,
        bool isBuyerMember,
        uint32 _userBuyerFee,
        uint32 _memberBuyerFee,
        uint256 providedBuyerFee
    ) public payable {
        MarketItem storage item = idToMarketItem[contractAddress][_tokenId];
        require(item.putOnSale == true, "Token is not on sale or nonexistent token");
        
        uint256 totalAmount = msg.value; // bid + buyerFee
        require(totalAmount > providedBuyerFee, "The provided total amount should be greater than the buyer's fee.");
        uint256 netBidAmount = totalAmount - providedBuyerFee;

        // Calculate the expected buyerFee based on the net bid amount
        uint256 expectedBuyerFee = calculateFee(isBuyerMember, netBidAmount, _userBuyerFee, _memberBuyerFee);

        // Validate that the provided buyerFee matches the expected buyerFee
        require(providedBuyerFee == expectedBuyerFee, "Provided buyerFee does not match expected buyerFee.");

        if (bids[contractAddress][_tokenId][msg.sender].placed) {
            // Refund the previous bid
            payable(msg.sender).transfer(bids[contractAddress][_tokenId][msg.sender].amount + bids[contractAddress][_tokenId][msg.sender].buyerFee);  // also refund the buyer fee
        }

        Bid memory bid = Bid(msg.sender, netBidAmount, false, true, providedBuyerFee);
        bids[contractAddress][_tokenId][msg.sender] = bid;
        emit BidMade(contractAddress, _tokenId, msg.sender, netBidAmount, providedBuyerFee);
    }

    function acceptBid(
        address contractAddress,
        uint256 _tokenId,
        address _bidder,
        bool isSellerMember,
        uint32 _userSellerFee,
        uint32 _memberSellerFee
    ) public {
        MarketItem storage item = idToMarketItem[contractAddress][_tokenId];
        require(_msgSender() == item.seller, "Only the owner can accept bids");
        // Get the external contract
        IERC721 externalContract = IERC721(contractAddress);

        Bid storage bid = bids[contractAddress][_tokenId][_bidder];
        require(bid.bidder == _bidder, "Bid does not exist");

        uint256 netBidAmount = bid.amount;  // The net bid amount without the fees
        uint256 buyerFee = bid.buyerFee;    // The buyer fee associated with the bid

        // Calculate the seller's fee
        uint256 sellerFee = calculateFee(isSellerMember, netBidAmount, _userSellerFee, _memberSellerFee);
        uint256 sellerReceivable = netBidAmount - sellerFee;  // Amount the seller will receive after deducting the fee

        bid.accepted = true;

        address seller = item.seller;
        if (commisionAddress == seller) {
            payable(seller).transfer(buyerFee + sellerFee + sellerReceivable);
        } else {
            payable(commisionAddress).transfer(buyerFee + sellerFee);
            payable(seller).transfer(sellerReceivable);
        }
        
        externalContract.transferFrom(item.owner, _bidder, item.tokenId);
        delete bids[contractAddress][_tokenId][_bidder];
        
        item.owner = payable(_bidder);
        item.seller = payable(_bidder);
        item.putOnSale = false;
        
        emit BidAccepted(item.contractAddress, _tokenId, _bidder, netBidAmount, buyerFee, sellerFee);
        emit TokenSold(
            _tokenId,
            contractAddress,
            seller,
            item.owner,
            item.price,
            item.putOnSale,
            item.royaltyBeneficiary
        );
    }

    function withdrawBid(address contractAddress, uint256 _tokenId) public {
        Bid storage bid = bids[contractAddress][_tokenId][msg.sender];
        require(bid.bidder == msg.sender, "Only bidder can withdraw the bid");

        uint256 netBidAmount = bid.amount;  // The net bid amount without the fees
        uint256 buyerFee = bid.buyerFee;    // The buyer fee associated with the bid

        uint256 totalRefundAmount = netBidAmount + buyerFee;  // Total refund amount including the buyer fee

        // Reset the bid values
        bid.amount = 0;
        bid.buyerFee = 0;
        bid.accepted = false;
        
        // Transfer the total refund amount back to the bidder
        payable(msg.sender).transfer(totalRefundAmount);

        delete bids[contractAddress][_tokenId][msg.sender];
        emit BidWithdrawn(contractAddress, _tokenId, msg.sender, netBidAmount, buyerFee);
    }

    function rejectBid(address contractAddress, uint256 _tokenId, address _bidder) public {
        MarketItem storage item = idToMarketItem[contractAddress][_tokenId];
        require(_msgSender() == item.seller, "Only the owner can reject bids");

        Bid storage bid = bids[contractAddress][_tokenId][_bidder];
        require(bid.bidder == _bidder, "Bid does not exist");

        uint256 totalRefundAmount = bid.amount + bid.buyerFee;  // Amount to be refunded including the buyer fee

        payable(_bidder).transfer(totalRefundAmount);

        delete bids[contractAddress][_tokenId][_bidder];

        emit BidRejected(contractAddress, _tokenId, _bidder, bid.amount, bid.buyerFee);
    }

    function setAuthorizeAddress(address _address) external onlyAuthorized {
        authorizedAddresses[_address] = true;
    }
    
    function revokeAuthorization(address _address) external onlyAuthorized {
        authorizedAddresses[_address] = false;
    }

    function burnToken(address contractAddress, uint256 tokenId) public {
        MarketItem storage marketItem = idToMarketItem[contractAddress][tokenId];
        // Check if the tokenId exists in the mapping
        require(marketItem.seller != address(0), "Token ID does not exist in the marketplace, token must be listed");
        require(marketItem.seller == msg.sender, "Only the owner can burn the token");

        address deadAddress = 0x000000000000000000000000000000000000dEaD;
        // Get the external contract
        IERC721 externalContract = IERC721(contractAddress);
        if(marketItem.putOnSale) {
            externalContract.transferFrom(marketItem.owner, deadAddress, marketItem.tokenId);
        } else {
            externalContract.transferFrom(marketItem.seller, deadAddress, marketItem.tokenId);
        }

        delete idToMarketItem[contractAddress][tokenId];
        emit TokenBurned(contractAddress, tokenId, msg.sender);
    }

    function burnMultiTokens(address contractAddress, uint256[] memory tokenIds) public {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            burnToken(contractAddress, tokenIds[i]);
        }
    }
}
