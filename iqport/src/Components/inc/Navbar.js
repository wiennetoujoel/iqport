import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import SigninForm from '../Pages/SigninForm';
import './Navbar.css';

function Navbar() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [loggedIn, setLoggedIn] = useState(true);

  const [username, setUsername] = useState('joel');
  const [email, setEmail] = useState('joel@gmail.com');

  const openOverlay = () => {
    setShowOverlay(true);
  };

  const closeOverlay = () => {
    setShowOverlay(false);
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedIn");
    if (isLoggedIn) {
      const { username, email } = JSON.parse(isLoggedIn);
      setLoggedIn({
        loggedIn: true,
        email,
        username,
      });
    }
  }, []);

  const handleLogin = (email, username) => {
    setLoggedIn(true);
    setUsername(username);
    setEmail(email);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem("loggedIn");
  };


  const renderNavbar = () => {
    if (loggedIn.loggedIn) {
      // Jika ada pengguna yang login
      return (
        <div className="d-flex align-items-center">
          <div className="dropdown border-none mr-5">
            <button
              className="nav-link dropdown-toggle"
              type="button"
              id="adminDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ border: "0", background: "transparent", color:"white" }}

            >
              {loggedIn.photoURL ? (
                <img
                  src={loggedIn.photoURL}
                  alt="Profile"
                  className="mr-3"
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                  }}
                />
              ) : (
                <FontAwesomeIcon icon={faUser} className="mr-3" />
              )}
              <span className="mr-2">{loggedIn.username}</span>
            </button>
            <ul className="dropdown-menu" aria-labelledby="adminDropdown">
              <li>
                <button className="dropdown-item" onClick={handleLogout} style={{ zIndex: 1000 }}>
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    className="mr-2"
                  />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      );
    } else {
      // Jika tidak ada pengguna yang login
      return (
        <div className="d-flex align-items-center mr-5">
          <button
            className="nav-link"
            onClick={openOverlay}
            style={{ border: "0", background: "transparent" }}
          >
            <FontAwesomeIcon icon={faUser} className="mr-3" />
            <span className="mr-4" style={{color:"white"}}>Admin</span>
          </button>
        </div>
      );
    }
  };

  const adminDashboard = () => {
   
      return (
        <li className="nav-item">
          <Link to="/Dashboard" className="nav-link dashboard" style={{color:"white"}}>
            Dashboard
          </Link>
        </li>
      );
    
  }

  // JavaScript
window.addEventListener("scroll", function() {
  var navbar = document.querySelector(".navbar");
  navbar.classList.toggle("navbar-scrolled", window.scrollY > 0);
});


  return (
    <nav className="navbar fixed-top navbar-expand-lg navbar-dark p-md-3 transparent-navbar">
      <Link to="/" className="navbar-brand">
        AQPort
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/About" className="nav-link" style={{color:"white"}}>
              About Us
            </Link>
          </li>
          {adminDashboard()}
        </ul>
        {renderNavbar()}
      </div>
      {showOverlay && (
        <div className={`overlay ${showOverlay ? 'active' : ''}`} onClick={closeOverlay}>
          <div className="overlay-content" >
            <SigninForm handleLogin={handleLogin} />
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
