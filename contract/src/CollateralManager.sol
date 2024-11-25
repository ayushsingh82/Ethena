// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./CreditManager.sol";
import "./PriceOracle.sol";

contract CollateralManager is Ownable {
    CreditManager public creditManager;
    PriceOracle public priceOracle;

    // Events
    event CollateralDeposited(address indexed borrower, uint256 amount);
    event CollateralWithdrawn(address indexed borrower, uint256 amount);
    event LiquidationExecuted(address indexed borrower, uint256 collateralSeized);

    constructor(address _creditManager, address _priceOracle)
        Ownable(msg.sender)
    {
        creditManager = CreditManager(_creditManager);
        priceOracle = PriceOracle(payable(_priceOracle));
    }

    /**
     * @dev Deposit collateral for a specific borrower.
     * @param borrower The address of the borrower.
     * @param amount The amount of collateral to deposit.
     */
    function depositCollateral(address borrower, uint256 amount) external {
        address creditAccountAddr = creditManager.creditAccounts(borrower);
        require(creditAccountAddr != address(0), "No credit account found");

        CreditAccount creditAccount = CreditAccount(creditAccountAddr);
        require(msg.sender == borrower, "Only borrower can deposit");

        // Transfer collateral to the credit account
        creditAccount.depositCollateral{value: amount}(amount);

        emit CollateralDeposited(borrower, amount);
    }

    /**
     * @dev Withdraw collateral for a specific borrower.
     * @param amount The amount of collateral to withdraw.
     */
    function withdrawCollateral(uint256 amount) external {
        address creditAccountAddr = creditManager.creditAccounts(msg.sender);
        require(creditAccountAddr != address(0), "No credit account found");

        CreditAccount creditAccount = CreditAccount(creditAccountAddr);

        // Fetch price and validate withdrawal
        uint256 collateralValue = priceOracle.getCollateralValue(address(creditAccount));
        uint256 debtValue = creditAccount.debtAmount();
        uint256 newCollateralValue = collateralValue - amount;

        require(
            newCollateralValue * 1000 >= debtValue * creditManager.minCollateralizationRatio(),
            "Cannot withdraw, would breach collateralization ratio"
        );

        // Withdraw collateral
        creditAccount.withdrawCollateral(amount);

        emit CollateralWithdrawn(msg.sender, amount);
    }

    /**
     * @dev Execute liquidation on undercollateralized accounts.
     * @param borrower The address of the borrower to liquidate.
     */
    function liquidate(address borrower) external {
        address creditAccountAddr = creditManager.creditAccounts(borrower);
        require(creditAccountAddr != address(0), "No credit account found");

        CreditAccount creditAccount = CreditAccount(creditAccountAddr);

        uint256 collateralValue = priceOracle.getCollateralValue(address(creditAccount));
        uint256 debtValue = creditAccount.debtAmount();

        require(
            collateralValue * 1000 < debtValue * creditManager.minCollateralizationRatio(),
            "Account is not undercollateralized"
        );

        // Transfer collateral to liquidator
        uint256 collateralBalance = creditAccount.collateralBalance();
        creditAccount.withdrawCollateral(collateralBalance);
        payable(msg.sender).transfer(collateralBalance);

        // Notify CreditManager of liquidation
        creditManager.liquidate(borrower);

        emit LiquidationExecuted(borrower, collateralBalance);
    }

    /**
     * @dev Update the credit manager contract address.
     * @param newCreditManager The new CreditManager contract address.
     */
    function updateCreditManager(address newCreditManager) external onlyOwner {
        creditManager = CreditManager(newCreditManager);
    }

    /**
     * @dev Update the price oracle contract address.
     * @param newPriceOracle The new PriceOracle contract address.
     */
    function updatePriceOracle(address newPriceOracle) external onlyOwner {
        priceOracle = PriceOracle(payable(newPriceOracle));
    }

    // Allow the contract to receive Ether for collateral deposits
    receive() external payable {}
}
