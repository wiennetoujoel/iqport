import React from 'react';
import CustomGraph from './Components/inc/CustomGraph';
import MainGraph from './Components/inc/MainGraph';
import DateParam from './Components/inc/DateParam';
import Contact from './Components/Pages/Contact';
import Home from './Components/Pages/Home';
import Account from './Components/Pages/Account';
import Navbar from './Components/inc/Navbar';
import LandingPage from './Components/Pages/LandingPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar/>    
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/main-graph/:kecamatan" element={<MainGraph />} />
      </Routes>
    </Router>
  );
}

export default App;
