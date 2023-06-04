import React, { useState, useEffect } from 'react';
import CustomGraph from './Components/inc/CustomGraph';
import MainGraph from './Components/inc/MainGraph';
import DateParam from './Components/inc/DateParam';
import Home from './Components/Pages/Home';
import Footer from './Components/inc/Footer';
import SigninForm from './Components/Pages/SigninForm';
import Navbar from './Components/inc/Navbar';
import LandingPage from './Components/Pages/LandingPage';
import Dashboard from './Components/Pages/Dashboard';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import About from './Components/Pages/About';

function App() {
  return (
    <Router>
      <Navbar className="transparent-navbar" />
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/main-graph/:kecamatan" element={<MainGraph />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/About" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
