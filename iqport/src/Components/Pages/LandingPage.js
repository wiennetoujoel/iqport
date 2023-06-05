import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import '../../App.css';
import SearchBar from '../inc/SearchBar';
import Navbar from '../inc/Navbar';
import './LandingPage.css';
import Map from './Map.js';


function LandingPage() {


    return (
        <div>
            <div className="background">
                <div className="d-flex align-items-center" style={{ marginTop: "50px" }}>
                    <h2 className="title" style={{ color: "white", opacity: "0.95", marginTop: "10px", marginLeft: "15px" }}>
                        Explore Your <span className="break-line">Air Quality</span>
                    </h2>
                    <SearchBar />
                </div>
            </div>
        </div>

    );
}

export default LandingPage;


