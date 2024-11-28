// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/LiquidityPool.sol";
import "../src/USDT.sol";
import "../src/CreditManager.sol";

contract LiquidityPoolTest is Test {
    LiquidityPool public liquidityPool;
    USDT public usdt;
    CreditManager public creditManager;
    address public user;

    function setUp() public {
        // Deploy contracts
        usdt = new USDT();
        creditManager = new CreditManager(1200, address(0)); // Health ratio 120%, dummy oracle address
        liquidityPool = new LiquidityPool(
            IERC20(address(usdt)),
            "LP USDT",
            "lpUSDT",
            address(creditManager)
        );

        // Setup test user
        user = makeAddr("user");
        vm.deal(user, 100 ether);

        // Give user some USDT
        usdt.mint(user, 1000 * 10**18);
    }

    function testDeposit() public {
        // Switch to user context
        vm.startPrank(user);

        // Approve USDT spend
        uint256 depositAmount = 100 * 10**18;
        usdt.approve(address(liquidityPool), depositAmount);

        // Initial balances
        uint256 initialUserUSDT = usdt.balanceOf(user);
        uint256 initialPoolUSDT = usdt.balanceOf(address(liquidityPool));
        uint256 initialLPTokens = liquidityPool.balanceOf(user);

        // Perform deposit
        liquidityPool.deposit(depositAmount);

        // Final balances
        uint256 finalUserUSDT = usdt.balanceOf(user);
        uint256 finalPoolUSDT = usdt.balanceOf(address(liquidityPool));
        uint256 finalLPTokens = liquidityPool.balanceOf(user);

        // Assertions
        assertEq(finalUserUSDT, initialUserUSDT - depositAmount, "User USDT balance should decrease");
        assertEq(finalPoolUSDT, initialPoolUSDT + depositAmount, "Pool USDT balance should increase");
        assertEq(finalLPTokens, initialLPTokens + depositAmount, "User should receive LP tokens");

        vm.stopPrank();
    }

    function testFailDepositWithoutApproval() public {
        vm.startPrank(user);
        
        // Try to deposit without approval
        liquidityPool.deposit(100 * 10**18);
        
        vm.stopPrank();
    }

    function testFailDepositZero() public {
        vm.startPrank(user);
        
        // Try to deposit zero amount
        liquidityPool.deposit(0);
        
        vm.stopPrank();
    }

    function testFailDepositMoreThanBalance() public {
        vm.startPrank(user);
        
        uint256 userBalance = usdt.balanceOf(user);
        uint256 tooMuch = userBalance + 1 * 10**18;
        
        usdt.approve(address(liquidityPool), tooMuch);
        liquidityPool.deposit(tooMuch);
        
        vm.stopPrank();
    }
} 