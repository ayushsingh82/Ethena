import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, change, isPositive }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-neutral-900 rounded-xl p-6"
  >
    <h3 className="text-gray-400 text-sm mb-2">{title}</h3>
    <p className="text-white text-2xl font-bold mb-2">{value}</p>
    {change && (
      <p className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? '↑' : '↓'} {change} (24h)
      </p>
    )}
  </motion.div>
);

const AssetCard = ({ asset, balance, value, apy }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-neutral-900 rounded-xl p-6"
  >
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold">{asset.charAt(0)}</span>
        </div>
        <div>
          <h3 className="text-white font-bold">{asset}</h3>
          <p className="text-gray-400 text-sm">Balance: {balance}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-white font-bold">${value}</p>
        <p className="text-green-500 text-sm">APY: {apy}%</p>
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  // Dummy data for protocol statistics
  const protocolStats = [
    { title: "Total Value Locked", value: "$32.5M", change: "2.5%", isPositive: true },
    { title: "Total Borrowed", value: "$18.2M", change: "1.8%", isPositive: true },
    { title: "Protocol Revenue", value: "$52.3K", change: "0.5%", isPositive: false },
    { title: "Active Users", value: "1,234", change: "3.2%", isPositive: true },
  ];

  // Dummy data for user's assets
  const userAssets = [
    { asset: "USDE", balance: "1,000.00", value: "1,000.00", apy: "4.12" },
    { asset: "sUSDe", balance: "500.00", value: "500.00", apy: "3.85" },
    { asset: "ETH", balance: "0.5", value: "1,250.00", apy: "2.50" },
  ];

  // Dummy data for recent transactions
  const recentTransactions = [
    { type: "Deposit", asset: "USDE", amount: "500.00", timestamp: "2024-02-20 14:30" },
    { type: "Borrow", asset: "sUSDe", amount: "200.00", timestamp: "2024-02-19 09:15" },
    { type: "Repay", asset: "sUSDe", amount: "100.00", timestamp: "2024-02-18 16:45" },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
          <p className="text-gray-400">Overview of your protocol activity</p>
        </div>

        {/* Protocol Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {protocolStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* User's Assets */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6">Your Assets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userAssets.map((asset, index) => (
              <AssetCard key={index} {...asset} />
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <h2 className="text-xl font-bold mb-6">Recent Transactions</h2>
          <div className="bg-neutral-900 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-800">
                <tr>
                  <th className="text-left p-4 text-gray-400">Type</th>
                  <th className="text-left p-4 text-gray-400">Asset</th>
                  <th className="text-left p-4 text-gray-400">Amount</th>
                  <th className="text-left p-4 text-gray-400">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx, index) => (
                  <tr key={index} className="border-t border-neutral-800">
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        tx.type === 'Deposit' ? 'bg-green-900 text-green-300' :
                        tx.type === 'Borrow' ? 'bg-blue-900 text-blue-300' :
                        'bg-red-900 text-red-300'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="p-4">{tx.asset}</td>
                    <td className="p-4">${tx.amount}</td>
                    <td className="p-4 text-gray-400">{tx.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;