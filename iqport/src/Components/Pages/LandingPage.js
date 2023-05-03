import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import '../../App.css';
import SearchBar from '../inc/SearchBar';


function LandingPage() {


    return (
        <div className="background">
            <div className="d-flex align-items-center">
                <SearchBar />
            </div>
        </div>
    );
}

export default LandingPage;


