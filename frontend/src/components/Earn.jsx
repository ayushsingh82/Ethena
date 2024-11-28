import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { PRICE_ORACLE_ADDRESS } from '../constants';
import { priceOracleABI } from '../contracts/abis';

// Create a Viem public client
const client = createPublicClient({
  chain: mainnet, // Adjust the chain based on your network
  transport: http(),
});

// Helper function to read contract data
const readPrice = async (address) => {
  try {
    const data = await client.readContract({
      address: PRICE_ORACLE_ADDRESS,
      abi: priceOracleABI,
      functionName: 'getAssetPrice',
      args: [address],
    });
    return data.toString(); // Convert result to string for display
  } catch (error) {
    console.error(`Error reading price for ${address}:`, error);
    return 'Error';
  }
};

// PriceDisplay Component to fetch and display prices
const PriceDisplay = () => {
  const [usdePrice, setUsdePrice] = useState(null);
  const [susdePrice, setSusdePrice] = useState(null);

  useEffect(() => {
    // Fetch prices for USDE and sUSDE
    const fetchPrices = async () => {
      const usde = await readPrice('0x426E7d03f9803Dd11cb8616C65b99a3c0AfeA6dE'); // USDE address
      const susde = await readPrice('0x80f9Ec4bA5746d8214b3A9a73cc4390AB0F0E633'); // sUSDe address
      setUsdePrice(usde);
      setSusdePrice(susde);
    };

    fetchPrices();
  }, []);

  return (
    <p className="text-white text-md bg-gray-800 py-[5px] rounded-lg px-[20px]">
      The current price of USDE/USD is{' '}
      {usdePrice === null ? 'Loading...' : usdePrice}{' '}
      and sUSDe/USD is{' '}
      {susdePrice === null ? 'Loading...' : susdePrice}
    </p>
  );
};

const PoolCard = ({ asset, apy, tvl, utilization }) => (
  <div className="bg-neutral-900 rounded-xl p-6 hover:bg-neutral-800 transition-all cursor-pointer">
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          {asset.charAt(0)}
        </div>
        <div>
          <h3 className="text-white font-bold">{asset}</h3>
          <p className="text-gray-400 text-sm">Passive Pool</p>
        </div>
      </div>
      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm">
        Supply
      </button>
    </div>

    <div className="grid grid-cols-3 gap-4">
      <div>
        <p className="text-gray-400 text-sm mb-1">APY</p>
        <p className="text-white font-bold">{apy}%</p>
      </div>
      <div>
        <p className="text-gray-400 text-sm mb-1">TVL</p>
        <p className="text-white font-bold">${tvl}</p>
      </div>
      <div>
        <p className="text-gray-400 text-sm mb-1">Utilization</p>
        <p className="text-white font-bold">{utilization}%</p>
      </div>
    </div>
  </div>
);

const Earn = () => {
  const pools = [
    {
      asset: 'WETH',
      apy: '3.21',
      tvl: '8.2M',
      utilization: '76.5',
    },
    {
      asset: 'WBTC',
      apy: '2.85',
      tvl: '5.1M',
      utilization: '68.2',
    },
    {
      asset: 'USDC',
      apy: '4.12',
      tvl: '12.4M',
      utilization: '82.3',
    },
    {
      asset: 'DAI',
      apy: '3.95',
      tvl: '6.8M',
      utilization: '71.8',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <PriceDisplay />

        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-4 mt-[20px]">Passive Pools</h1>
          <p className="text-gray-400">Supply assets to earn passive yield through Gearbox Protocol</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-neutral-900 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm mb-2">Total Value Locked</h3>
            <p className="text-white text-2xl font-bold">$32.5M</p>
          </div>
          <div className="bg-neutral-900 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm mb-2">Total Daily Yield</h3>
            <p className="text-white text-2xl font-bold">$12.3K</p>
          </div>
          <div className="bg-neutral-900 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm mb-2">Active Suppliers</h3>
            <p className="text-white text-2xl font-bold">1,234</p>
          </div>
        </div>

        {/* Pools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pools.map((pool, index) => (
            <motion.div
              key={pool.asset}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <PoolCard {...pool} />
            </motion.div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-neutral-900 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">1. Supply Assets</h3>
              <p className="text-gray-400">Deposit your crypto assets into the passive pools</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">2. Earn Yield</h3>
              <p className="text-gray-400">Earn passive income from lending fees and protocol rewards</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">3. Withdraw Anytime</h3>
              <p className="text-gray-400">Withdraw your assets and earnings at any time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earn;
