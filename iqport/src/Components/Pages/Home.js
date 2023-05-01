import React, { useState, useEffect, useRef } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons';




function Home() {
  {/* Tampilan 5 parameter utama untuk 1 Kota*/ }

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

  {/*Hook untuk searchbar */ }
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
      fetch(`http://34.101.124.69:3300/main/5/live_ranking/2023-02-23%2018:00:00`)
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
    fetch('http://34.101.124.69:3300/main/1/realtime/2023-05-01%2002:48:00/Coblong2')
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
    fetch("http://34.101.124.69:3300/main/5/live_ranking/2023-03-31%2023:00:00")
      .then((response) => response.json())
      .then((data) => {
        // Sort the data by "rata_nilai_ispu" in descending order
        data.sort((a, b) => b.rata_nilai_ispu - a.rata_nilai_ispu);
        setRankingData(data);
      })
      .catch((error) => console.error(error));
  }, []);


  {/*Penentuan Warna Polutan */ }
  fetch("http://34.101.124.69:3300/main/1/realtime/2023-05-01%2002:48:00/Coblong2")
    .then(response => response.json())
    .then(data => {
      //pm25
      const warna_konsentrasi_pm25 = data[0].warna_konsentrasi_pm25;
      let pm25Color;

      if (warna_konsentrasi_pm25 === "kuning") {
        pm25Color = "#FFE9A0";
      } else if (warna_konsentrasi_pm25 === "hijau") {
        pm25Color = "#B3FFAE";
      } else if (warna_konsentrasi_pm25 === "merah") {
        pm25Color = "#FF6464";
      } else {
        pm25Color = "#B0A4A4";
      }

      const warna_pm25 = data[0].rata_konsentrasi_pm25;
      document.getElementById("pm25").innerHTML = warna_pm25 ?? "N/A";

      const pm25Card = document.querySelector(".card.border-0 .pm25.card-body.text-center h3");
      pm25Card.style.setProperty("background-color", pm25Color);

      //pm10
      const warna_konsentrasi_pm10 = data[0].warna_konsentrasi_pm10;
      let pm10Color;

      if (warna_konsentrasi_pm10 === "kuning") {
        pm10Color = "#FFE9A0";
      } else if (warna_konsentrasi_pm10 === "hijau") {
        pm10Color = "#B3FFAE";
      } else if (warna_konsentrasi_pm10 === "merah") {
        pm10Color = "#FF6464";
      } else {
        pm10Color = "#B0A4A4";
      }

      const pm10 = data[0].rata_konsentrasi_pm10;
      document.getElementById("pm10").innerHTML = pm10 ?? "N/A";

      const pm10Card = document.querySelector(".card.border-0 .pm10.card-body.text-center h3");
      pm10Card.style.setProperty("background-color", pm10Color);

      //co
      const warna_konsentrasi_co = data[0].warna_konsentrasi_co;
      let coColor;

      if (warna_konsentrasi_co === "kuning") {
        coColor = "#FFE9A0";
      } else if (warna_konsentrasi_co === "hijau") {
        coColor = "#B3FFAE";
      } else if (warna_konsentrasi_co === "merah") {
        coColor = "#FF6464";
      } else {
        coColor = "#B0A4A4";
      }

      const co = data[0].rata_konsentrasi_co;
      document.getElementById("co").innerHTML = co ?? "N/A";

      const coCard = document.querySelector(".card.border-0 .co.card-body.text-center h3");
      coCard.style.setProperty("background-color", coColor);
    })
    .catch(error => console.error(error));


  {/*penentuan tindakan who*/ }
  fetch("http://34.101.124.69:3300/main/1/2023-04-05/Coblong1")
    .then(response => response.json())
    .then(data => {
      console.log(data)
      const tindakan = data.tindakan;
      document.getElementById("tindakanWHO").innerHTML = tindakan || "Data tidak ditemukan";
      console.log(tindakan)
    })
    .catch(error => console.error(error));
    

  return (
    <div className="home-container">
      <div className="d-flex align-items-center">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <h3 className="text-left mr-auto" style={{ marginLeft: "100px", marginBottom: "0" }}>Nama Kecamatan</h3>
          <p style={{ marginLeft: "100px" }}>Bandung, Jawa Barat</p>
        </div>
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

      <div className="CurrentAQI card mb-3" style={{ marginLeft: "100px", marginRight: "100px" }}>
        <div className="card-body">
          <h5 className="">Indeks Standar Pencemar Udara (ISPU)</h5>
          <p className="card-text">{ispu ?? "No data"} </p>
        </div>
      </div>
      <div className="card-deck">
        <div className="card border-0">
          <div className="card-body text-center">
            <p><strong>Temperature</strong></p>
            <h3>{temperatur ?? 'N/A'}°C</h3>
          </div>
        </div>
        <div className="card border-0"> 
          <div className="card-body text-center">
            <p><strong>Humidity</strong></p>
            <h3>{kelembapan ?? 'N/A'}%</h3>
          </div>
        </div>
      </div>
      <div className="card-deck">
        <div className="card border-0">
          <div className="pm25 card-body text-center">
            <p><strong>PM2.5</strong></p>
            <h3 id="pm25">
              {pm25 ?? "N/A"}
            </h3>
            <p>ug/m3</p>
          </div>
        </div>
        <div className="card border-0">
          <div className="pm10 card-body text-center">
            <p><strong>PM10</strong></p>
            <h3 id="pm10">
              {pm10 ?? 'N/A'}
            </h3>
            <p>ug/m3</p>
          </div>
        </div>
        <div className="card border-0">
          <div className="co card-body text-center">
            <p><strong>CO</strong></p>
            <h3 id="co">
              {co ?? 'N/A'}
            </h3>
            <p>ug/m3</p>
          </div>
        </div>
      </div>
      <div className="konten">
        <div className="row" style={{ marginLeft: "100px", marginRight: "10px" }}>
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
                          <span className="float-right">{item.rata_nilai_ispu.toFixed(2)}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
              <div className="anjuranWHO col-md-8">
                <div className="card">
                  <div className="card-body">
                    <h4>Anjuran WHO</h4>
                    <p id="tindakanWHO"></p>
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
