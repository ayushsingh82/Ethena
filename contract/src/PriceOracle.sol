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

    constructor()
        Ownable(msg.sender)
    {
        pyth = IPyth(0x2880aB155794e7179c9eE2e38200202908C17B43);
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
        int256 exponent = -price.expo;  // Note: price.expo is already negative for most assets
        
        // Need to scale to 18 decimals
        int256 scaleBy = 18 - exponent;  // Calculate how many decimals we need to add/remove
        
        if (scaleBy < 0) {
            return basePrice / (10 ** uint256(-scaleBy));
        } else {
            return basePrice * (10 ** uint256(scaleBy));
        }
    }
}
