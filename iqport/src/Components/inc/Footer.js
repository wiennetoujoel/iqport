import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    const [isVisible, setIsVisible] = useState(false);
  
    useEffect(() => {
      const toggleVisibility = () => {
        const scrolledToBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight;
        setIsVisible(scrolledToBottom);
      };
  
      window.addEventListener('scroll', toggleVisibility);
  
      return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);
  
    return (
      <section className={`section footer bg-dark text-white ${isVisible ? 'visible' : ''}`}>
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h6>Ini footer</h6>
              <hr />
              <p className="text-white">asdnojasdnasjodnjosadnjnjoansjdonasdj</p>
            </div>
            <div className="col-md-4">
              <h6>Links</h6>
              <hr />
              <div><Link to="/">Home</Link></div>
              <div><Link to="/About">About Us</Link></div>
              <div><Link to="/Contact">Contact</Link></div>
            </div>
            <div className="col-md-4">
              <h6>Informasi Kontak</h6>
              <hr />
              <div><p className="text-white mb-1">Bandung Jawa Barat</p></div>
              <div><p className="text-white mb-1">082216220622</p></div>
              <div><p className="text-white mb-1">wiennetouj@gmail.com</p></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  export default Footer;