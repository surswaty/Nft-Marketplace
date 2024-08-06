// SPDX-License-Identifier: MIT

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

pragma solidity ^0.8.20;

contract MintNft is ERC721URIStorage {
    string public baseUri = "this is the base uri/";

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {}

    function mint(uint256 tokenId) public returns (bool) {
        _safeMint(msg.sender, tokenId);
        return true;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "The base URI/";
    }
}
