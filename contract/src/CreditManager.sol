// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CreditAccount.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CreditManager is Ownable {
    // Mapping of borrowers to their credit accounts
    mapping(address => address) public creditAccounts;

    // Minimum collateralization ratio (e.g., 150% represented as 1500)
    uint256 public minCollateralizationRatio;

    // Events
    event CreditAccountOpened(address indexed borrower, address creditAccount);
    event CreditAccountClosed(address indexed borrower);

    constructor(uint256 _minCollateralizationRatio)
        Ownable(msg.sender)
    {
        require(_minCollateralizationRatio > 1000, "Ratio must be > 100%");
        minCollateralizationRatio = _minCollateralizationRatio;
    }

    /**
     * @dev Opens a new credit account for the borrower.
     * @param collateralToken Address of the collateral token.
     * @param debtToken Address of the debt token.
     */
    function openCreditAccount(address collateralToken, address debtToken) external {
        require(creditAccounts[msg.sender] == address(0), "Credit account already exists");

        // Deploy a new CreditAccount contract
        CreditAccount creditAccount = new CreditAccount(msg.sender, collateralToken, debtToken);

        // Map the borrower to the credit account
        creditAccounts[msg.sender] = address(creditAccount);

        emit CreditAccountOpened(msg.sender, address(creditAccount));
    }

    /**
     * @dev Closes the borrower's credit account after ensuring all debts are cleared.
     */
    function closeCreditAccount() external {
        address creditAccountAddr = creditAccounts[msg.sender];
        require(creditAccountAddr != address(0), "No credit account found");

        CreditAccount creditAccount = CreditAccount(creditAccountAddr);

        // Ensure the debt is fully repaid
        require(creditAccount.debtAmount() == 0, "Debt not fully repaid");

        // Transfer remaining collateral back to the borrower
        uint256 collateralBalance = creditAccount.collateralBalance();
        if (collateralBalance > 0) {
            creditAccount.withdrawCollateral(collateralBalance);
        }

        // Remove the borrower's credit account
        delete creditAccounts[msg.sender];

        emit CreditAccountClosed(msg.sender);
    }

    /**
     * @dev Updates the minimum collateralization ratio.
     * @param newRatio The new minimum collateralization ratio.
     */
    function updateCollateralizationRatio(uint256 newRatio) external onlyOwner {
        require(newRatio > 1000, "Ratio must be > 100%");
        minCollateralizationRatio = newRatio;
    }
}
