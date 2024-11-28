// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CreditAccount.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./PriceOracle.sol";

contract CreditManager is Ownable {
    // Mapping of borrowers to their credit accounts
    mapping(address => address) public creditAccounts;

    // Maximum leverage ratio (10x = 1000%)
    uint256 public constant maxLeverageRatio = 1000;  // 10x leverage
    
    // Health ratio for liquidation (e.g., 120% represented as 1200)
    uint256 public healthRatio;

    // Add PriceOracle as a state variable
    PriceOracle public priceOracle;

    // Events
    event CreditAccountOpened(address indexed borrower, address creditAccount);
    event CreditAccountClosed(address indexed borrower);
    event LiquidationTriggered(address indexed borrower, address liquidator);

    constructor(uint256 _healthRatio, address _priceOracleAddr)
        Ownable(msg.sender)
    {
        require(_healthRatio > 1000, "Health ratio must be > 100%");
        healthRatio = _healthRatio;
        priceOracle = PriceOracle(_priceOracleAddr);
    }

    /**
     * @dev Opens a new credit account for the borrower.
     * @param collateralToken Address of the collateral token.
     * @param debtToken Address of the debt token.
     * @param liquidityPool Address of the liquidity pool.
     * @param _priceOracleAddr Address of the price oracle.
     */
    function openCreditAccount(
        address collateralToken,
        address debtToken,
        address liquidityPool,
        address _priceOracleAddr
    ) external {
        require(creditAccounts[msg.sender] == address(0), "Credit account already exists");

        // Deploy a new CreditAccount contract
        CreditAccount creditAccount = new CreditAccount(
            msg.sender,
            collateralToken,
            debtToken,
            liquidityPool,
            _priceOracleAddr,
            address(this)
        );

        // Map the borrower to the credit account
        creditAccounts[msg.sender] = address(creditAccount);
        creditAccountsList.push(address(creditAccount));  // Add to list

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
     * @dev Liquidates a borrower's credit account if undercollateralized.
     * @param borrower The address of the borrower.
     */
    function liquidate(address borrower) external {
        address creditAccountAddr = creditAccounts[borrower];
        require(creditAccountAddr != address(0), "No credit account found");

        CreditAccount creditAccount = CreditAccount(creditAccountAddr);

        // Get current values using the PriceOracle contract directly
        uint256 collateralPrice = priceOracle.getAssetPrice(
            address(creditAccount.collateralToken())
        );
        uint256 collateralValue = creditAccount.collateralBalance() * collateralPrice;
        uint256 debtValue = creditAccount.debtAmount();

        // Check if below health ratio
        require(
            collateralValue * 1000 < debtValue * healthRatio,
            "Account is above health ratio"
        );

        // Liquidate the account by transferring collateral to the liquidator
        uint256 collateralBalance = creditAccount.collateralBalance();
        creditAccount.withdrawCollateral(collateralBalance);

        // Remove the borrower's credit account
        delete creditAccounts[borrower];

        emit LiquidationTriggered(borrower, msg.sender);
    }

    /**
     * @dev Updates the health ratio.
     * @param newRatio The new health ratio.
     */
    function updateHealthRatio(uint256 newRatio) external onlyOwner {
        require(newRatio > 1000, "Health ratio must be > 100%");
        healthRatio = newRatio;
    }

    /**
     * @dev Returns total collateral value across all credit accounts
     */
    function getTotalCollateralValue() public view returns (uint256) {
        uint256 totalCollateral = 0;
        
        // Iterate through all credit accounts
        for (uint i = 0; i < creditAccountsList.length; i++) {
            address accountAddress = creditAccountsList[i];
            if (accountAddress != address(0)) {
                CreditAccount account = CreditAccount(accountAddress);
                uint256 collateralPrice = priceOracle.getAssetPrice(
                    address(account.collateralToken())
                );
                totalCollateral += account.collateralBalance() * collateralPrice;
            }
        }
        
        return totalCollateral;
    }

    // Add an array to track all credit accounts
    address[] public creditAccountsList;
}