// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LiquidityPool is ERC20, Ownable {
    // Underlying asset (e.g., DAI, USDC) managed by the pool
    IERC20 public immutable underlyingAsset;

    // Interest rate (expressed in basis points, 1% = 100 bps)
    uint256 public interestRate; 

    // Event declarations
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event InterestRateUpdated(uint256 oldRate, uint256 newRate);

    constructor(IERC20 _underlyingAsset, string memory name, string memory symbol)
        ERC20(name, symbol)
        Ownable(msg.sender)
    {
        underlyingAsset = _underlyingAsset;
        interestRate = 500; // Default: 5% annual interest rate
    }

    /**
     * @dev Allows users to deposit tokens into the pool.
     * Mints interest-bearing tokens to represent their stake.
     */
    function deposit(uint256 amount) external {
        require(amount > 0, "Deposit amount must be greater than zero");

        // Transfer the underlying asset to the contract
        underlyingAsset.transferFrom(msg.sender, address(this), amount);

        // Mint equivalent LP tokens for the user
        _mint(msg.sender, amount);

        emit Deposit(msg.sender, amount);
    }

    /**
     * @dev Allows users to withdraw their stake from the pool.
     * Burns the corresponding interest-bearing tokens and transfers the underlying asset.
     */
    function withdraw(uint256 amount) external {
        require(amount > 0, "Withdraw amount must be greater than zero");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        // Burn LP tokens from the user
        _burn(msg.sender, amount);

        // Transfer the underlying asset back to the user
        underlyingAsset.transfer(msg.sender, amount);

        emit Withdraw(msg.sender, amount);
    }

    /**
     * @dev Allows the owner to update the annual interest rate.
     */
    function setInterestRate(uint256 newRate) external onlyOwner {
        require(newRate <= 10000, "Rate cannot exceed 100%");
        uint256 oldRate = interestRate;
        interestRate = newRate;
        emit InterestRateUpdated(oldRate, newRate);
    }

    /**
     * @dev Returns the total liquidity held by the pool.
     */
    function totalLiquidity() public view returns (uint256) {
        return underlyingAsset.balanceOf(address(this));
    }
}
