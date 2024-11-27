// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./LiquidityPool.sol";
import "./PriceOracle.sol";
import "./CreditManager.sol";

contract CreditAccount is Ownable {
    // Borrower who owns this credit account
    address public borrower;

    // Collateral token and debt token
    IERC20 public collateralToken;
    IERC20 public debtToken;

    // Collateral balance and debt amount
    uint256 public collateralBalance;
    uint256 public debtAmount;

    // Add LiquidityPool reference
    LiquidityPool public liquidityPool;

    // Add PriceOracle as a state variable
    PriceOracle public priceOracle;

    // Add CreditManager reference
    CreditManager public creditManager;

    // Events
    event CollateralDeposited(address indexed borrower, uint256 amount);
    event CollateralWithdrawn(address indexed borrower, uint256 amount);
    event DebtIncurred(address indexed borrower, uint256 amount);
    event DebtRepaid(address indexed borrower, uint256 amount);

    constructor(
        address _borrower, 
        address _collateralToken, 
        address _debtToken, 
        address _liquidityPool,
        address _priceOracle,
        address _creditManager
    ) Ownable(msg.sender) {
        borrower = _borrower;
        collateralToken = IERC20(_collateralToken);
        debtToken = IERC20(_debtToken);
        liquidityPool = LiquidityPool(_liquidityPool);
        priceOracle = PriceOracle(_priceOracle);
        creditManager = CreditManager(_creditManager);
    }

    // Modifier to restrict access to the borrower
    modifier onlyBorrower() {
        require(msg.sender == borrower, "Not the borrower");
        _;
    }

    /**
     * @dev Deposit collateral into the credit account.
     * @param amount The amount of collateral to deposit.
     */
    function depositCollateral(uint256 amount) external payable onlyBorrower {
        require(amount > 0, "Amount must be greater than zero");

        // Update the collateral balance
        collateralBalance += amount;

        emit CollateralDeposited(msg.sender, amount);
    }

    /**
     * @dev Withdraw collateral from the credit account.
     * @param amount The amount of collateral to withdraw.
     */
    function withdrawCollateral(uint256 amount) external onlyBorrower {
        require(amount > 0, "Amount must be greater than zero");
        require(collateralBalance >= amount, "Insufficient collateral");

        // Get current collateral price and calculate values
        uint256 collateralPrice = priceOracle.getAssetPrice(address(collateralToken));
        uint256 collateralValue = collateralBalance * collateralPrice;
        uint256 newCollateralValue = collateralValue - (amount * collateralPrice);

        // Check if withdrawal would maintain required collateralization ratio
        require(
            newCollateralValue * 1000 >= debtAmount * creditManager.minCollateralizationRatio(),
            "Cannot withdraw, would breach collateralization ratio"
        );

        // Update the collateral balance
        collateralBalance -= amount;

        // Transfer collateral back to the borrower
        collateralToken.transfer(msg.sender, amount);

        emit CollateralWithdrawn(msg.sender, amount);
    }

    /**
     * @dev Borrow debt from the protocol.
     * @param amount The amount of debt to borrow.
     */
    function incurDebt(uint256 amount) external onlyBorrower {
        require(amount > 0, "Amount must be greater than zero");

        // Get current collateral price and calculate values
        uint256 collateralPrice = priceOracle.getAssetPrice(address(collateralToken));
        uint256 collateralValue = collateralBalance * collateralPrice;
        
        // Calculate new total debt after borrowing
        uint256 newDebtAmount = debtAmount + amount;

        // Check leverage limit (10x)
        require(
            newDebtAmount <= collateralValue * creditManager.maxLeverageRatio() / 1000,
            "Exceeds maximum leverage"
        );

        // Update the debt amount
        debtAmount = newDebtAmount;

        // Request funds from the liquidity pool
        liquidityPool.borrow(msg.sender, amount);

        emit DebtIncurred(msg.sender, amount);
    }

    /**
     * @dev Repay debt to the protocol.
     * @param amount The amount of debt to repay.
     */
    function repayDebt(uint256 amount) external onlyBorrower {
        require(amount > 0, "Amount must be greater than zero");
        require(debtAmount >= amount, "Exceeds owed debt");

        // Transfer debt tokens from the borrower to the liquidity pool
        debtToken.transferFrom(msg.sender, address(liquidityPool), amount);

        // Update the debt amount
        debtAmount -= amount;

        // Notify liquidity pool of repayment
        liquidityPool.repay(msg.sender, amount);

        emit DebtRepaid(msg.sender, amount);
    }
}