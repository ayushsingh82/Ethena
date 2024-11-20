import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import GetStarted from './components/GetStarted';
import Navbar from './components/Navbar';
import './index.css';
import Dashboard from './components/Dashboard';
import Earn from './components/Earn';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <div className="min-h-screen bg-black">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/getstarted" element={<GetStarted />} />
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/earn" element={<Earn/>}/>
          <Route path="/borrow" element={<div className="text-white p-8">Borrow Page</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  </React.StrictMode>
);
