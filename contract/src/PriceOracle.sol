// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";

contract PriceOracle is Ownable {
    // Pyth price IDs for assets
    mapping(address => bytes32) public priceFeeds;
    IPyth public immutable pyth;

    // Events
    event PriceFeedUpdated(address indexed asset, bytes32 indexed priceId);

    constructor(address _pythAddress)
        Ownable(msg.sender)
    {
        pyth = IPyth(_pythAddress);
    }

    /**
     * @dev Set the Pyth price feed ID for an asset
     * @param asset The address of the asset
     * @param priceId The Pyth price feed ID
     */
    function setPriceFeed(address asset, bytes32 priceId) external onlyOwner {
        priceFeeds[asset] = priceId;
        emit PriceFeedUpdated(asset, priceId);
    }

    /**
     * @dev Get the price of an asset from Pyth
     * @param asset The address of the asset to query
     * @return The price of the asset (scaled to 18 decimals)
     */
    function getAssetPrice(address asset) public view returns (uint256) {
        bytes32 priceId = priceFeeds[asset];
        require(priceId != bytes32(0), "Price feed not set for this asset");

        PythStructs.Price memory price = pyth.getPrice(priceId);
        require(price.price >= 0, "Invalid price feed response");
        
        // Convert to positive values and handle decimals
        uint256 basePrice = uint256(int256(price.price));
        uint256 exponent = uint256(int256(-price.expo));
        
        // Scale to 18 decimals
        if (exponent < 18) {
            return basePrice * (10 ** (18 - exponent));
        } else {
            return basePrice / (10 ** (exponent - 18));
        }
    }
}
