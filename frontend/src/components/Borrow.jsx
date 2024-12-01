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

  // return (
  //   // <p className="text-white text-md bg-gray-800 py-[5px] rounded-lg px-[20px]">
  //   //   The current price of USDE/USD is{' '}
  //   //   {usdePrice === null ? 'Loading...' : usdePrice}{' '}
  //   //   and sUSDe/USD is{' '}
  //   //   {susdePrice === null ? 'Loading...' : susdePrice}
  //   // </p>
  // );
};


const MarketCard = ({ asset, borrowRate, available, totalBorrowed }) => (
  <div className="bg-neutral-900 rounded-xl p-6 hover:bg-neutral-800 transition-all cursor-pointer">
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          {asset.charAt(0)}
        </div>
        <div>
          <h3 className="text-white font-bold">{asset}</h3>
          <p className="text-gray-400 text-sm">Credit Account</p>
        </div>
      </div>
      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm">
        Borrow
      </button>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-gray-400 text-sm mb-1">Borrow APR</p>
        <p className="text-white font-bold">{borrowRate}%</p>
      </div>
      <div>
        <p className="text-gray-400 text-sm mb-1">Available</p>
        <p className="text-white font-bold">${available}</p>
      </div>
      <div>
        <p className="text-gray-400 text-sm mb-1">Total Borrowed</p>
        <p className="text-white font-bold">${totalBorrowed}</p>
      </div>
      <div>
        <p className="text-gray-400 text-sm mb-1">Collateral Factor</p>
        <p className="text-white font-bold">80%</p>
      </div>
    </div>
  </div>
);

const Borrow = () => {
  const markets = [
    {
      asset: 'WETH',
      borrowRate: '4.32',
      available: '2.5M',
      totalBorrowed: '6.8M',
    },
    {
      asset: 'WBTC',
      borrowRate: '3.95',
      available: '1.8M',
      totalBorrowed: '4.2M',
    },
    {
      asset: 'USDC',
      borrowRate: '5.21',
      available: '8.4M',
      totalBorrowed: '15.6M',
    },
    {
      asset: 'DAI',
      borrowRate: '4.85',
      available: '3.2M',
      totalBorrowed: '8.9M',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
     <PriceDisplay/>
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-4 mt-[20px]">Borrow Markets</h1>
          <p className="text-gray-400">Borrow assets using your collateral through Credit Accounts</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-neutral-900 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm mb-2">Total Borrowed</h3>
            <p className="text-white text-2xl font-bold">$35.5M</p>
          </div>
          <div className="bg-neutral-900 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm mb-2">Available Liquidity</h3>
            <p className="text-white text-2xl font-bold">$15.9M</p>
          </div>
          <div className="bg-neutral-900 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm mb-2">Active Credit Accounts</h3>
            <p className="text-white text-2xl font-bold">892</p>
          </div>
        </div>

        {/* Markets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {markets.map((market, index) => (
            <motion.div
              key={market.asset}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <MarketCard {...market} />
            </motion.div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-neutral-900 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">How Credit Accounts Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">1. Deposit Collateral</h3>
              <p className="text-gray-400">Provide collateral to open a Credit Account</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">2. Borrow Assets</h3>
              <p className="text-gray-400">Borrow up to 80% of your collateral value</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">3. Manage Risk</h3>
              <p className="text-gray-400">Monitor your health factor to avoid liquidation</p>
            </div>
          </div>
        </div>

        {/* Risk Warning */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>⚠️ Borrowing assets involves risk. Please read our documentation before proceeding.</p>
        </div>
      </div>
    </div>
  );
};

export default Borrow;