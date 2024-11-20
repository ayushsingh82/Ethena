import React from 'react';
import { motion } from 'framer-motion';

const DashboardCard = ({ title, value, subtitle, className }) => (
  <div className={`bg-neutral-900 rounded-xl p-6 ${className}`}>
    <h3 className="text-gray-400 text-sm mb-2">{title}</h3>
    <p className="text-white text-2xl font-bold mb-1">{value}</p>
    {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
  </div>
);

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Overview Section */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard 
            title="Total Value Locked"
            value="$0.00"
            subtitle="Across all positions"
          />
          <DashboardCard 
            title="Available Credit"
            value="$0.00"
            subtitle="Maximum borrowing power"
          />
          <DashboardCard 
            title="Active Positions"
            value="0"
            subtitle="Current open positions"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="bg-neutral-900 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Your Positions</h2>
              <div className="text-center py-12 text-gray-400">
                <p>No active positions</p>
                <button className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition">
                  Open Position
                </button>
              </div>
            </div>

            <div className="bg-neutral-900 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Available Markets</h2>
              <div className="space-y-4">
                {['ETH', 'WBTC', 'USDC', 'DAI'].map((market) => (
                  <div key={market} className="flex justify-between items-center p-4 hover:bg-neutral-800 rounded-lg cursor-pointer">
                    <span>{market}</span>
                    <span className="text-gray-400">View →</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-neutral-900 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              <div className="text-center py-12 text-gray-400">
                <p>No recent activity</p>
              </div>
            </div>

            <div className="bg-neutral-900 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Risk Parameters</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Health Factor</span>
                  <span className="text-green-500">Healthy</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Liquidation Threshold</span>
                  <span>85%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Maximum LTV</span>
                  <span>75%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;