// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

interface MintIERC721 is IERC721, IERC721Receiver {
    function tokenURI(uint256 tokenId) external view returns (string memory);
    function transfer_(address from, address to, uint256 tokenId) external;
}

contract ERC721Receiver is IERC721Receiver {
    event TokenReceived(
        address operator,
        address from,
        uint256 tokenId,
        bytes data
    );

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) public override returns (bytes4) {
        emit TokenReceived(operator, from, tokenId, data);
        return this.onERC721Received.selector;
    }
}

contract NftMarketplace is ERC721Receiver {
    MintIERC721 immutable NftAddress;

    struct TokenInfo {
        uint256 tokenId;
        address owner;
        uint256 time;
        bool isActive;
        string tokenUri;
        uint256 price;
    }

    mapping(address => mapping(uint256 => TokenInfo)) public tokenListed;
    mapping(address => uint256[]) internal listedByAddress;
    uint256[] internal allListedTokens;
    string public baseUri = "this is the base uri/";

    event lengthOfArrlistedbyaddress(uint256 length);

    constructor(address _nftAddress) {
        NftAddress = MintIERC721(_nftAddress);
    }

    // Helper Function
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

    function listOnMarketplace(
        address contractAddress,
        uint256 tokenId,
        uint256 priceInWei
    ) public returns (bool) {
        require(
            NftAddress.ownerOf(tokenId) == msg.sender,
            "Only the owner can list the token"
        );
        NftAddress.transfer_(msg.sender, address(this), tokenId);

        tokenListed[contractAddress][tokenId] = TokenInfo(
            tokenId,
            msg.sender,
            block.timestamp,
            true,
            NftAddress.tokenURI(tokenId),
            priceInWei
        );
        allListedTokens.push(tokenId);
        listedByAddress[msg.sender].push(tokenId);

        return true;
    }

    function buyNft(uint256 tokenId) public payable returns (address) {
        require(
            tokenListed[address(NftAddress)][tokenId].isActive,
            "Token is not listed"
        );
        require(
            msg.value == tokenListed[address(NftAddress)][tokenId].price,
            "Invalid price value being sent"
        );

        address seller = tokenListed[address(NftAddress)][tokenId].owner;
        NftAddress.transfer_(address(this), msg.sender, tokenId);

        // Update token info
        tokenListed[address(NftAddress)][tokenId].isActive = false;

        // Remove from allListedTokens
        uint256 index = uint256(getIndex(tokenId, allListedTokens));
        require(
            index < allListedTokens.length,
            "Index out of bound in allListedTokens"
        );
        allListedTokens[index] = allListedTokens[allListedTokens.length - 1];
        allListedTokens.pop();

        // Remove from listedByAddress
        uint256 indexLBA = uint256(getIndex(tokenId, listedByAddress[seller]));
        require(
            indexLBA < listedByAddress[seller].length,
            "Index out of bound in listedByAddress"
        );
        listedByAddress[seller][indexLBA] = listedByAddress[seller][
            listedByAddress[seller].length - 1
        ];
        listedByAddress[seller].pop();

        // Transfer funds to seller
        payable(seller).transfer(msg.value);

        return NftAddress.ownerOf(tokenId);
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
