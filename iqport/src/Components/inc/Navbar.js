import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
   return (
    <nav className="navbar navbar-expand-lg" >
      <Link to="/" className="navbar-brand">
        IQPort
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
            <Link to="/About" className="nav-link">
              About Us
            </Link>
          </li>
          {/*<li className="nav-item">
            <Link to="/Contact" className="nav-link">
              Contact Us
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/LocationFound" className="nav-link">
              LocationFound
            </Link>
          </li>*/}
        </ul>
        <div className="d-flex align-items-center">
          <FontAwesomeIcon icon={faUser} className="mr-3" />
          <span className="mr-4">Sign Up</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
