// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "./commissionManager.sol";

contract Spozz1155 is ERC1155, ERC1155Supply, IERC1155Receiver, ReentrancyGuard, CommissionManager, ERC2981 {
    string private _name;
    string private _symbol;
    string public _contractURI;

    mapping(address => bool) public authorizedAddresses;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping (address => uint256) private nonces;

    string private _baseURI;
    mapping (uint256 => string) private _tokenURIs;

    struct TokenCopy {
        uint256 tokenId;
        uint256 amount;
        uint256 amount_for_sale;
        address payable seller;
        address payable owner;
        uint256 price;
        address payable royaltyBeneficiary;
        bool putOnSale;
        bytes32 copyId;
        uint256 totalCopiesEmit;
    }

    // Map from tokenId to copyId to TokenCopy
    mapping(uint256 => mapping(bytes32 => TokenCopy)) private _tokenCopies;

    struct Bid {
        address bidder;
        uint256 amount;
        uint256 copyQuantity;
        bool accepted;
        bool placed;
        uint256 buyerFee;
    }

    mapping(uint256 => mapping(bytes32 => mapping(address => Bid))) public bids;

    event MarketItemCreated(
        uint256 indexed tokenId,
        uint256 amount,
        uint256 amount_for_sale,
        address indexed seller,
        address owner,
        uint256 price,
        address payable royaltyBeneficiary,
        bool putOnSale,
        bytes32 indexed copyId,
        uint256 totalCopiesEmit
    );

    event MarketItemSold(
        uint256 indexed tokenId,
        uint256 amount,
        uint256 amount_for_sale,
        address indexed seller,
        address owner,
        uint256 price,
        address payable royaltyBeneficiary,
        bool putOnSale,
        bytes32 indexed copyId,
        uint256 totalCopiesEmit
    );

    event MarketItemTransfer(
        uint256 indexed tokenId,
        uint256 amount,
        uint256 amount_for_sale,
        address indexed seller,
        address owner,
        uint256 price,
        address payable royaltyBeneficiary,
        bool putOnSale,
        bytes32 indexed copyId,
        uint256 totalCopiesEmit
    );

    event BidMade(uint256 indexed tokenId, bytes32 indexed copyId, address indexed bidder, uint256 amount, uint256 copyQuantity, uint256 buyerFee);
    event BidAccepted(uint256 indexed tokenId, bytes32 indexed copyId, address indexed bidder, uint256 amount, uint256 buyerFee, uint256 sellerFee);
    event BidWithdrawn(uint256 indexed tokenId, bytes32 indexed copyId, address indexed bidder, uint256 amount, uint256 buyerFee);
    event BidRejected(uint256 indexed tokenId, bytes32 indexed copyId, address indexed bidder, uint256 amount, uint256 buyerFee);

    event DroperCommissionTransfered(uint256 indexed tokenId, address indexed droperAddress, uint256 droperFee);
    event SellerCommissionTransfered(uint256 indexed tokenId, bytes32 indexed copyId, uint256 amount, address indexed fromAddress, uint256 sellerFee);
    event BuyerCommissionTransfered(uint256 indexed tokenId, bytes32 indexed copyId, uint256 amount, address indexed fromAddress, uint256 buyerFee);

    event TokenTransferred(address indexed from, address indexed to, uint256 tokenId, uint256 amount);

    event TokenBurned(uint256 indexed tokenId, bytes32 indexed copyId, address owner, uint256 quantity);

    modifier onlyAuthorized() override {
            require(authorizedAddresses[msg.sender] || msg.sender == commisionAddress, "only admin or authorized addresses of the marketplace can use it");
        _;
    }

    constructor(
        string memory name_,
        string memory symbol_,
        string memory uri_,
        string memory contractURI_
    ) ERC1155(uri_) {
        _name = name_;
        _symbol = symbol_;
        _baseURI = uri_;
        _contractURI = contractURI_;
    }

    function onERC1155Received(
        address /*operator*/,
        address /*from*/,
        uint256 /*id*/,
        uint256 /*value*/,
        bytes calldata /*data*/
    ) external pure override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address /*operator*/,
        address /*from*/,
        uint256[] calldata /*ids*/,
        uint256[] calldata /*values*/,
        bytes calldata /*data*/
    ) external pure override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    // Create a token and list it or not in the marketplace
    function createToken(
        string memory uri,
        uint256 amount,
        uint256 price,
        address payable royaltyReceiver,
        uint32 royaltyNumerator,
        bool putOnSale,
        address tokenOwner,
        bool isDrop,
        bool isDroperMember,
        uint32 userDropFee,
        uint32 memberDropFee
    ) public payable nonReentrant returns (uint256) {
        require(price > 0, "Price must be greater than 0");
        require(amount > 0, "Amount should be greater than 0");
        require(royaltyNumerator >= 0, "Royalty numerator should be greater than or equal to 0");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        if(tokenOwner == address(0)) {
            tokenOwner = msg.sender;
        }

        if (isDrop) {
            uint256 dropFeeToPay = msg.value; // Payment drop fee from droper
            uint256 totalTokenPrice = price * amount;
            // Calculate the expected droperFee based on the token price and quantity
            uint256 expectedDroperFee = calculateFee(isDroperMember, totalTokenPrice, userDropFee, memberDropFee);

            require(dropFeeToPay == expectedDroperFee, "Provided droper fee is not equal than expected droper fee");

             // Transfer fees
            payable(commisionAddress).transfer(dropFeeToPay);

            emit DroperCommissionTransfered(newTokenId, tokenOwner, expectedDroperFee);
        }
        
        _mint(tokenOwner, newTokenId, amount, "");
        _setTokenURI(newTokenId, uri);
        _setTokenRoyalty(newTokenId, royaltyReceiver, royaltyNumerator);
        createMarketItem(newTokenId, amount, price, royaltyReceiver, putOnSale, tokenOwner);

        return newTokenId;
    }

    function setContractURI(string memory contractURI_) external onlyAuthorized {
        _contractURI = contractURI_;
    }

    function contractURI() public view returns (string memory) {
        return _contractURI;
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(balanceOf(msg.sender, tokenId) > 0);
        _tokenURIs[tokenId] = _tokenURI;
    }

    function tokenURI(uint256 tokenId) public view virtual returns (string memory) {
        require(keccak256(bytes(_tokenURIs[tokenId])) != keccak256(bytes("")));
        return string(abi.encodePacked(_baseURI, _tokenURIs[tokenId]));
    }

    function createMarketItem(
        uint256 tokenId,
        uint256 amount,
        uint256 price,
        address payable royaltyReceiver,
        bool putOnSale,
        address tokenOwner
    ) private {
        // Generate a unique copyId using keccak256
        bytes32 copyId = generateCopyId(tokenId, tokenOwner);

        _tokenCopies[tokenId][copyId] = TokenCopy(
            tokenId,
            amount,
            amount,
            payable(tokenOwner),
            payable(tokenOwner),
            price,
            royaltyReceiver,
            putOnSale,
            copyId,
            amount
        );

        // Emit MarketItemCreated event
        emit MarketItemCreated(
            tokenId,
            amount,
            amount,
            tokenOwner,
            tokenOwner,
            price,
            royaltyReceiver,
            putOnSale,
            copyId,
            amount
        );
        
    }

    function generateCopyId(uint256 tokenId, address seller) private returns (bytes32) {
        uint256 nonce = nonces[seller];
        nonces[seller]++;
        string memory newCopyId = string(abi.encodePacked(tokenId, "-", seller, "-", nonce));
        bytes32 newCopyIdToByte = keccak256(bytes(newCopyId));
        return newCopyIdToByte;
    }

    function editToken(uint256 tokenId, bytes32 copyId, uint256 newPrice, uint256 amountForSale, bool putOnSale) public {
        require(_tokenCopies[tokenId][copyId].owner == msg.sender, "Only the owner can resell his token");
        require(balanceOf(msg.sender, tokenId) >= amountForSale, "Not enough tokens to resell");
        require(newPrice > 0, "Price should be greater than 0");

        TokenCopy storage tokenCopy = _tokenCopies[tokenId][copyId];

        tokenCopy.putOnSale = putOnSale;
        tokenCopy.seller = payable(msg.sender);
        tokenCopy.price = newPrice;
        tokenCopy.amount_for_sale = amountForSale;
        

        emit MarketItemSold(
            tokenId,
            tokenCopy.amount,
            tokenCopy.amount_for_sale,
            msg.sender,
            msg.sender,
            newPrice,
            tokenCopy.royaltyBeneficiary,
            tokenCopy.putOnSale,
            copyId,
            tokenCopy.totalCopiesEmit
        );

    }

    // Creates the sale of a marketplace item
    function createMarketSale(
        uint256 tokenId, 
        bytes32 copyId, 
        uint256 amount,
        bool isSellerMember, 
        bool isBuyerMember, 
        uint32 _userSellerFee,
        uint32 _memberSellerFee, 
        uint32 _userBuyerFee, 
        uint32 _memberBuyerFee
    ) 
        public 
        payable 
        nonReentrant 
    {
        TokenCopy storage tokenCopy = _tokenCopies[tokenId][copyId];
        validateSale(tokenCopy, tokenId, copyId, amount);

        (uint256 totalPricePerCopyPlusRoyalties, uint256 royaltyAmountPerCopy) = getPrices(tokenId, tokenCopy.price);
        uint256 totalAmountWithoutRoyalties = tokenCopy.price * amount;
        uint256 totalPrice = totalPricePerCopyPlusRoyalties * amount;

        uint256 sellerFee = calculateFee(isSellerMember, totalAmountWithoutRoyalties, _userSellerFee, _memberSellerFee);
        uint256 buyerFee = calculateFee(isBuyerMember, totalAmountWithoutRoyalties, _userBuyerFee, _memberBuyerFee);

        requireTotalPayment(totalPrice, buyerFee);

        handleTransactions(tokenCopy, amount, buyerFee, sellerFee, royaltyAmountPerCopy);
    }

    function handleTransactions(TokenCopy storage tokenCopy, uint256 amount, uint256 buyerFee, uint256 sellerFee, uint256 royaltyAmountPerCopy) internal {
        transferFees(tokenCopy.tokenId, tokenCopy.copyId, amount, tokenCopy, buyerFee, sellerFee);
        handleTokenAmount(tokenCopy.tokenId, tokenCopy.copyId, amount, tokenCopy);
        _safeTransferFrom(tokenCopy.seller, msg.sender, tokenCopy.tokenId, amount, "");

        address payable royaltyBeneficiary = tokenCopy.royaltyBeneficiary;
        if (royaltyAmountPerCopy > 0) {
            royaltyBeneficiary.transfer(royaltyAmountPerCopy * amount);
        }
    }

    function requireTotalPayment(uint256 totalPrice, uint256 buyerFee) internal {
        uint256 totalPayment = totalPrice + buyerFee;
        require(
            msg.value == totalPayment,
            "Please submit total payment in order to complete the purchase"
        );
    }

    function transferFees(uint256 tokenId, bytes32 copyId, uint256 amount, TokenCopy storage tokenCopy, uint256 buyerFee, uint256 sellerFee) internal {
        address seller = tokenCopy.seller;

        uint256 sellerReceivable = tokenCopy.price * amount - sellerFee;

        if (commisionAddress == seller) {
            payable(seller).transfer(buyerFee + sellerFee + sellerReceivable);
        } else {
            uint256 totalFees = buyerFee + sellerFee;
            payable(commisionAddress).transfer(totalFees);
            payable(seller).transfer(sellerReceivable);
        }

        emit SellerCommissionTransfered(tokenId, copyId, amount, msg.sender, sellerFee);
        emit BuyerCommissionTransfered(tokenId, copyId, amount, msg.sender, buyerFee);
    }

    function handleTokenAmount(uint256 tokenId, bytes32 copyId, uint256 amount, TokenCopy storage tokenCopy) internal {
        if(tokenCopy.amount == amount && tokenCopy.amount_for_sale == amount) {
            tokenCopy.owner = payable(msg.sender);
            tokenCopy.putOnSale = false;
            tokenCopy.amount_for_sale = 0;

            emitMarketItemSoldEvent(tokenId, amount, copyId, tokenCopy);
        } else {
            tokenCopy.amount -= amount;
            tokenCopy.amount_for_sale -= amount;
            bytes32 newCopyId = generateCopyId(tokenId, msg.sender);

            _tokenCopies[tokenId][newCopyId] = TokenCopy(
                tokenId,
                amount,
                0,
                tokenCopy.seller,
                payable(msg.sender),
                tokenCopy.price,
                tokenCopy.royaltyBeneficiary,
                false,
                newCopyId,
                tokenCopy.totalCopiesEmit
            );

            emitMarketItemCreatedEvent(tokenId, amount, newCopyId, tokenCopy);
        }
    }

    function validateSale(TokenCopy storage tokenCopy, uint256 tokenId, bytes32 copyId, uint256 amount) internal view {
        require(tokenCopy.putOnSale, "token not for sale");
        require(tokenCopy.tokenId == tokenId, "token doesn't exist");
        require(tokenCopy.copyId == copyId, "token copy doesn't exist");
        require(tokenCopy.amount >= amount && amount > 0, "Amount should be greater than 0");
        require(tokenCopy.amount_for_sale >= amount, "amount for sale should be greater or equal than amount you want buy");
        require(tokenCopy.owner != msg.sender, "You are the owner token");
    }

    function emitMarketItemSoldEvent(
        uint256 _tokenId, 
        uint256 _amount, 
        bytes32 _copyId, 
        TokenCopy storage _tokenCopy
    ) internal {
        emit MarketItemSold(
            _tokenId,
            _amount,
            _amount,
            _tokenCopy.seller,
            payable(msg.sender),
            _tokenCopy.price,
            _tokenCopy.royaltyBeneficiary,
            false,
            _copyId,
            _tokenCopy.totalCopiesEmit
        );
    }

    function emitMarketItemCreatedEvent(
        uint256 _tokenId, 
        uint256 _amount, 
        bytes32 _newCopyId, 
        TokenCopy storage _tokenCopy
    ) internal {
        emit MarketItemCreated(
            _tokenId,
            _amount,
            0,
            _tokenCopy.seller,
            payable(msg.sender),
            _tokenCopy.price,
            _tokenCopy.royaltyBeneficiary,
            false,
            _newCopyId,
            _tokenCopy.totalCopiesEmit
        );
    }

    function getPrices(uint256 tokenId, uint256 price) public view returns (uint256 totalPricePerCopyPlusRoyalties, uint256 royaltyAmountPerCopy) {
        (, royaltyAmountPerCopy) = royaltyInfo(tokenId, price);
        totalPricePerCopyPlusRoyalties = price + royaltyAmountPerCopy;
    }

    // function _beforeTokenTransfer(
    //     address operator,
    //     address from,
    //     address to,
    //     uint256[] memory ids,
    //     uint256[] memory amounts,
    //     bytes memory data
    // ) internal virtual override(ERC1155, ERC1155Supply) {
    //     super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    // }

    function _update(address from, address to, uint256[] memory ids, uint256[] memory values) internal override(ERC1155, ERC1155Supply) {
        super._update(from, to, ids, values);
        // Additional logic if necessary
    }

    function transferTokens(address to, uint256 tokenId, bytes32 copyId, uint256 amount) public {
        require(_tokenCopies[tokenId][copyId].tokenId == tokenId, "token doesn't exist");
        require(_tokenCopies[tokenId][copyId].copyId == copyId, "token copi doesn't exist");
        require(balanceOf(msg.sender, tokenId) >= amount, "Not enough tokens to transfer");
        require(amount > 0, "Amount should be greater than 0");
        require(_tokenCopies[tokenId][copyId].owner == msg.sender, "You must be the owner of the token");
        if(_tokenCopies[tokenId][copyId].amount == amount ) {

            _tokenCopies[tokenId][copyId].owner = payable(to);
            _tokenCopies[tokenId][copyId].seller = payable(to);

            emit MarketItemTransfer(
                tokenId,
                amount,
                0,
                payable(to),
                payable(to),
                _tokenCopies[tokenId][copyId].price,
                _tokenCopies[tokenId][copyId].royaltyBeneficiary,
                false,
                copyId,
                _tokenCopies[tokenId][copyId].totalCopiesEmit
            );

        } else {
            _tokenCopies[tokenId][copyId].amount -= amount;
            _tokenCopies[tokenId][copyId].amount_for_sale = 0;
            _tokenCopies[tokenId][copyId].putOnSale = false;
            // Generate a unique copyId using keccak256
            bytes32 newCopyId = generateCopyId(tokenId, msg.sender);

            _tokenCopies[tokenId][newCopyId] = TokenCopy(
                tokenId,
                amount,
                0,
                payable(to),
                payable(to),
                _tokenCopies[tokenId][copyId].price,
                _tokenCopies[tokenId][copyId].royaltyBeneficiary,
                false,
                newCopyId,
                _tokenCopies[tokenId][copyId].totalCopiesEmit
            );

            emit MarketItemTransfer(
                tokenId,
                amount,
                0,
                payable(to),
                payable(to),
                _tokenCopies[tokenId][copyId].price,
                _tokenCopies[tokenId][copyId].royaltyBeneficiary,
                false,
                newCopyId,
                _tokenCopies[tokenId][copyId].totalCopiesEmit
            );
        }
        _safeTransferFrom(msg.sender, to, tokenId, amount, "");
        emit TokenTransferred(msg.sender, to, tokenId, amount);
    }

    /**
     * @notice Allows a user to make a bid on a specific token copy
     * @param tokenId The ID of the token
     * @param copyId The ID of the specific copy of the token
     * @param copyQuantity The quantity of copies being bid on
     */
    function makeBid(
        uint256 tokenId,
        bytes32 copyId,
        uint256 copyQuantity,
        bool isBuyerMember,
        uint32 _userBuyerFee,
        uint32 _memberBuyerFee,
        uint256 providedBuyerFee
    ) public payable nonReentrant  {
        require(_tokenCopies[tokenId][copyId].tokenId == tokenId, "Token doesn't exist");
        require(_tokenCopies[tokenId][copyId].copyId == copyId, "Token copy doesn't exist");
        require(_tokenCopies[tokenId][copyId].putOnSale == true, "Token not for sale");
        require(copyQuantity > 0, "copy quantity amount should be greater than 0");
        require(copyQuantity <= _tokenCopies[tokenId][copyId].amount_for_sale, "Select less quantity to bid");
        require(msg.sender != _tokenCopies[tokenId][copyId].owner, "Owner cannot bid on their own token");

        uint256 totalAmount = msg.value; // bid + buyerFee
        require(totalAmount > providedBuyerFee, "The provided total amount should be greater than the buyer's fee.");
        uint256 netBidAmount = totalAmount - providedBuyerFee;

        // Calculate the expected buyerFee based on the net bid amount
        uint256 expectedBuyerFee = calculateFee(isBuyerMember, netBidAmount, _userBuyerFee, _memberBuyerFee);

        // Validate that the provided buyerFee matches the expected buyerFee
        require(providedBuyerFee == expectedBuyerFee, "Provided buyerFee does not match expected buyerFee.");

        if (bids[tokenId][copyId][msg.sender].placed) {
            // Refund the previous bid including the buyer fee if any
            payable(msg.sender).transfer(bids[tokenId][copyId][msg.sender].amount + bids[tokenId][copyId][msg.sender].buyerFee);
        }
        
        Bid memory bid = Bid(msg.sender, netBidAmount, copyQuantity, false, true, providedBuyerFee);

        bids[tokenId][copyId][msg.sender] = bid;

        emit BidMade(tokenId, copyId, msg.sender, netBidAmount, copyQuantity, providedBuyerFee);
    }

    function acceptBid(
        uint256 tokenId,
        bytes32 copyId,
        address bidder,
        bool isSellerMember,
        uint32 _userSellerFee,
        uint32 _memberSellerFee
    ) public nonReentrant {
        TokenCopy storage tokenCopy = _tokenCopies[tokenId][copyId];
        require(msg.sender == tokenCopy.owner, "Only the owner can accept bids");

        Bid storage bid = bids[tokenId][copyId][bidder];
        validateBid(bid, bidder, tokenCopy);

        uint256 netBidAmount = bid.amount;  // The net bid amount without the fees
        uint256 buyerFee = bid.buyerFee;    // The buyer fee associated with the bid
        
        // Calculate the seller's fee
        uint256 sellerFee = calculateFee(isSellerMember, netBidAmount, _userSellerFee, _memberSellerFee);
        uint256 sellerReceivable = netBidAmount - sellerFee;  // Amount the seller will receive after deducting the fee

        bid.accepted = true;

        // Transfer fees and amounts based on who the contract owner is
        if (commisionAddress == tokenCopy.owner) {
            payable(tokenCopy.owner).transfer(buyerFee + sellerFee + sellerReceivable);
        } else {
            payable(commisionAddress).transfer(buyerFee + sellerFee);
            payable(tokenCopy.owner).transfer(sellerReceivable);
        }

        // Transfer the tokens to the bidder
        _safeTransferFrom(tokenCopy.owner, bidder, tokenId, bid.copyQuantity, "");

        handleCopyManagement(tokenId, tokenCopy, bid, bidder);

        delete bids[tokenId][copyId][bidder];

        emit BidAccepted(tokenId, copyId, bidder, netBidAmount, buyerFee, sellerFee); 
        emit MarketItemSold(
            tokenId,
            bid.copyQuantity,
            tokenCopy.amount_for_sale,
            tokenCopy.seller,
            payable(bidder),
            tokenCopy.price,
            tokenCopy.royaltyBeneficiary,
            tokenCopy.putOnSale,
            copyId,
            tokenCopy.totalCopiesEmit
        );
    }

    function validateBid(Bid memory bid, address bidder, TokenCopy memory tokenCopy) internal pure {
        require(bid.bidder == bidder, "Bid does not exist");
        require(bid.placed, "Bid was not placed");
        require(bid.copyQuantity <= tokenCopy.amount_for_sale, "Bid quantity greater than available for sale");
    }

    function handleCopyManagement(uint256 tokenId, TokenCopy storage tokenCopy, Bid memory bid, address bidder) internal {
        if(tokenCopy.amount == bid.copyQuantity && tokenCopy.amount_for_sale == bid.copyQuantity) {
            tokenCopy.owner = payable(bidder);
            tokenCopy.putOnSale = false;
            tokenCopy.amount_for_sale = 0;
        } else {
            tokenCopy.amount -= bid.copyQuantity;
            tokenCopy.amount_for_sale -= bid.copyQuantity;

            // Generate a unique copyId using keccak256
            bytes32 newCopyId = generateCopyId(tokenId, bidder);

            _tokenCopies[tokenId][newCopyId] = TokenCopy(
                tokenId,
                bid.copyQuantity,
                0,
                tokenCopy.seller,
                payable(bidder),
                tokenCopy.price,
                tokenCopy.royaltyBeneficiary,
                false,
                newCopyId,
                tokenCopy.totalCopiesEmit
            );

            emit MarketItemCreated(
                tokenId,
                bid.copyQuantity,
                0,
                tokenCopy.seller,
                payable(bidder),
                tokenCopy.price,
                tokenCopy.royaltyBeneficiary,
                false,
                newCopyId,
                tokenCopy.totalCopiesEmit
            );
        }
    }

    function withdrawBid(uint256 tokenId, bytes32 copyId) public {
        Bid storage bid = bids[tokenId][copyId][msg.sender];
        require(bid.bidder == msg.sender, "Only bidder can withdraw the bid");
        require(!bid.accepted, "Bid has already been accepted");

        uint256 netBidAmount = bid.amount; // The net bid amount without the fees
        uint256 buyerFee = bid.buyerFee;   // The buyer fee associated with the bid

        uint256 totalRefundAmount = netBidAmount + buyerFee; // Total refund amount including the buyer fee
        
        // Reset the bid values
        bid.amount = 0;
        bid.buyerFee = 0;
        bid.accepted = false;
        bid.placed = false; // Assuming the "placed" flag indicates if a bid has been made.

        // Transfer the total refund amount back to the bidder
        payable(msg.sender).transfer(totalRefundAmount);

        // Delete the withdrawn bid from the bids mapping
        delete bids[tokenId][copyId][msg.sender];
        
        emit BidWithdrawn(tokenId, copyId, msg.sender, netBidAmount, buyerFee);
    }

    function rejectBid(uint256 tokenId, bytes32 copyId, address bidder) public {
        TokenCopy storage tokenCopy = _tokenCopies[tokenId][copyId];
        require(msg.sender == tokenCopy.owner, "Only the owner can reject bids");

        Bid storage bid = bids[tokenId][copyId][bidder];
        require(bid.bidder == bidder, "Bid does not exist");

        uint256 totalRefundAmount = bid.amount + bid.buyerFee;  // Amount to be refunded including the buyer fee

        payable(bidder).transfer(totalRefundAmount);

        // Delete the rejected bid
        delete bids[tokenId][copyId][bidder];

        emit BidRejected(tokenId, copyId, bidder, bid.amount, bid.buyerFee);
    }

    function name() external view returns (string memory) {
        return _name;
    }

    function symbol() external view returns (string memory) {
        return _symbol;
    }

    function setAuthorizeAddress(address _address) external onlyAuthorized {
        authorizedAddresses[_address] = true;
    }
    
    function revokeAuthorization(address _address) external onlyAuthorized {
        authorizedAddresses[_address] = false;
    }

    function updateTokenRecords(uint256 tokenId, bytes32 copyId, uint256 quantity) internal {
        TokenCopy storage tokenCopy = _tokenCopies[tokenId][copyId];
        
        if (balanceOf(msg.sender, tokenId) == 0) {
            delete _tokenCopies[tokenId][copyId];
        } else {
            tokenCopy.amount -= quantity;
            if(tokenCopy.putOnSale) {
                tokenCopy.amount_for_sale -= quantity;
            }
        }

        emit TokenBurned(tokenId, copyId, msg.sender, quantity);
    }

    function burnToken(uint256 tokenId, bytes32 copyId, uint256 quantity) public {
        TokenCopy storage tokenCopy = _tokenCopies[tokenId][copyId];
        require(tokenCopy.owner == msg.sender, "Only the owner can burn the token");
        require(quantity <= balanceOf(msg.sender, tokenId), "Cannot burn more tokens than you own");

        _burn(msg.sender, tokenId, quantity);
        
        updateTokenRecords(tokenId, copyId, quantity);
    }

    function burnMultiTokens(
        uint256[] memory tokenIds,
        bytes32[] memory copyIds,
        uint256[] memory quantities
    ) public {
        require(tokenIds.length == copyIds.length && tokenIds.length == quantities.length, "Input arrays must have the same length");

        for (uint256 i = 0; i < tokenIds.length; i++) {
            TokenCopy storage tokenCopy = _tokenCopies[tokenIds[i]][copyIds[i]];
            require(tokenCopy.owner == msg.sender, "Only the owner can burn the token");
            require(quantities[i] <= balanceOf(msg.sender, tokenIds[i]), "Cannot burn more tokens than you own");
        }

        _burnBatch(msg.sender, tokenIds, quantities);

        for (uint256 i = 0; i < tokenIds.length; i++) {
            updateTokenRecords(tokenIds[i], copyIds[i], quantities[i]);
        }
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, ERC2981, IERC165) returns (bool) 
    {
        return super.supportsInterface(interfaceId);
    }

}