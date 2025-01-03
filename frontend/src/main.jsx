import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './components/providers/Web3Provider';
import Home from './components/Home';
import GetStarted from './components/GetStarted';
import Navbar from './components/Navbar';
import './index.css';
import Dashboard from './components/Dashboard';
import Earn from './components/Earn';
import Borrow from './components/Borrow';
import '@rainbow-me/rainbowkit/styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Web3Provider>
      <BrowserRouter>
        <div className="min-h-screen bg-black">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/getstarted" element={<GetStarted />} />
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/earn" element={<Earn/>}/>
            <Route path="/borrow" element={<Borrow/>} />
          </Routes>
        </div>
      </BrowserRouter>
    </Web3Provider>
  </React.StrictMode>
);
