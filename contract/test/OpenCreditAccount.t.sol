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
    MockUSDe public collateralToken;
    USDT public debtToken;
    LiquidityPool public liquidityPool;
    address public user;
    address public user2;

    function setUp() public {
        // Deploy contracts
        collateralToken = new MockUSDe();
        debtToken = new USDT();
        priceOracle = new PriceOracle();
        creditManager = new CreditManager(1200, address(priceOracle));  // 120% health ratio
        liquidityPool = new LiquidityPool(
            IERC20(address(debtToken)),
            "LP Token",
            "LP",
            address(creditManager)
        );

        // Setup test users
        user = makeAddr("user");
        user2 = makeAddr("user2");
        vm.deal(user, 100 ether);
        vm.deal(user2, 100 ether);

        // Set price feed in oracle
        vm.startPrank(address(this));
        priceOracle.setPriceFeed(
            address(collateralToken),
            0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a
        );
        vm.stopPrank();

        // Transfer tokens to users
        collateralToken.transfer(user, 1000 * 10**18);
        collateralToken.transfer(user2, 1000 * 10**18);
        debtToken.transfer(user, 1000 * 10**18);
        debtToken.transfer(user2, 1000 * 10**18);
    }

    function testDepositCollateral() public {
        vm.startPrank(user);

        // Open credit account
        creditManager.openCreditAccount(
            address(collateralToken),
            address(debtToken),
            address(liquidityPool),
            address(priceOracle)
        );

        // Get credit account address
        address creditAccountAddr = creditManager.getCreditAccount(user);
        
        // Approve and deposit in one transaction
        uint256 depositAmount = 100 * 10**18;
        collateralToken.approve(creditAccountAddr, depositAmount);
        CreditAccount(creditAccountAddr).depositCollateral(depositAmount);

        // Verify deposit
        CreditAccount creditAccount = CreditAccount(creditAccountAddr);
        assertEq(creditAccount.collateralBalance(), depositAmount, "Wrong collateral balance");
        assertEq(collateralToken.balanceOf(creditAccountAddr), depositAmount, "Wrong token balance");

        vm.stopPrank();
    }

    function testIncurDebt() public {
        vm.startPrank(user);

        // Record initial balance
        // uint256 initialBalance = debtToken.balanceOf(user);

        // Setup: Open account and deposit collateral
        creditManager.openCreditAccount(
            address(collateralToken),
            address(debtToken),
            address(liquidityPool),
            address(priceOracle)
        );

        // Get credit account address and deposit collateral
        address creditAccountAddr = creditManager.getCreditAccount(user);
        uint256 depositAmount = 100 * 10**18;
        collateralToken.approve(creditAccountAddr, depositAmount);
        CreditAccount(creditAccountAddr).depositCollateral(depositAmount);

        vm.stopPrank();

        // Add liquidity to the pool first
        vm.startPrank(address(this));
        debtToken.approve(address(liquidityPool), 1000 * 10**18);
        liquidityPool.deposit(1000 * 10**18);
        vm.stopPrank();

        // Borrow
        vm.startPrank(user);
        uint256 borrowAmount = 50 * 10**18;
        creditManager.incurDebt(borrowAmount);

        // Verify debt
        CreditAccount creditAccount = CreditAccount(creditAccountAddr);
        assertEq(creditAccount.debtAmount(), borrowAmount, "Wrong debt amount");

        vm.stopPrank();
    }
}