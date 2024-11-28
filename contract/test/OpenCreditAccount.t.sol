// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/CreditManager.sol";
import "../src/CreditAccount.sol";
import "../src/USDT.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../src/PriceOracle.sol";
import "../src/LiquidityPool.sol";

contract MockUSDe is USDT {
    constructor() USDT() {
        _mint(msg.sender, 1_000_000 * 10**18); // Mint 1M USDe
    }
}

contract OpenCreditAccountTest is Test {
    CreditManager public creditManager;
    PriceOracle public priceOracle;
    MockUSDe public collateralToken;  // Our mock USDe
    USDT public debtToken;
    LiquidityPool public liquidityPool;
    address public user;

    function setUp() public {
        // Deploy mock USDe as collateral
        collateralToken = new MockUSDe();
        
        // Deploy other contracts
        debtToken = new USDT();
        priceOracle = new PriceOracle();
        creditManager = new CreditManager(1200, address(priceOracle));  // 120% health ratio
        liquidityPool = new LiquidityPool(
            IERC20(address(debtToken)),
            "LP Token",
            "LP",
            address(creditManager)
        );

        // Setup test user
        user = makeAddr("user");
        vm.deal(user, 100 ether);

        // Set price feed in oracle for mock USDe
        vm.startPrank(address(this));
        priceOracle.setPriceFeed(
            address(collateralToken),
            0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a
        );
        vm.stopPrank();

        // Transfer some mock USDe to user
        collateralToken.transfer(user, 1000 * 10**18);
    }

    function testOpenCreditAccount() public {
        vm.startPrank(user);

        // Open credit account
        creditManager.openCreditAccount(
            address(collateralToken),
            address(debtToken),
            address(liquidityPool),
            address(priceOracle)
        );

        // Get the created credit account address
        address creditAccountAddr = creditManager.creditAccounts(user);
        
        // Basic checks
        assertTrue(creditAccountAddr != address(0), "Credit account not created");
        
        // Detailed checks
        CreditAccount creditAccount = CreditAccount(creditAccountAddr);
        assertEq(creditAccount.borrower(), user, "Wrong borrower");
        assertEq(address(creditAccount.collateralToken()), address(collateralToken), "Wrong collateral token");
        assertEq(address(creditAccount.debtToken()), address(debtToken), "Wrong debt token");
        assertEq(address(creditAccount.liquidityPool()), address(liquidityPool), "Wrong liquidity pool");
        assertEq(address(creditAccount.priceOracle()), address(priceOracle), "Wrong price oracle");

        vm.stopPrank();
    }

    function testFailOpenDuplicateAccount() public {
        vm.startPrank(user);

        // First account
        creditManager.openCreditAccount(
            address(collateralToken),
            address(debtToken),
            address(liquidityPool),
            address(priceOracle)
        );

        // Try to open second account - should fail
        creditManager.openCreditAccount(
            address(collateralToken),
            address(debtToken),
            address(liquidityPool),
            address(priceOracle)
        );

        vm.stopPrank();
    }

    function testFailOpenWithZeroAddresses() public {
        vm.startPrank(user);

        // Try to open account with zero addresses - should fail
        creditManager.openCreditAccount(
            address(0),  // zero collateral token
            address(debtToken),
            address(liquidityPool),
            address(priceOracle)
        );

        vm.stopPrank();
    }

    function testOpenMultipleAccountsDifferentUsers() public {
        address user2 = makeAddr("user2");

        // User 1 opens account
        vm.prank(user);
        creditManager.openCreditAccount(
            address(collateralToken),
            address(debtToken),
            address(liquidityPool),
            address(priceOracle)
        );

        // User 2 opens account
        vm.prank(user2);
        creditManager.openCreditAccount(
            address(collateralToken),
            address(debtToken),
            address(liquidityPool),
            address(priceOracle)
        );

        // Verify both accounts exist and are different
        address account1 = creditManager.creditAccounts(user);
        address account2 = creditManager.creditAccounts(user2);
        
        assertTrue(account1 != address(0), "User 1 account not created");
        assertTrue(account2 != address(0), "User 2 account not created");
        assertTrue(account1 != account2, "Accounts should be different");
    }

    function testCreditAccountsList() public {
        vm.startPrank(user);

        // Open credit account
        creditManager.openCreditAccount(
            address(collateralToken),
            address(debtToken),
            address(liquidityPool),
            address(priceOracle)
        );

        // Get the created credit account address
        address creditAccountAddr = creditManager.creditAccounts(user);
        
        // Check creditAccountsList - access first element with index 0
        assertEq(creditManager.creditAccountsList(0), creditAccountAddr, "Account not added to list");

        vm.stopPrank();
    }
} 