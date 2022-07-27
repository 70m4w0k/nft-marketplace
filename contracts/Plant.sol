// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Plant is ERC721URIStorage {
    Item[] public items;
    string public species;

    Counters.Counter private _tokenIds;
    using Counters for Counters.Counter;

    struct Item {
        // Date is Stored in Unix Format (https://www.icodia.com/fr/solutions/outils/transformation/dateunix.html)
        uint date;
        // weather
    }

    event TokenCreated(uint _tokenId, string _tokenUri, uint _date);

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _species
    ) ERC721(_name, _symbol) {
        species = _species;
    }

    function MintNFT(string memory _tokenURI, uint _date)
        public
        returns (uint256)
    {
        _tokenIds.increment();

        items.push(Item(_date));
        uint newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, _tokenURI);
        emit TokenCreated(newItemId, _tokenURI, _date);
        return newItemId;
    }

    function lastTokenId() public view returns (uint) {
        return _tokenIds.current();
    }
}
