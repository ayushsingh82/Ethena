# LeverYer Protocol

<p align="center">
  <em>The Liquidity & Leverage Layer for DeFi on Ethena Network</em>
</p>

## Overview

LeverYer Protocol is a decentralized protocol that serves as the foundational liquidity & leverage layer for DeFi on Ethena Network. By consolidating liquidity and offering streamlined access to leverage on various DeFi protocols, LeverYer empowers users to maximize their capital efficiency while maintaining robust risk management.

## Key Features

- **Collateralized Lending**: Deposit assets as collateral and borrow against them
- **Passive Yield Generation**: Earn competitive yields by providing liquidity
- **Risk Management**: Advanced health monitoring and liquidation protection
- **Capital Efficiency**: Optimize asset utilization through leverage
- **Price Oracle Integration**: Real-time price feeds powered by Pyth Network
- **Smart Contract Security**: Audited and battle-tested infrastructure

## Technical Architecture

### Smart Contracts

- `CreditManager.sol`: Manages credit accounts and oversees lending operations
- `CreditAccount.sol`: Individual user accounts for collateral and debt management
- `LiquidityPool.sol`: Handles asset deposits and yield generation
- `PriceOracle.sol`: Provides reliable price feeds for risk calculations

### Development Setup

1. Install Dependencies

```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Install project dependencies
forge install
```

2. Build Contracts

```bash
forge build
```

3. Run Tests

```bash
forge test
```

### Frontend Development

1. Install Dependencies

```bash
cd frontend
npm install
```

2. Start Development Server

```bash
npm run dev
```

## Testing

The protocol includes comprehensive test coverage:

```bash
# Run all tests
forge test

# Run specific test file
forge test --match-path test/OpenCreditAccount.t.sol
forge test --match-path test/LiquidityPool.t.sol

# Run with gas reporting
forge test --gas-report
```

## Future Work

- [ ] Implement future yield as collateral (undercollateralized) borrowing
- [ ] Start integrating with other DeFi protocols on Ethena Network

## Security

- Smart contracts are designed with security best practices
- Integration with industry-standard price oracles
- Comprehensive testing suite
- Regular security audits (pending)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact & Resources

- Website: [leveryer.finance](https://leveryer.finance)
- Documentation: [docs.leveryer.finance](https://docs.leveryer.finance)
- Twitter: [@LeverYer](https://twitter.com/LeverYer)
- Discord: [Join our community](https://discord.gg/leveryer)

---

<p align="center">
  Built with ❤️ by the LeverYer Team
</p>
