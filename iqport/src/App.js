import React from 'react';
import About from './Components/Pages/About';
import MainGraph from './Components/Pages/MainGraph';
import Contact from './Components/Pages/Contact';
import Home from './Components/Pages/Home';
import Account from './Components/Pages/Account';
import Navbar from './Components/inc/Navbar';
import Footer from './Components/inc/Footer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Home/>
        {/*<MainGraph/>*/}
      </div>
    </Router>
  );
}

export default App;
