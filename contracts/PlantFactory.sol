// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

// importing the ERC-721 contract to deploy for a plant
import "./Plant.sol";

/**
 * @notice Give the ability to deploy a contract to manage ERC-721 tokens for a Plant.
 * @dev    If the contract is already deployed for a _name, it will revert.
 */
contract PlantFactory {
    Plant[] public collectionsArray;

    event PlantCreated(string _name, uint _timestamp);

    /**
     * @notice Deploy the ERC-721 Collection contract of the plant to be able to create NFTs later
     */
    function createPlant(
        string memory _name,
        string memory _symbol,
        string memory _species
    ) external returns (address plantAddress) {
        Plant plant = new Plant(_name, _symbol, _species);
        collectionsArray.push(plant);

        emit PlantCreated(_name, block.timestamp);
    }

    function getCollections() public view returns (Plant[] memory) {
        require(collectionsArray.length > 0, "No collection");
        return collectionsArray;
    }
}
