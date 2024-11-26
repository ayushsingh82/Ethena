// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

// Interface for external price feed
interface IPriceFeed {
    function latestAnswer() external view returns (int256);
}

contract PriceOracle is Ownable {
    // Mapping to store the price feeds for different assets
    mapping(address => address) public priceFeeds;

    constructor()
        Ownable(msg.sender)
    {}

    // Events
    event PriceFeedUpdated(address indexed asset, address indexed priceFeed);

    /**
     * @dev Set the price feed address for an asset
     * @param asset The address of the asset (e.g., ERC20 token address)
     * @param priceFeed The address of the price feed contract (e.g., Chainlink aggregator)
     */
    function setPriceFeed(address asset, address priceFeed) external onlyOwner {
        priceFeeds[asset] = priceFeed;
        emit PriceFeedUpdated(asset, priceFeed);
    }

    /**
     * @dev Get the price of an asset from its price feed
     * @param asset The address of the asset to query
     * @return The price of the asset (scaled to 18 decimals, e.g., 1e18 for the base unit)
     */
    function getAssetPrice(address asset) public view returns (uint256) {
        address priceFeedAddr = priceFeeds[asset];
        require(priceFeedAddr != address(0), "Price feed not set for this asset");

        IPriceFeed priceFeed = IPriceFeed(priceFeedAddr);
        int256 price = priceFeed.latestAnswer();

        // Ensure the price is positive and return it as a uint256
        require(price > 0, "Invalid price feed response");
        return uint256(price);
    }
}
