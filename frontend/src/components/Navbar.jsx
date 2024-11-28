import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faLinkedin, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { ConnectButton } from '@rainbow-me/rainbowkit';

function Navbar() {
  return (
    <nav className="bg-black">
      <div className="flex flex-row mx-auto px-[40px] py-[25px] justify-between items-center">
        <div className="font-semibold text-lg text-white">
          <Link to="/">LeverYer Protocol</Link>
        </div>
        
        <div className="flex flex-1 justify-center space-x-8 text-center text-white">
          <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
          <Link to="/earn" className="hover:text-gray-300">Earn</Link>
          <Link to="/borrow" className="hover:text-gray-300">Borrow</Link>
        </div>

        <div className="flex items-center space-x-4">
          <ConnectButton />
          <div className="flex space-x-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
              <FontAwesomeIcon icon={faTwitter} size="lg" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
              <FontAwesomeIcon icon={faLinkedin} size="lg" />
            </a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
              <FontAwesomeIcon icon={faDiscord} size="lg" />
            </a>
          </div>
        </div>
      </div>
      <hr className="border-t border-gray-600" />
    </nav>
  );
}

export default Navbar;