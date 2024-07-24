// SPDX-License-Identifier: MIT

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

pragma solidity ^0.8.20;

contract MintNft is ERC721 {
    using Strings for uint256;

    string public baseUri = "this is the base uri/";

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {}

    function mint(uint256 tokenId) public returns (bool) {
        _safeMint(msg.sender, tokenId);
        return true;
    }
    function transfer_(address from, address to, uint256 value) public {
        _transfer(from, to, value);
    }
    function _baseURI() internal view virtual override returns (string memory) {
        return baseUri;
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        _requireOwned(tokenId);

        string memory baseURI = _baseURI();
        return
            bytes(baseURI).length > 0
                ? string.concat(baseURI, tokenId.toString())
                : "";
    }
    function sayHello() public pure returns (string memory) {
        return "hello world";
    }
}
