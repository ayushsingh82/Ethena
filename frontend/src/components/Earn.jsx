import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LIQUIDITY_POOL_ADDRESS, USDT_ADDRESS } from '../constants';
import { liquidityPoolABI, erc20ABI } from '../contracts/abis';
import { useAccount } from 'wagmi';
import { publicClient, walletClient } from '../config';

// Pool Card Component
const PoolCard = ({ token, apy, tvl, utilization, onSupply }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-neutral-900 rounded-xl p-6 hover:bg-neutral-800 transition-all"
  >
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold">{token.charAt(0)}</span>
        </div>
        <div>
          <h3 className="text-white font-bold">{token}</h3>
          <p className="text-gray-400 text-sm">Passive Pool</p>
        </div>
      </div>
      <button
        onClick={onSupply}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm transition-colors"
      >
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
  </motion.div>
);

const Earn = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const { address } = useAccount();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { request } = await publicClient.simulateContract({
        address: LIQUIDITY_POOL_ADDRESS,
        abi: liquidityPoolABI,
        functionName: 'deposit',
        args: [amount],
        account: address,
      });

      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      setSuccess('Deposit successful!');
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error during deposit:', err);
      setError('Failed to deposit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (token) => {
    setSelectedToken(token);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setAmount('');
    setError('');
    setSuccess('');
    setSelectedToken(null);
  };

  const poolsData = [
    {
      token: "DAI",
      apy: "3.95",
      tvl: "6.8M",
      utilization: "71.8"
    },
    {
      token: "USDe",
      apy: "4.12",
      tvl: "12.4M",
      utilization: "82.3"
    },
    {
      token: "USDT",
      apy: "2.85",
      tvl: "5.1M",
      utilization: "68.2"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-4 mt-[20px]">Passive Pools</h1>
          <p className="text-gray-400">Supply assets to earn passive yield through LeverYer Protocol</p>
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

        {/* Pool Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {poolsData.map((pool, index) => (
            <PoolCard
              key={index}
              token={pool.token}
              apy={pool.apy}
              tvl={pool.tvl}
              utilization={pool.utilization}
              onSupply={() => openModal(pool.token)}
            />
          ))}
        </div>
      </div>

      {/* Supply Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-800 p-6 rounded-xl w-[90%] max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">
              Supply {selectedToken}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-3 bg-black text-white border border-gray-600 rounded-lg pr-16"
                    placeholder="0.0"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {selectedToken}
                  </span>
                </div>
              </div>
              {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Supply'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Earn;