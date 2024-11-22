// SPDX-License-Identifier: MIT
// Gearbox Protocol. Generalized leverage for DeFi protocols
// (c) Gearbox Foundation, 2023.
pragma solidity ^0.8.17;

import {IAdapter} from "@gearbox-protocol/core-v2/contracts/interfaces/IAdapter.sol";

/// @title Aave V2 Wrapped aToken adapter interface
interface IAaveV2_WrappedATokenAdapter is IAdapter {
    function aToken() external view returns (address);

    function underlying() external view returns (address);

    function waTokenMask() external view returns (uint256);

    function aTokenMask() external view returns (uint256);

    function tokenMask() external view returns (uint256);

    function deposit(uint256 assets) external returns (uint256 tokensToEnable, uint256 tokensToDisable);

    function depositDiff(uint256 leftoverAssets) external returns (uint256 tokensToEnable, uint256 tokensToDisable);

    function depositUnderlying(uint256 assets) external returns (uint256 tokensToEnable, uint256 tokensToDisable);

    function depositDiffUnderlying(uint256 leftoverAssets)
        external
        returns (uint256 tokensToEnable, uint256 tokensToDisable);

    function withdraw(uint256 shares) external returns (uint256 tokensToEnable, uint256 tokensToDisable);

    function withdrawDiff(uint256 leftoverShares) external returns (uint256 tokensToEnable, uint256 tokensToDisable);

    function withdrawUnderlying(uint256 shares) external returns (uint256 tokensToEnable, uint256 tokensToDisable);

    function withdrawDiffUnderlying(uint256 leftoverShares)
        external
        returns (uint256 tokensToEnable, uint256 tokensToDisable);
}
