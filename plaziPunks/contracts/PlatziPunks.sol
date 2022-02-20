// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract PlatziPunks is ERC721 {
  // The constructor needs two parameters, the name and the acronym of the NFT.
  constructor() ERC721("PlatziPunks", "PLPKS") {}
}