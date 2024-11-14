import React from 'react';
import { motion } from 'framer-motion';
import { BackgroundLines } from "../components/ui/background-lines";
import { Spotlight } from "../components/ui/Spotlight";
import { HoverEffect } from "../components/ui/card-hover-effect";
import { BackgroundBeamsWithCollision } from "../components/ui/background-beams-with-collision";
import { Vortex } from "../components/ui/vortex";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faLinkedin, faDiscord } from '@fortawesome/free-brands-svg-icons';

function VortexDemo() {
    return (
      <div className="w-full mx-auto rounded-md  h-[30rem] overflow-hidden">
        <Vortex
          backgroundColor="black"
          className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
        >
          <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
            Upgrading Soon
          </h2>
      
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]">
             Book demo
            </button>
            <button className="px-4 py-2  text-white ">Watch trailer</button>
          </div>
        </Vortex>
      </div>
    );
  }


  function Footer() {
    return (
      <footer className="bg-black text-white py-8 px-4">
           <hr className="border-t border-gray-600" />
        <div className="flex justify-between items-center max-w-screen-xl mx-auto">
          
          {/* Left side: Logo */}
          <div className="flex items-center flex flex-col">
           <h1 className='text-2xl font-semibold'>Invoice</h1>
          
           <div className="flex space-x-4 mt-[10px]">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white">
            <FontAwesomeIcon icon={faTwitter} size="lg" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white">
            <FontAwesomeIcon icon={faLinkedin} size="lg" />
          </a>
          <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-white">
            <FontAwesomeIcon icon={faDiscord} size="lg" />
          </a>
        </div>
          </div>
  
          {/* Center: Social Media Links */}
   
  
          {/* Right side: Sign up for updates */}
          <div className="flex flex-col items-center space-y-4">
            <h3 className="text-lg font-semibold mt-[20px]">Sign up for updates</h3>
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
  

function SpotlightPreview() {
    return (
      <div className="h-[40rem] w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />
        <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
          <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
            Spotlight <br /> is the new trend.
          </h1>

        </div>
      </div>
    );
  }

  function BackgroundBeamsWithCollisionDemo() {
    return (
      <BackgroundBeamsWithCollision>
        <div className="flex flex-col items-center justify-center min-h-screen">
          {/* Centered Heading */}
          <h2 className="text-2xl text-center relative z-20 md:text-2xl lg:text-4xl font-bold text-black dark:text-white font-sans tracking-tight">
            Our partner{" "}
            <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
              <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                {/* Empty div for styling */}
              </div>
              <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
                <span>Organisations & Projects.</span>
              </div>
            </div>
          </h2>
  
          {/* Floating Logos */}
          <div className="relative mt-10 text-center">
            <motion.div
              className="flex gap-10 justify-center"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                repeat: Infinity,
                repeatType: 'loop',
                duration: 12,  // Adjust speed here
                ease: 'linear',
              }}
            >
              <img
                src="https://www.optimism.io/optimism.svg"
                alt="Optimism Logo"
                className="h-12 w-36"
              />
              <img
                src="https://www.base.org/_next/static/media/logo.f6fdedfc.svg"
                alt="Base Logo"
                className="h-12 w-auto"
              />
              <img
                src="https://cryptologos.cc/logos/binance-coin-bnb-logo.png"
                alt="Binance Smart Chain Logo"
                className="h-12 w-auto"
              />
              <img
                src="https://cryptologos.cc/logos/avalanche-avax-logo.png"
                alt="Avalanche Logo"
                className="h-12 w-auto"
              />
              <img
                src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=024"
                alt="Ethereum Logo"
                className="h-12 w-auto"
              />
              <img
                src="https://cryptologos.cc/logos/arbitrum-arb-logo.svg?v=024"
                alt="Arbitrum Logo"
                className="h-12 w-auto"
              />
              <img
                src="https://cryptologos.cc/logos/polygon-matic-logo.svg?v=024"
                alt="Polygon Logo"
                className="h-12 w-auto"
              />
            </motion.div>
          </div>
        </div>
      </BackgroundBeamsWithCollision>
    );
  }
  
 
  
  function BackgroundLinesDemo1() {
    // Sample data with updated content for the boxes
    const data = [
      { 
        title: "Short to medium-term", 
     
        number: [
            "Templates for the major app types we support",
          "Integrate new payment networks without changing the smart contract",
          "Add Reference guides to the docs"
        ]
      },
      { 
        title: "Long-term", 
        number: [
            "Support non-EVM chains", 
          "Selective disclosure",
          "Private payments"
        ]
      }
    ];
  
    return (
      <>
        <BackgroundLines className="flex flex-col md:flex-row items-center justify-center w-full px-4 space-y-6 md:space-y-0 md:space-x-8">
          {/* Left Section */}
          <div className="md:w-1/2 flex flex-col justify-center items-start">
            <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-2xl lg:text-6xl font-sans py-2 md:py-10 font-bold tracking-tight">
              Upgrades roadmap <br /> 
            </h2>
         
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
           
                <div className="text-sm font-small space-y-1 mt-[20px]">
                  {box.number.map((point, idx) => (
                    <div key={idx} className="flex items-center">
                      <span className="text-xs mr-2">•</span>
                      <p>{point}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </BackgroundLines>
      </>
    );
  }
  
  

function BackgroundLinesDemo() {
  // Sample data with values
  const data = [
    { title: "Processed Volume", number: "100K+" },
    { title: "Average Transactions", number: "5K+" },
    { title: "Companies Supported", number: "200+" },
  ];

  return (
    <>
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
    </>
  );
}


function CardHoverEffectDemo() {
    return (
      <div className=" mx-auto px-8 bg-black w-full">
        <h1 className='text-center text-white font-semibold text-4xl py-[30px]'>Benefits</h1>
        <HoverEffect items={projects} />
      </div>
    );
  }
  export const projects = [
    {
      title: "Compilance",
      description:
        "Achieve regulatory adherence with transaction contextual data which we immutably inscript on the blockchain",
    
    },
    {
      title: "Reconciliation",
      description:
        "Streamline the payment request vs. payment settlement resolution through automation",
     
    },
    {
      title: "Ownership",
      description:
        "Build Web3 solutions with default financial data ownership and selective sharing for your users",
     
    },
    {
      title: "Network",
      description:
        "Leverage an ecosystem of financial builders so you don’t have to create everything from scratch",
  
    },
    {
      title: "Traceability",
      description:
        "Enable products that allow for sourcing and proof of origination for intermediary steps.",

    },
    {
      title: "Disruption",
      description:
        "Pioneer unprecedented Web3 innovations - triple-entry  accounting, income-backed lending, automated tax reporting",
    
    },
  ];
  
 
  
const Home = () => {
  return (
    <div>
      
      <BackgroundLinesDemo />
     <BackgroundBeamsWithCollisionDemo/>
     <CardHoverEffectDemo/>
     <VortexDemo/>
     <Footer/>
    </div>
  );
};

export default Home;
