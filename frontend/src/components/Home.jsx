import React from 'react';
import { motion } from 'framer-motion';
import { BackgroundLines } from "./ui/background-lines";
import { Spotlight } from "./ui/Spotlight";
import { HoverEffect } from "./ui/card-hover-effect";
import { BackgroundBeamsWithCollision } from "./ui/background-beams-with-collision";
import { Vortex } from "./ui/vortex";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faLinkedin, faDiscord } from '@fortawesome/free-brands-svg-icons';

function VortexDemo() {
    return (
      <div className="w-full mx-auto rounded-md h-[30rem] overflow-hidden">
        <Vortex
          backgroundColor="black"
          className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
        >
          <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
          LeverYer Protocol
          </h2>
          <p className="text-white text-lg md:text-xl text-center mt-4">
          Leveraging & Liquidity Layer of Ethena Network DeFi
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]">
              Launch App
            </button>
            <button className="px-4 py-2 text-white">Learn More</button>
          </div>
        </Vortex>
      </div>
    );
}

function BackgroundLinesDemo() {
    const data = [
      { title: "Total Value Locked", number: "$10M+" },
      { title: "Active Users", number: "1000+" },
      { title: "Total Loans", number: "5000+" },
    ];
  
    return (
      <div className="relative w-full h-full">
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/vidd.webm" type="video/webm" />
        </video>
  
        <BackgroundLines className="flex flex-col md:flex-row items-center justify-center w-full px-4 space-y-6 md:space-y-0 md:space-x-8 relative z-10">
          <div className="md:w-1/2 flex flex-col justify-center items-start">
            <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 font-bold tracking-tight">
              Protocol Stats
            </h2>
            <p className="max-w-xl text-sm md:text-lg text-neutral-700 dark:text-neutral-400">
              Leading DeFi protocol for lending and borrowing with innovative stablecoin mechanisms
            </p>
          </div>
  
          <div className="md:w-1/2 flex flex-col space-y-4">
            {data.map((box, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-b from-neutral-900 to-neutral-700 p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-white font-semibold text-lg w-3/4 md:w-1/2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <h1 className="text-xl">{box.title}</h1>
                <span className="text-2xl font-bold">{box.number}</span>
              </motion.div>
            ))}
          </div>
        </BackgroundLines>
      </div>
    );
}

function CardHoverEffectDemo() {
    return (
      <div className="mx-auto px-8 bg-black w-full">
        <h1 className='text-center text-white font-semibold text-4xl py-[30px]'>Protocol Features</h1>
        <HoverEffect items={projects} />
      </div>
    );
}

export const projects = [
    {
      title: "Stablecoin Minting",
      description: "Mint USDE stablecoins backed by your crypto collateral",
    },
    {
      title: "Yield Generation",
      description: "Earn competitive yields on your USDE deposits",
    },
    {
      title: "Overcollateralization",
      description: "Maintain safe collateral ratios with real-time monitoring",
    },
    {
      title: "Liquidation Protection",
      description: "Advanced mechanisms to protect user positions",
    },
    {
      title: "Price Oracle",
      description: "Reliable price feeds powered by Pyth Network",
    },
    {
      title: "Smart Contracts",
      description: "Audited and secure smart contract infrastructure",
    },
];

function Footer() {
    return (
      <footer className="bg-black text-white py-8 px-4">
        <hr className="border-t border-gray-600" />
        <div className="flex justify-between items-center max-w-screen-xl mx-auto">
          <div className="flex items-center flex flex-col">
            <h1 className='text-2xl font-semibold'>LeverYer Protocol</h1>
            <div className="flex space-x-4 mt-[10px]">
              <a href="https://twitter.com/EthenaLabs" target="_blank" rel="noopener noreferrer" className="text-white">
                <FontAwesomeIcon icon={faTwitter} size="lg" />
              </a>
              <a href="https://discord.gg/ethena" target="_blank" rel="noopener noreferrer" className="text-white">
                <FontAwesomeIcon icon={faDiscord} size="lg" />
              </a>
            </div>
          </div>
  
          <div className="flex flex-col items-center space-y-4">
            <h3 className="text-lg font-semibold mt-[20px]">Stay Updated</h3>
            <div className="flex space-x-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 bg-neutral-800 text-white rounded-md"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 text-white rounded-md">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </footer>
    );
}

const Home = () => {
  return (
    <div>
      <VortexDemo />
      <BackgroundLinesDemo />
      <CardHoverEffectDemo />
      <Footer />
    </div>
  );
};

export default Home;