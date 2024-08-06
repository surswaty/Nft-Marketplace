// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IMintNft is IERC721 {
    function tokenURI(uint256 tokenId) external view returns (string memory);
    function approve(address to, uint256 tokenId) external;
    function mint(address to, uint256 tokenId) external returns (bool);
}

contract NftMarketplace {
    IMintNft immutable mintAddress;

    struct TokenInfo {
        uint256 tokenId;
        address owner;
        uint256 time;
        bool isActive;
        string tokenUri;
        uint256 price;
    }

    mapping(address mintAddress => mapping(uint256 tokenId => TokenInfo))
        public tokenListed;
    mapping(address => uint256[]) internal listedByAddress;
    uint256[] internal allListedTokens;

    constructor(address _mintAddress) {
        mintAddress = IMintNft(_mintAddress);
    }

    function getIndex(
        uint256 item,
        uint256[] memory arr
    ) internal pure returns (int) {
        for (uint256 i = 0; i < arr.length; i++) {
            if (arr[i] == item) {
                return int(i); // Found the item, return its index
            }
        }
        return -1; // Item not found
    }

    function list(
        address contractAddress,
        uint256 tokenId,
        uint256 priceInWei
    ) public returns (bool) {
        require(
            mintAddress.ownerOf(tokenId) == msg.sender ||
                mintAddress.getApproved(tokenId) == msg.sender ||
                mintAddress.isApprovedForAll(
                    mintAddress.ownerOf(tokenId),
                    msg.sender
                ) ==
                true,
            "Only the owner and operator can List"
        );
        require(
            tokenListed[contractAddress][tokenId].isActive == false,
            "Already listed"
        );
        require(
            mintAddress.ownerOf(tokenId) != address(0),
            "Required Mint first"
        );
        tokenListed[contractAddress][tokenId] = TokenInfo(
            tokenId,
            msg.sender,
            block.timestamp,
            true,
            mintAddress.tokenURI(tokenId),
            priceInWei
        );
        allListedTokens.push(tokenId);
        listedByAddress[msg.sender].push(tokenId);
        return true;
    }

    function buyNft(uint256 tokenId) public payable returns (address) {
        uint256 index = uint256(getIndex(tokenId, allListedTokens));
        address seller = tokenListed[address(mintAddress)][tokenId].owner;
        uint256 indexLBA = uint256(getIndex(tokenId, listedByAddress[seller]));
        require(
            tokenListed[address(mintAddress)][tokenId].isActive,
            "Token not listed"
        );
        require(
            mintAddress.getApproved(tokenId) == address(this),
            "Not a listed token"
        );
        require(
            msg.value == tokenListed[address(mintAddress)][tokenId].price,
            "Invalid price value being sent"
        );

        mintAddress.safeTransferFrom(
            mintAddress.ownerOf(tokenId),
            msg.sender,
            tokenId
        );

        // Update token info
        tokenListed[address(mintAddress)][tokenId].isActive = false;

        // Remove from allListedTokens
        allListedTokens[index] = allListedTokens[allListedTokens.length - 1];
        allListedTokens.pop();
        // Remove from listedByAddress
        listedByAddress[seller][indexLBA] = listedByAddress[seller][
            listedByAddress[seller].length - 1
        ];
        listedByAddress[seller].pop();

        // Transfer funds to seller
        payable(tokenListed[msg.sender][tokenId].owner).transfer(msg.value);

        return mintAddress.ownerOf(tokenId);
    }

    function getListedByAddress(
        address _address
    ) public view returns (uint256[] memory) {
        return listedByAddress[_address];
    }

    function getAllListed() public view returns (uint256[] memory) {
        return allListedTokens;
    }
}
