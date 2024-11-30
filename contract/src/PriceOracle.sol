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
        pyth = IPyth(0xA2aa501b19aff244D90cc15a4Cf739D2725B5729);
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
     * @dev Get the price of an asset from Pyth using getPriceUnsafe
     */
    function getAssetPrice(address asset) public view returns (uint256) {
        bytes32 priceId = priceFeeds[asset];
        require(priceId != bytes32(0), "Price feed not set for this asset");

        try pyth.getPriceUnsafe(priceId) returns (PythStructs.Price memory price) {
            require(price.price >= 0, "Invalid price feed response");
            
            // Convert to positive values and handle decimals
            uint256 basePrice = uint256(int256(price.price));
            int256 exponent = -price.expo;
            
            // Scale to 18 decimals
            int256 scaleBy = 18 - exponent;
            
            if (scaleBy < 0) {
                return basePrice / (10 ** uint256(-scaleBy));
            } else {
                return basePrice * (10 ** uint256(scaleBy));
            }
        } catch {
            revert("Failed to fetch price");
        }
    }

    /**
     * @dev Update price feeds with the latest data
     */
    function updatePriceFeeds(bytes[] calldata priceUpdateData) external payable {
        pyth.updatePriceFeeds{value: msg.value}(priceUpdateData);
    }

    /**
     * @dev Get the valid time period for a price feed
     */
    function getValidTime() external view returns (uint validTimePeriod) {
        return pyth.getValidTimePeriod();
    }
}
