import React from 'react';
import { motion } from 'framer-motion';
import { BackgroundLines } from "../components/ui/background-lines";

function BackgroundLinesDemo() {
  // Sample data with values
  const data = [
    { title: "Processed Volume", number: "100K+" },
    { title: "Average Transactions", number: "5K+" },
    { title: "Companies Supported", number: "200+" },
  ];

  return (
    <BackgroundLines className="flex flex-col md:flex-row items-center justify-center w-full px-4 space-y-6 md:space-y-0 md:space-x-8">
      {/* Left Section */}
      <div className="md:w-1/2 flex flex-col justify-center items-start">
        <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 font-bold tracking-tight">
          Invoice <br /> powered by ENS.
        </h2>
        <p className="max-w-xl text-sm md:text-lg text-neutral-700 dark:text-neutral-400">
          Financial Infrastructure <br />
          for Builders to create web3 payments easy
        </p>
      </div>

      {/* Right Section */}
      <div className="md:w-1/2 flex flex-col space-y-4">
        {data.map((box, index) => (
          <motion.div
            key={index}
            className="bg-gradient-to-b from-neutral-900 to-neutral-700 p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-white font-semibold text-lg w-3/4 md:w-1/2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <h1 className="text-xl">{box.title}</h1>
            <h2 className="text-sm mb-2">{box.subtitle}</h2>
            <span className="text-2xl font-bold">{box.number}</span>
          </motion.div>
        ))}
      </div>
    </BackgroundLines>
  );
}

const Home = () => {
  return (
    <div>
      <BackgroundLinesDemo />
    </div>
  );
};

export default Home;
