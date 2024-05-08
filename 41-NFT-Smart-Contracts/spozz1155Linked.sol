// SPDX-License-Identifier: MIT

pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./commissionManager.sol";

contract Spozz1155Linked is ERC1155, IERC1155Receiver, ReentrancyGuard, CommissionManager {
    string private _name;
    string private _symbol;
    string private _baseURI;

    mapping(address => bool) public authorizedAddresses;

    mapping (address => uint256) private nonces;

    struct TokenCopy {
        uint256 id;
        uint256 amount;
        uint256 amount_for_sale;
        address contractAddress;
        address payable seller;
        address payable owner;
        uint256 price;
        address payable royaltyBeneficiary;
        bool putOnSale;
        bytes32 copyId;
        uint256 totalBalance;
    }


    mapping(address => mapping(uint256 => mapping(bytes32 => TokenCopy))) private _tokenCopies;

    struct Bid {
        address bidder;
        uint256 amount;
        uint256 copyQuantity;
        bool accepted;
        bool placed;
        uint256 buyerFee;
    }

    mapping(address => mapping(uint256 => mapping(bytes32 => mapping(address => Bid)))) public bids;

    event TokenListed(
        uint256 indexed id,
        uint256 amount,
        uint256 amount_for_sale,
        address contractAddress,
        address indexed seller,
        address owner,
        uint256 price,
        address payable royaltyBeneficiary,
        bool putOnSale,
        bytes32 indexed copyId,
        uint256 totalBalance
    );

    event TokenSold(
        uint256 indexed id,
        uint256 amount,
        uint256 amount_for_sale,
        address contractAddress,
        address indexed seller,
        address owner,
        uint256 price,
        address payable royaltyBeneficiary,
        bool putOnSale,
        bytes32 indexed copyId,
        uint256 totalBalance
    );

    event TokenEdited(
        uint256 indexed id,
        uint256 amount,
        uint256 amount_for_sale,
        address contractAddress,
        address indexed seller,
        address owner,
        uint256 price,
        address payable royaltyBeneficiary,
        bool putOnSale,
        bytes32 indexed copyId,
        uint256 totalBalance
    );

    event TokenTransfered(
        uint256 indexed id,
        uint256 amount,
        uint256 amount_for_sale,
        address contractAddress,
        address indexed seller,
        address owner,
        uint256 price,
        address payable royaltyBeneficiary,
        bool putOnSale,
        bytes32 indexed copyId,
        uint256 totalBalance
    );

    event TokenCopyCreated(
        uint256 indexed id,
        uint256 amount,
        uint256 amount_for_sale,
        address contractAddress,
        address indexed seller,
        address owner,
        uint256 price,
        address payable royaltyBeneficiary,
        bool putOnSale,
        bytes32 indexed copyId,
        uint256 totalBalance
    );

    event BidMade(
        address indexed contractAddress,
        uint256 tokenId,
        bytes32 copyId,
        address indexed bidder,
        uint256 amount,
        uint256 copyQuantity,
        uint256 buyerFee
    );
    event BidAccepted(
        address indexed contractAddress,
        uint256 tokenId, bytes32 copyId,
        address indexed bidder,
        uint256 amount,
        uint256 buyerFee,
        uint256 sellerFee
    );
    event BidWithdrawn(address indexed contractAddress, uint256 tokenId, bytes32 copyId, address indexed bidder, uint256 amount, uint256 buyerFee);
    event BidRejected(address indexed contractAddress, uint256 tokenId, bytes32 copyId, address indexed bidder, uint256 amount, uint256 buyerFee);


    event SellerCommissionTransfered(address indexed contractAddress, uint256 indexed tokenId, bytes32 indexed copyId, uint256 amount, address fromAddress, uint256 sellerFee);
    event BuyerCommissionTransfered(address indexed contractAddress, uint256 indexed tokenId, bytes32 indexed copyId, uint256 amount, address fromAddress, uint256 buyerFee);

    event TokenBurned(address indexed contractAddress, uint256 indexed tokenId, bytes32 indexed copyId, address owner, uint256 quantity);

    modifier onlyAuthorized() override {
            require(authorizedAddresses[msg.sender] || msg.sender == commisionAddress, "only admin or authorized addresses of the marketplace can use it");
        _;
    }

    constructor(string memory name_, string memory symbol_, string memory uri_) ERC1155(uri_) {
        _name = name_;
        _symbol = symbol_;
        _baseURI = uri_;
    }

    function listTokenForSale(address contractAddress, uint256 tokenId, uint256 price, uint256 amount, bool putOnSale) public {
        require(price > 0, "Price must be greater than zero");

        IERC1155 externalContract = IERC1155(contractAddress);
        address tokenOwner = msg.sender;
        uint256 balance = externalContract.balanceOf(msg.sender, tokenId);

        require(balance >= amount, "You must have enough token amount to list this token");

        if(putOnSale) {
            externalContract.safeTransferFrom(tokenOwner, address(this), tokenId, amount, "");
            tokenOwner = address(this);
        }

        // Generate a unique copyId
        bytes32 copyId = generateCopyId(tokenId, msg.sender);

        uint256 totalBalance = balance;

        _tokenCopies[contractAddress][tokenId][copyId] = TokenCopy(
            tokenId,
            amount,
            amount,
            contractAddress,
            payable(msg.sender),
            payable(tokenOwner),
            price,
            payable(msg.sender),
            putOnSale,
            copyId,
            totalBalance
        );

        emit TokenListed(tokenId, amount, amount, contractAddress, msg.sender, tokenOwner, price, payable(msg.sender), putOnSale, copyId, totalBalance);

    }

    function createMarketSale(
        address contractAddress,
        uint256 tokenId,
        bytes32 copyId,
        uint256 amount,
        bool isSellerMember, 
        bool isBuyerMember, 
        uint32 _userSellerFee,
        uint32 _memberSellerFee, 
        uint32 _userBuyerFee, 
        uint32 _memberBuyerFee
    ) public payable nonReentrant  {
        // Get the TokenCopy data structure
        TokenCopy storage tokenCopy = _tokenCopies[contractAddress][tokenId][copyId];
        validateSale(tokenCopy, copyId, amount);

        // Calculate the total price
        uint256 tokenTotalPrice = tokenCopy.price * amount;

        uint256 sellerFee = calculateFee(isSellerMember, tokenTotalPrice, _userSellerFee, _memberSellerFee);
        uint256 buyerFee = calculateFee(isBuyerMember, tokenTotalPrice, _userBuyerFee, _memberBuyerFee);

        uint256 totalPayment = tokenTotalPrice + buyerFee;

        // Check if the sent payment is correct
        require(msg.value == totalPayment, "Incorrect payment amount to buy token");

        handleTransactions(tokenCopy, amount, buyerFee, sellerFee);
    }

    function validateSale(TokenCopy storage tokenCopy, bytes32 copyId, uint256 amount) internal view {
        // Verify if the Token has already been listed or created
        require(tokenCopy.copyId == copyId, "Token has not been listed or created yet");

        // Check if the token is for sale
        require(tokenCopy.putOnSale == true, "Token not for sale");

        // Check that the buyer is not the owner
        require(tokenCopy.seller != msg.sender, "You are the owner of the token");

        // Check if there is enough quantity for sale
        require(tokenCopy.amount_for_sale >= amount && amount > 0, "Insufficient quantity for sale");
    }

    function transferFees(uint256 amount, TokenCopy storage tokenCopy, uint256 buyerFee, uint256 sellerFee) internal {
        address seller = tokenCopy.seller;

        uint256 sellerReceivable = tokenCopy.price * amount - sellerFee;

        // Check if owner of the contract is also the seller
        if (commisionAddress == seller) {
            payable(seller).transfer(buyerFee + sellerFee + sellerReceivable);
        } else {
            // owner receives both the buyerFee and the sellerFee
            uint256 totalFees = buyerFee + sellerFee;
            payable(commisionAddress).transfer(totalFees);
            payable(seller).transfer(sellerReceivable);
        }

        emit SellerCommissionTransfered(tokenCopy.contractAddress, tokenCopy.id, tokenCopy.copyId, amount, msg.sender, sellerFee);
        emit BuyerCommissionTransfered(tokenCopy.contractAddress, tokenCopy.id, tokenCopy.copyId, amount, msg.sender, buyerFee);
    }

    function handleTransactions(TokenCopy storage tokenCopy, uint256 amount, uint256 buyerFee, uint256 sellerFee) internal {
        transferFees(amount, tokenCopy, buyerFee, sellerFee);
        handleTokenAmount(tokenCopy.id, tokenCopy.copyId, amount, tokenCopy);
        
        IERC1155 externalContract = IERC1155(tokenCopy.contractAddress);
        // Transfer the tokens to the buyer
        externalContract.safeTransferFrom(address(this), msg.sender, tokenCopy.id, amount, "");
    }

    function handleTokenAmount(uint256 tokenId, bytes32 copyId, uint256 amount, TokenCopy storage tokenCopy) internal {
        // Verify if the purchased quantity is equal to the total quantity
        if(tokenCopy.amount == amount && tokenCopy.amount_for_sale == amount) {
            tokenCopy.seller = payable(msg.sender);
            tokenCopy.owner = payable(msg.sender);
            tokenCopy.putOnSale = false;
            tokenCopy.amount_for_sale = 0;

            emit TokenSold(
                tokenId,
                amount,
                amount,
                tokenCopy.contractAddress,
                tokenCopy.seller,
                tokenCopy.owner,
                tokenCopy.price,
                tokenCopy.royaltyBeneficiary,
                false,
                copyId,
                tokenCopy.totalBalance
            );
        } else {
            tokenCopy.amount -= amount;
            tokenCopy.amount_for_sale -= amount;
            // Generate a new copy of the token
            bytes32 newCopyId = generateCopyId(tokenId, msg.sender);
            
            _tokenCopies[tokenCopy.contractAddress][tokenId][newCopyId] = TokenCopy(
                tokenId,
                amount,
                0,
                tokenCopy.contractAddress,
                payable(msg.sender),
                payable(msg.sender),
                tokenCopy.price,
                tokenCopy.royaltyBeneficiary,
                false,
                newCopyId,
                tokenCopy.totalBalance
            );

            emit TokenCopyCreated(
                tokenId,
                amount,
                0,
                tokenCopy.contractAddress,
                msg.sender,
                msg.sender,
                tokenCopy.price,
                tokenCopy.royaltyBeneficiary,
                false,
                newCopyId,
                tokenCopy.totalBalance
            );
        }
    }

    function editToken(address contractAddress, uint256 tokenId, bytes32 copyId, uint256 newPrice, uint256 amountForSale, bool putOnSale) public {
        // Get the TokenCopy data structure
        TokenCopy storage tokenCopy = _tokenCopies[contractAddress][tokenId][copyId];

        // Verify if the Token has already been listed or created
        require(tokenCopy.copyId == copyId, "Token has not been listed or created yet");

        // Verify token owner
        require(tokenCopy.seller == msg.sender, "Only token owner can perform this operation");

        // Price must be greater than 0
        require(newPrice > 0, "Price must be greater than zero");

        // Check if there is enough quantity to resell
        require(tokenCopy.amount >= amountForSale, "Not enough tokens to resell");

        IERC1155 externalContract = IERC1155(contractAddress);

        if(putOnSale && tokenCopy.putOnSale == false) {
            // Transfer the token to this contract
            externalContract.safeTransferFrom(msg.sender, address(this), tokenId, amountForSale, "");
            tokenCopy.seller = payable(msg.sender);
            tokenCopy.owner = payable(address(this));
        } 
        
        if(!putOnSale && tokenCopy.putOnSale == true) {
            // Transfer the token back to the original owner
            externalContract.safeTransferFrom(address(this), msg.sender, tokenId, amountForSale, "");
            tokenCopy.owner = payable(msg.sender);
        }

        // Update the price, amount for sale, and sale status
        tokenCopy.price = newPrice;
        tokenCopy.amount_for_sale = amountForSale;
        tokenCopy.putOnSale = putOnSale;

        // Emit the TokenEdited event
        emit TokenEdited(tokenId, amountForSale, amountForSale, contractAddress, tokenCopy.seller, tokenCopy.owner, newPrice, tokenCopy.royaltyBeneficiary, putOnSale, copyId, tokenCopy.totalBalance);
    }

    function transferTokens(address contractAddress, address to, uint256 tokenId, bytes32 copyId, uint256 amount) public {
        // Get the TokenCopy data structure
        TokenCopy storage tokenCopy = _tokenCopies[contractAddress][tokenId][copyId];

        // Verify if the Token has already been listed or created
        require(tokenCopy.copyId == copyId, "Token copy doesn't exist");

        IERC1155 externalContract = IERC1155(contractAddress);
        uint256 balance = 0;

        // Amount should be greater than 0
        require(amount > 0, "Amount should be greater than 0");

        // Make sure the token exists and the caller is the owner of the token
        require(tokenCopy.seller == msg.sender, "Only the owner of the token can transfer it");

        if(tokenCopy.putOnSale) {
             // Check if the caller has enough tokens to transfer
            balance = externalContract.balanceOf(address(this), tokenId);
            require(balance >= amount, "Not enough tokens to transfer");
            // Transfer the token to the new owner
            externalContract.safeTransferFrom(address(this), to, tokenId, amount, "");
        } else {
             // Check if the caller has enough tokens to transfer
            balance = externalContract.balanceOf(msg.sender, tokenId);
            require(balance >= amount, "Not enough tokens to transfer");
            // Transfer the token to the new owner
            externalContract.safeTransferFrom(msg.sender, to, tokenId, amount, "");
        }

        if(tokenCopy.amount == amount ) {
            tokenCopy.owner = payable(to);
            tokenCopy.seller = payable(to);

            emit TokenTransfered(
                tokenId,
                amount,
                0,
                contractAddress,
                payable(to),
                payable(to),
                tokenCopy.price,
                tokenCopy.royaltyBeneficiary,
                false,
                copyId,
                tokenCopy.totalBalance
            );
        } else {
            tokenCopy.amount -= amount;
            tokenCopy.amount_for_sale = 0;
            tokenCopy.putOnSale = false;

            // Generate a new copy of the token
            bytes32 newCopyId = generateCopyId(tokenId, msg.sender);
            
            _tokenCopies[contractAddress][tokenId][newCopyId] = TokenCopy(
                tokenId,
                amount,
                0,
                contractAddress,
                payable(to),
                payable(to),
                tokenCopy.price,
                tokenCopy.royaltyBeneficiary,
                false,
                newCopyId,
                tokenCopy.totalBalance
            );

            emit TokenTransfered(
                tokenId,
                amount,
                0,
                contractAddress,
                payable(to),
                payable(to),
                tokenCopy.price,
                tokenCopy.royaltyBeneficiary,
                false,
                newCopyId,
                tokenCopy.totalBalance
            );
        }
    }

    function generateCopyId(uint256 tokenId, address seller) private returns (bytes32) {
        uint256 nonce = nonces[seller];
        nonces[seller]++;
        string memory newCopyId = string(abi.encodePacked(tokenId, "-", seller, "-", nonce));
        bytes32 newCopyIdToByte = keccak256(bytes(newCopyId));
        return newCopyIdToByte;
    }

    function makeBid(
        address contractAddress,
        uint256 tokenId,
        bytes32 copyId,
        uint256 copyQuantity,
        bool isBuyerMember,
        uint32 _userBuyerFee,
        uint32 _memberBuyerFee,
        uint256 providedBuyerFee
    ) public payable nonReentrant {
        require(_tokenCopies[contractAddress][tokenId][copyId].id == tokenId, "Token doesn't exist");
        require(_tokenCopies[contractAddress][tokenId][copyId].copyId == copyId, "Token copy doesn't exist");
        require(_tokenCopies[contractAddress][tokenId][copyId].putOnSale == true, "Token not for sale");
        require(copyQuantity > 0, "copy quantity amount should be greater than 0");
        require(copyQuantity <= _tokenCopies[contractAddress][tokenId][copyId].amount_for_sale, "Select less quantity to bid");
        require(msg.sender != _tokenCopies[contractAddress][tokenId][copyId].seller, "Owner cannot bid on their own token");
        require(msg.value > 0, "Your bid is too low.");

        uint256 totalAmount = msg.value; // bid + buyerFee
        require(totalAmount > providedBuyerFee, "The provided total amount should be greater than the buyer's fee.");
        uint256 netBidAmount = totalAmount - providedBuyerFee;

        // Calculate the expected buyerFee based on the net bid amount
        uint256 expectedBuyerFee = calculateFee(isBuyerMember, netBidAmount, _userBuyerFee, _memberBuyerFee);

        // Validate that the provided buyerFee matches the expected buyerFee
        require(providedBuyerFee == expectedBuyerFee, "Provided buyerFee does not match expected buyerFee.");

        if (bids[contractAddress][tokenId][copyId][msg.sender].placed) {
            payable(msg.sender).transfer(bids[contractAddress][tokenId][copyId][msg.sender].amount + bids[contractAddress][tokenId][copyId][msg.sender].buyerFee);
        }

        Bid memory bid = Bid(msg.sender, netBidAmount, copyQuantity, false, true, providedBuyerFee);
        bids[contractAddress][tokenId][copyId][msg.sender] = bid;

        emit BidMade(contractAddress, tokenId, copyId, msg.sender, netBidAmount, copyQuantity, providedBuyerFee);
    }

    function acceptBid(
        address contractAddress,
        uint256 tokenId,
        bytes32 copyId,
        address bidder,
        bool isSellerMember,
        uint32 _userSellerFee,
        uint32 _memberSellerFee
    ) public nonReentrant {
        TokenCopy storage tokenCopy = _tokenCopies[contractAddress][tokenId][copyId];
        require(msg.sender == tokenCopy.seller, "Only the owner can accept bids");
        Bid storage bid = bids[contractAddress][tokenId][copyId][bidder];
        validateBid(bid, bidder, tokenCopy);

        uint256 netBidAmount = bid.amount;  // The net bid amount without the fees
        uint256 buyerFee = bid.buyerFee;    // The buyer fee associated with the bid

        // Calculate the seller's fee
        uint256 sellerFee = calculateFee(isSellerMember, netBidAmount, _userSellerFee, _memberSellerFee);
        uint256 sellerReceivable = netBidAmount - sellerFee;  // Amount the seller will receive after deducting the fee

        bid.accepted = true;

        // Transfer fees and amounts
        if (commisionAddress == tokenCopy.seller) {
            payable(tokenCopy.seller).transfer(buyerFee + sellerFee + sellerReceivable);
        } else {
            payable(commisionAddress).transfer(buyerFee + sellerFee);
            payable(tokenCopy.seller).transfer(sellerReceivable);
        }

        // Transfer the tokens to the bidder using the external contract
        IERC1155(contractAddress).safeTransferFrom(tokenCopy.owner, bidder, tokenId, bid.copyQuantity, "");

        handleCopyManagement(tokenId, tokenCopy, bid, bidder);

        delete bids[contractAddress][tokenId][copyId][bidder];

        handleEventsBidAccepted(tokenCopy, netBidAmount, buyerFee, sellerFee, bid);
    }

    function validateBid(Bid memory bid, address bidder, TokenCopy memory tokenCopy) internal pure {
        require(bid.bidder == bidder, "Bid does not exist");
        require(bid.placed, "Bid was not placed");
        require(bid.copyQuantity <= tokenCopy.amount_for_sale, "Bid quantity greater than available for sale");
    }

    function handleCopyManagement(uint256 tokenId, TokenCopy storage tokenCopy, Bid memory bid, address bidder) internal {
        if(tokenCopy.amount == bid.copyQuantity && tokenCopy.amount_for_sale == bid.copyQuantity) {
            tokenCopy.owner = payable(bidder);
            tokenCopy.seller = payable(bidder);
            tokenCopy.putOnSale = false;
            tokenCopy.amount_for_sale = 0;
        } else {
            tokenCopy.amount -= bid.copyQuantity;
            tokenCopy.amount_for_sale -= bid.copyQuantity;
            bytes32 newCopyId = generateCopyId(tokenId, bidder);

            _tokenCopies[tokenCopy.contractAddress][tokenId][newCopyId] = TokenCopy(
                tokenId,
                bid.copyQuantity,
                0,
                tokenCopy.contractAddress,
                payable(bidder),
                payable(bidder),
                tokenCopy.price,
                tokenCopy.royaltyBeneficiary,
                false,
                newCopyId,
                tokenCopy.totalBalance
            );

            emit TokenCopyCreated(
                tokenId,
                bid.copyQuantity,
                0,
                tokenCopy.contractAddress,
                tokenCopy.seller,
                payable(bidder),
                tokenCopy.price,
                tokenCopy.royaltyBeneficiary,
                false,
                newCopyId,
                tokenCopy.totalBalance
            );
        }
    }

    function handleEventsBidAccepted(TokenCopy memory tokenCopy, uint256 netBidAmount,  uint256 buyerFee, uint256 sellerFee, Bid memory bid) internal {
        emit BidAccepted(tokenCopy.contractAddress, tokenCopy.id, tokenCopy.copyId, bid.bidder, netBidAmount, buyerFee, sellerFee);
        emit TokenSold(
            tokenCopy.id,
            bid.copyQuantity,
            tokenCopy.amount_for_sale,
            tokenCopy.contractAddress,
            tokenCopy.seller,
            payable(bid.bidder),
            tokenCopy.price,
            tokenCopy.royaltyBeneficiary,
            tokenCopy.putOnSale,
            tokenCopy.copyId,
            tokenCopy.totalBalance
        );
    }

    function withdrawBid(address contractAddress, uint256 tokenId, bytes32 copyId) public nonReentrant {
        Bid storage bid = bids[contractAddress][tokenId][copyId][msg.sender];
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
        delete bids[contractAddress][tokenId][copyId][msg.sender];

        emit BidWithdrawn(contractAddress, tokenId, copyId, msg.sender, netBidAmount, buyerFee);
    }

    function rejectBid(address contractAddress, uint256 tokenId, bytes32 copyId, address bidder) public nonReentrant {
        TokenCopy storage tokenCopy = _tokenCopies[contractAddress][tokenId][copyId];
        require(msg.sender == tokenCopy.seller, "Only the owner can reject bids");

        Bid storage bid = bids[contractAddress][tokenId][copyId][bidder];
        require(bid.bidder == bidder, "Bid does not exist");

        uint256 netBidAmount = bid.amount; // The net bid amount without the fees
        uint256 buyerFee = bid.buyerFee;   // The buyer fee associated with the bid

        uint256 totalRefundAmount = netBidAmount + buyerFee; // Total refund amount including the buyer fee

        payable(bidder).transfer(totalRefundAmount);

        // Reset the bid values
        bid.amount = 0;
        bid.buyerFee = 0;

        // Delete the rejected bid
        delete bids[contractAddress][tokenId][copyId][bidder];

        emit BidRejected(contractAddress, tokenId, copyId, bidder, netBidAmount, buyerFee);
    }

    // Adapt other functions similar to listTokenForSale
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

    function updateTokenRecords(
        address contractAddress, 
        uint256 tokenId, 
        bytes32 copyId, 
        uint256 quantity
    ) internal {
        TokenCopy storage tokenCopy = _tokenCopies[contractAddress][tokenId][copyId];
        
        if(tokenCopy.putOnSale) {
            tokenCopy.amount_for_sale -= quantity;
        }
        tokenCopy.amount -= quantity;

        if (tokenCopy.amount == 0) {
            delete _tokenCopies[contractAddress][tokenId][copyId];
        }

        emit TokenBurned(contractAddress, tokenId, copyId, msg.sender, quantity);
    }

    function burnToken(
        address contractAddress, 
        uint256 tokenId, 
        bytes32 copyId, 
        uint256 quantity
    ) public {
        TokenCopy storage tokenCopy = _tokenCopies[contractAddress][tokenId][copyId];
        require(tokenCopy.seller != address(0), "Token ID does not exist in the marketplace, token must be listed");
        require(tokenCopy.seller == msg.sender, "Only the owner can burn the token");
        require(quantity <= tokenCopy.amount, "Cannot burn more tokens than you own");

        address deadAddress = 0x000000000000000000000000000000000000dEaD;
        IERC1155 externalContract = IERC1155(contractAddress);
        if(tokenCopy.putOnSale) {
            externalContract.safeTransferFrom(tokenCopy.owner, deadAddress, tokenCopy.id, quantity, "");
        } else {
            externalContract.safeTransferFrom(tokenCopy.seller, deadAddress, tokenCopy.id, quantity, "");
        }

        updateTokenRecords(contractAddress, tokenId, copyId, quantity);
    }

    function burnMultiTokens(
        address[] memory contractsAddress,
        uint256[] memory tokenIds,
        bytes32[] memory copyIds,
        uint256[] memory quantities
    ) public {
        require(
            tokenIds.length == copyIds.length && 
            tokenIds.length == quantities.length && 
            tokenIds.length == contractsAddress.length , "Input arrays must have the same length"
        );

        address deadAddress = 0x000000000000000000000000000000000000dEaD;

        for (uint256 i = 0; i < tokenIds.length; i++) {
            TokenCopy storage tokenCopy = _tokenCopies[contractsAddress[i]][tokenIds[i]][copyIds[i]];
            require(tokenCopy.seller != address(0), "Token ID does not exist in the marketplace, token must be listed");
            require(tokenCopy.seller == msg.sender, "Only the owner can burn the token");
            require(quantities[i] <= tokenCopy.amount, "Cannot burn more tokens than you own");

            IERC1155 externalContract = IERC1155(contractsAddress[i]);
            if(tokenCopy.putOnSale) {
                externalContract.safeTransferFrom(tokenCopy.owner, deadAddress, tokenCopy.id, quantities[i], "");
            } else {
                externalContract.safeTransferFrom(tokenCopy.seller, deadAddress, tokenCopy.id, quantities[i], "");
            }

            updateTokenRecords(contractsAddress[i], tokenIds[i], copyIds[i], quantities[i]);
        }
    }

}