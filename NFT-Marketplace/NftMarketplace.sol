// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

interface MintNftI {
    function mint(uint256 tokenId) external returns (bool);
    function tokenURI(uint256 tokenId) external returns (string memory);
    function transfer_(address from, address to, uint256 value) external;
    function sayHello() external returns (string memory);
}

contract NftMarketplace {
    MintNftI NftAddress;

    uint256 public totalListedCount;
    mapping(uint256 _tokenId => mapping(address _Owner => bool)) tokenListed;
    mapping(uint256 _tokenId => uint256 _price) public tokenPrice;
    mapping(address owner => uint[] listedTokens) internal listedByAddress;
    uint[] internal totalListedTokens;
    string public baseUri = "this is the base uri/";

    constructor(address _nftAddress) {
        NftAddress = MintNftI(_nftAddress);
    }

    function listOnMarketplace(
        uint256 tokenId,
        uint256 priceInWei
    ) public returns (bool) {
        NftAddress.transfer_(msg.sender, address(this), tokenId);
        tokenListed[tokenId][msg.sender] = true;
        tokenPrice[tokenId] = priceInWei;
        totalListedTokens.push(tokenId);
        listedByAddress[msg.sender].push(tokenId);
        totalListedCount++;
        return true;
    }

    function getListedByAddress(
        address _address
    ) public view returns (uint256[] memory) {
        return listedByAddress[_address];
    }
    function getTotalListed() public view returns (uint256[] memory) {
        return totalListedTokens;
    }
}
