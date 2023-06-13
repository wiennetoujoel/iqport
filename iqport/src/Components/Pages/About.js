import React from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './About.css'
import slide1 from '../images/first-meet.jpg';
import slide2 from '../images/in-sidang1.jpg';
import slide3 from '../images/in-sidang2.jpg';
import slide4 from '../images/award2.JPG';
import slide5 from '../images/plawid.jpg'

import kelvin from '../images/kelvin.JPG'
import ojan from '../images/ojan.JPG'
import joel from '../images/joel.JPG'



function About() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <div className="about-container">
            <header>
                <h2 style={{ paddingTop: "75px", color: "white", marginLeft: "20px" }}>Meet Our Team!</h2>
            </header>
            <div className="cards">
                <div className="card kelvin-card">
                    <img src={kelvin} alt="Kelvin" className="gambar-kelvin" />
                    <div className="card-header">
                        <h5 className="nama">Kelvin Sutirta</h5>
                        <h6 style={{ marginTop: "-10px" }}> 13219069</h6>
                        <p className="title"> Hardware Senior Engineer </p>
                    </div>
                </div>
                <div className="card ojan-card">
                    <img src={ojan} alt="Ojan" className="gambar-ojan" />
                    <div className="card-header">
                        <h5 className="nama">M. Izzatul Fauzan H</h5>
                        <h6 style={{ marginTop: "-10px" }}> 13219052</h6>
                        <p className="title"> Back-End Junior Engineer </p>
                    </div>
                </div>
                <div className="card joel-card">
                    <img src={joel} alt="Joel" className ="gambar-joel" />
                    <div className="card-header">
                        <h5 className="nama">Wiennetou Joel Hermesha</h5>
                        <h6 style={{ marginTop: "-10px" }}> 13219032</h6>
                        <p className="title"> Front-End Junior Engineer </p>
                    </div>
                </div>
            </div>



            <Slider {...settings} className="slider" style = {{marginBottom : "20px"}}>
                <div>
                    <img src={slide1} alt="Slide 1" />
                </div>
                <div>
                    <img src={slide2} alt="Slide 2" />
                </div>
                <div>
                    <img src={slide3} alt="Slide 3" />
                </div>      
                      
            </Slider>
        </div>
    );
}


export default About;   