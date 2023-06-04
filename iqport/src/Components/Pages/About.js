import React from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './About.css'
import slide1 from '../images/first-meet.jpg';
import slide2 from '../images/in-sidang1.jpg';
import slide3 from '../images/in-sidang2.jpg';



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
            <Slider {...settings} className="slider">
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