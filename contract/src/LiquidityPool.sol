// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CreditManager.sol";

contract LiquidityPool is ERC20, Ownable {
    // Underlying asset (e.g., DAI, USDC) managed by the pool
    IERC20 public immutable underlyingAsset;

    // Interest rate (expressed in basis points, 1% = 100 bps)
    uint256 public interestRate; 

    // Event declarations
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event InterestRateUpdated(uint256 oldRate, uint256 newRate);

    // Add at the top with other state variables
    address public creditManager;

    // Add tracking for total borrowed amount
    uint256 public totalBorrowed;

    constructor(IERC20 _underlyingAsset, string memory name, string memory symbol, address _creditManager)
        ERC20(name, symbol)
        Ownable(msg.sender)
    {
        underlyingAsset = _underlyingAsset;
        interestRate = 500; // Default: 5% annual interest rate
        creditManager = _creditManager;
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
     * @dev Allows borrowing from the pool (only callable by credit accounts)
     * @param borrower The address to receive the borrowed tokens
     * @param amount The amount to borrow
     */
    function borrow(address borrower, uint256 amount) external {
        require(amount <= totalLiquidity(), "Insufficient liquidity");

        // Update total borrowed amount
        totalBorrowed += amount;

        // Transfer the tokens to the borrower
        underlyingAsset.transfer(borrower, amount);
    }

    /**
     * @dev Handles debt repayment
     * @param borrower The address repaying the debt
     * @param amount The amount being repaid
     */
    function repay(address borrower, uint256 amount) external {
        require(msg.sender == address(creditManager), "Only credit manager can repay");
        
        // Update total borrowed amount
        totalBorrowed = totalBorrowed >= amount ? totalBorrowed - amount : 0;
        
        emit Withdraw(borrower, amount);
    }

    /**
     * @dev Returns the total liquidity held by the pool.
     */
    function totalLiquidity() public view returns (uint256) {
        return underlyingAsset.balanceOf(address(this));
    }

    /**
     * @dev Returns the total value managed by the pool (current liquidity + borrowed amount)
     */
    function totalPoolValue() public view returns (uint256) {
        return totalLiquidity() + totalBorrowed;
    }

    /**
     * @dev Returns the utilization rate of the pool (borrowed/total value)
     */
    function utilizationRate() public view returns (uint256) {
        uint256 total = totalPoolValue();
        if (total == 0) return 0;
        return (totalBorrowed * 10000) / total; // Returns basis points (100% = 10000)
    }

    /**
     * @dev Returns the total value including pool assets and all credit account collaterals
     */
    function totalTVL() public view returns (uint256) {
        // Get pool value (current liquidity + borrowed amount)
        uint256 poolValue = totalPoolValue();
        
        // Get total collateral value from credit manager
        uint256 collateralValue = CreditManager(creditManager).getTotalCollateralValue();
        
        return poolValue + collateralValue;
    }
}
