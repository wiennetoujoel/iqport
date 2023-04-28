import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationPin } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';


function AirQualityPage() {
  const { location } = useParams();
  const [airQuality, setAirQuality] = useState("Good");
  const [pm25, setPm25] = useState('N/A');


  useEffect(() => {
    axios.get('http://34.101.124.69:3300/main/1/2023-04-05%2009:00:00/Andir')
      .then(response => {
        const data = response.data[0];
        setPm25(data.rata_konsentrasi_pm25);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div className="location-found-container">
      <h3 className="text-left my-2"><FontAwesomeIcon icon={faLocationPin} />Bandung {location}</h3>
      <div className="CurrentAQI card mb-3">
        <div className="card-body">
          <h5 className="">Current Air Quality</h5>
          <p className="card-text">{airQuality}</p>
        </div>
      </div>
      <div className="card-deck">
        <div className="card mt-5 border-0">
          <div className="card-body text-center">
            <h3>{pm25 ?? 'N/A'}</h3>
            <p>PM2.5</p>
          </div>
        </div>
        <div className="card mt-5 border-0">
          <div className="card-body text-center">
            <h3>Value</h3>
            <p>PM10</p>
          </div>
        </div>
        <div className="card mt-5 border-0">
          <div className="card-body text-center">
            <h3>Value</h3>
            <p>CO</p>
          </div>
        </div>
        <div className="card mt-5 border-0">
          <div className="card-body text-center">
            <h3>Value</h3>
            <p>Temperature</p>
          </div>
        </div>
        <div className="card mt-5 border-0">
          <div className="card-body text-center">
            <h3>Value</h3>
            <p>Humidity</p>
          </div>
        </div>
      </div>
      <div className="konten">
        <div className="row">
          <div className="col-md-12">
            <div className="row card-body">
              <div className="col-md-3 ml-3">
                <div className="ranking-list card">
                  <div className="card-body">
                    <h5>Kualitas Udara Kota Bandung{location} setiap stasiun</h5>
                    <ol>
                      <li>
                        Stasiun A
                        <span className="float-right">40 ppm</span>
                      </li>
                      <li>
                        Stasiun B
                        <span className="float-right">35 ppm</span>
                      </li>
                      <li>
                        Stasiun C
                        <span className="float-right">30 ppm</span>
                      </li>
                      <li>
                        Stasiun D
                        <span className="float-right">25 ppm</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
              <div className="anjuranWHO col-md-8">
                <div className="card">
                  <div className="card-body">
                    <h4> Anjuran WHO</h4>
                    <li> Tutup jendela untuk menghindari udara kotor </li>
                    <li> Gunakan masker saat berkegiatan di luar</li>
                    <li> Bernapaslah pakai hidung, jangan mulut</li>
                    <li> Jangan merokok</li>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mt-1">
          <div className="iklan card">
            <div className="card-body">
              <h5>Lorem Ipsum</h5>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at metus enim. Praesent bibendum mi tellus, porttitor auctor ex laoreet et. Nulla id augue eget arcu consequat semper. Morbi vehicula in ante quis pulvinar. Etiam quis lorem sagittis, egestas nunc ut, egestas risus. Aenean ex quam, viverra pretium tincidunt eu, ullamcorper id magna. Sed id ultricies mi. Vivamus consectetur, sapien vitae ullamcorper cursus, sem turpis consectetur neque, ut tincidunt tellus nulla eget lorem.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AirQualityPage;
