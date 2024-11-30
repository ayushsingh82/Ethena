// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract USDE is ERC20, Ownable {
    constructor() ERC20("Ethena USDe", "USDe") Ownable(msg.sender) {
        // Mint initial supply to deployer (1 million USDT)
        _mint(msg.sender, 1_000_000 * 10**18);  // Using 18 decimals
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
} 