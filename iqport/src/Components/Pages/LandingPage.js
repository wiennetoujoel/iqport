import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function LandingPage() {
  return (
    <div className="page-content">
      <div className="intro-text">
        <h2> Explore Your Air Quality </h2>
      </div>
      <div className="search-bar">
        <form className="form-inline my-2 my-lg-0">
          <input className="form-control mr-sm-2" type="search" placeholder="Search Location" aria-label="Search" />
          <button className="btn btn-outline-success my-2 my-sm-0" type="submit"><FontAwesomeIcon icon={faSearch} /></button>
        </form>
      </div>
    </div>
  );
}

export default LandingPage;
