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

    function testWithdrawCollateral() public {
        vm.startPrank(user);

        // Setup: Open account and deposit collateral
        creditManager.openCreditAccount(
            address(collateralToken),
            address(debtToken),
            address(liquidityPool),
            address(priceOracle)
        );

        // Get credit account address
        address creditAccountAddr = creditManager.getCreditAccount(user);
        
        // Deposit collateral
        uint256 depositAmount = 100 * 10**18;
        collateralToken.approve(creditAccountAddr, depositAmount);
        CreditAccount(creditAccountAddr).depositCollateral(depositAmount);

        // Withdraw half
        uint256 withdrawAmount = 50 * 10**18;
        CreditAccount(creditAccountAddr).withdrawCollateral(withdrawAmount);

        // Verify withdrawal
        CreditAccount creditAccount = CreditAccount(creditAccountAddr);
        assertEq(creditAccount.collateralBalance(), depositAmount - withdrawAmount, "Wrong collateral balance after withdrawal");
        assertEq(collateralToken.balanceOf(creditAccountAddr), depositAmount - withdrawAmount, "Wrong token balance after withdrawal");

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
        // assertEq(
        //     debtToken.balanceOf(user),
        //     initialBalance + borrowAmount,
        //     "Wrong token balance after borrow"
        // );

        vm.stopPrank();
    }

    function testRepayDebt() public {
        vm.startPrank(user);

        // Setup: Open account, deposit collateral, and incur debt
        creditManager.openCreditAccount(
            address(collateralToken),
            address(debtToken),
            address(liquidityPool),
            address(priceOracle)
        );

        uint256 depositAmount = 100 * 10**18;
        uint256 borrowAmount = 50 * 10**18;

        collateralToken.approve(address(creditManager.getCreditAccount(user)), depositAmount);
        creditManager.depositCollateral(depositAmount);
        creditManager.incurDebt(borrowAmount);

        // Repay half
        uint256 repayAmount = 25 * 10**18;
        debtToken.approve(address(creditManager.getCreditAccount(user)), repayAmount);
        creditManager.repayDebt(repayAmount);

        // Verify repayment
        address creditAccountAddr = creditManager.getCreditAccount(user);
        CreditAccount creditAccount = CreditAccount(creditAccountAddr);
        assertEq(creditAccount.debtAmount(), borrowAmount - repayAmount, "Wrong debt amount after repayment");

        vm.stopPrank();
    }

    function testGetLTV() public {
        vm.startPrank(user);

        // Setup: Open account, deposit collateral, and incur debt
        creditManager.openCreditAccount(
            address(collateralToken),
            address(debtToken),
            address(liquidityPool),
            address(priceOracle)
        );

        uint256 depositAmount = 100 * 10**18;
        uint256 borrowAmount = 50 * 10**18;

        collateralToken.approve(address(creditManager.getCreditAccount(user)), depositAmount);
        creditManager.depositCollateral(depositAmount);
        creditManager.incurDebt(borrowAmount);

        // Get LTV
        uint256 ltv = creditManager.getLTV(user);
        assertEq(ltv, 5000, "Wrong LTV ratio"); // 50% LTV = 5000 basis points

        vm.stopPrank();
    }

    function testLiquidation() public {
        vm.startPrank(user);

        // Setup: Open account with risky position
        creditManager.openCreditAccount(
            address(collateralToken),
            address(debtToken),
            address(liquidityPool),
            address(priceOracle)
        );

        uint256 depositAmount = 100 * 10**18;
        uint256 borrowAmount = 90 * 10**18; // 90% LTV

        collateralToken.approve(address(creditManager.getCreditAccount(user)), depositAmount);
        creditManager.depositCollateral(depositAmount);
        creditManager.incurDebt(borrowAmount);

        vm.stopPrank();

        // Liquidator calls liquidate
        vm.prank(user2);
        creditManager.liquidate(user);

        // Verify liquidation
        address creditAccountAddr = creditManager.getCreditAccount(user);
        assertEq(creditAccountAddr, address(0), "Credit account not removed after liquidation");
    }

    function testUpdateHealthRatio() public {
        uint256 newRatio = 1500; // 150%
        creditManager.updateHealthRatio(newRatio);
        assertEq(creditManager.healthRatio(), newRatio, "Health ratio not updated");
    }

    function testGetTotalCollateralValue() public {
        // Setup multiple accounts with collateral
        vm.startPrank(user);
        creditManager.openCreditAccount(
            address(collateralToken),
            address(debtToken),
            address(liquidityPool),
            address(priceOracle)
        );
        uint256 user1Deposit = 100 * 10**18;
        collateralToken.approve(address(creditManager.getCreditAccount(user)), user1Deposit);
        creditManager.depositCollateral(user1Deposit);
        vm.stopPrank();

        vm.startPrank(user2);
        creditManager.openCreditAccount(
            address(collateralToken),
            address(debtToken),
            address(liquidityPool),
            address(priceOracle)
        );
        uint256 user2Deposit = 200 * 10**18;
        collateralToken.approve(address(creditManager.getCreditAccount(user2)), user2Deposit);
        creditManager.depositCollateral(user2Deposit);
        vm.stopPrank();

        // Check total collateral value
        uint256 totalCollateral = creditManager.getTotalCollateralValue();
        assertEq(totalCollateral, (user1Deposit + user2Deposit), "Wrong total collateral value");
    }
}