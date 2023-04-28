import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faSearch } from '@fortawesome/free-solid-svg-icons';


function Home() {
  {/* Tampilan 5 parameter utama untuk 1 Kota*/ }

  const [airQuality, setAirQuality] = useState("Good");

  const [error, setError] = useState(null);

  {/*const untuk live ranking*/ }
  const [rankingData, setRankingData] = useState([]);

  {/* const untuk 5 data polutan utama*/ }
  const [pm25, setPm25] = useState(null);
  const [pm10, setPm10] = useState(null);
  const [co, setCo] = useState(null);
  const [temperatur, setTemperatur] = useState(null);
  const [kelembapan, setKelembapan] = useState(null);

  {/*const untuk nilai ispu */ }
  const [ispu, setIspu] = useState(null);

  {/*const untuk search bar*/ }
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const searchRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [searchRef]);

  const handleLocationChange = (event) => {
    const { value } = event.target;
    setLocation(value);

    if (value !== "") {
      fetch(`http://34.101.124.69:3300/main/5/live_ranking/2023-03-30%2009:00:00`)
        .then((response) => response.json())
        .then((data) => {
          const filteredLocations = data.filter((loc) =>
            loc.lokasi.toLowerCase().includes(value.toLowerCase())
          );
          setLocations(filteredLocations);
          setShowDropdown(true);
        })
        .catch((error) => console.log(error));
    } else {
      setShowDropdown(false);
      setLocations([]);
    }
  };


  useEffect(() => {
    {/* Tampilan 5 parameter utama untuk 1 Kota*/ }
    fetch('http://34.101.124.69:3300/main/1/2023-04-05/Andir')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('An error occurred while fetching data.');
        }
      })
      .then(data => {
        setPm25(data[0].rata_konsentrasi_pm25);
        setPm10(data[0].rata_konsentrasi_pm10);
        setCo(data[0].rata_konsentrasi_co);
        setTemperatur(data[0].rata_temperatur);
        setKelembapan(data[0].rata_kelembapan);

        setIspu(data[0].nilai_ispu)

      })
      .catch(error => {
        console.log(error);
        setError('An error occurred while fetching data.');
      });

    {/* Live ranking*/ }
    fetch("http://34.101.124.69:3300/main/5/live_ranking/2023-03-30%2009:00:00")
      .then((response) => response.json())
      .then((data) => {
        // Sort the data by "rata_nilai_ispu" in descending order
        data.sort((a, b) => b.rata_nilai_ispu - a.rata_nilai_ispu);
        setRankingData(data);
      })
      .catch((error) => console.error(error));

    {/*Penentuan Warna Polutan */}
      fetch('http://34.101.124.69:3300/main/1/2023-04-05/Andir')
      .then(response => response.json())
      .then(data => {
        const color_pm25 = data.rata_konsentrasi_pm25;
        const percentage = (color_pm25/50)*100;
        const element_pm25=document.getElementById("pm25 card-body text-center");
        element_pm25.style.background ="linear-gradient(to right, #00ff00, #000000" + percentage + "%)";
      })
      .catch(error => console.error(error));
  }, []);

  {/*search bar*/ }

  {/* Penentuan warna polutan */ }


  return (
    <div className="home-container">
      <div className="d-flex align-items-center">
        <h3 className="text-left  mr-auto" style={{ marginLeft: "20px" }}>Bandung </h3>
        <div className="search-bar" ref={searchRef} style={{ marginRight: "30px" }}>
          <form className="form-inline my-2 my-lg-0">
            <input
              className="form-control mr-sm-2"
              type="search"
              placeholder="Cari kecamatan"
              aria-label="Search"
              value={location}
              onChange={handleLocationChange}
            />
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>
          {showDropdown && (
            <div className="location-dropdown">
              {locations.filter((loc) => loc.lokasi.toLowerCase().includes(location.toLowerCase())).length === 0 ?
                <div className="location-item">No Result</div>
                :
                locations.map((loc) => (
                  <div key={loc.lokasi} className="location-item">
                    {loc.lokasi}
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </div>

      <div className="CurrentAQI card mb-3">
        <div className="card-body">
          <h5 className="">Indeks Standar Pencemar Udara (ISPU)</h5>
          <p className="card-text">{ispu}</p>
        </div>
      </div>
      <div className="card-deck">
      <div className ="pm25">
      <div className="card mt-5 border-0">
          <div className="pm25 card-body text-center">
            <h3>{pm25 ?? 'N/A'}</h3>
            <p>PM2.5</p>
          </div>
        </div>
      </div>
        <div className="card mt-5 border-0">
          <div className="card-body text-center">
            <h3>{pm10 ?? 'N/A'}</h3>
            <p>PM10</p>
          </div>
        </div>
        <div className="card mt-5 border-0">
          <div className="card-body text-center">
            <h3>{co ?? 'N/A'}</h3>
            <p>CO</p>
          </div>
        </div>
        <div className="card mt-5 border-0">
          <div className="card-body text-center">
            <h3>{temperatur ?? 'N/A'}</h3>
            <p>Temperature</p>
          </div>
        </div>
        <div className="card mt-5 border-0">
          <div className="card-body text-center">
            <h3>{kelembapan ?? 'N/A'}</h3>
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
                    <h5>Kualitas Udara Kota Bandung setiap stasiun</h5>
                    <ol>
                      {rankingData.map((item, index) => (
                        <li key={index}>
                          {item.lokasi}
                          <span className="float-right">{item.rata_nilai_ispu.toFixed(2)} ppm</span>
                        </li>
                      ))}
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
      </div>
    </div>
  );
}

export default Home;
