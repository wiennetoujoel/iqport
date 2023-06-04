import React from 'react';
import './Footer.css'; // Import the CSS file for styling

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="column">
          <h4 className="column-title">Kolom Pertama</h4>
          <ul className="column-list">
            <li>TA222301018</li>
            <li>Kelvin Sutirta</li>
            <li>M. Izzatul Fauzan</li>
            <li>Wiennetou Joel</li>
          </ul>
        </div>
        <div className="column">
          <h4 className="column-title">Kolom Kedua</h4>
          <p className="column-text">Copyright 2023</p>
        </div>
        <div className="column">
          <h4 className="column-title">Kolom Ketiga</h4>
          <ul className="column-list">
            <li>Pembimbing:</li>
            <li>Elvayandri</li>
            <li>Nana Sutisna</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
