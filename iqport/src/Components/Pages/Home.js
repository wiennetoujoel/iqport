import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import SearchBar from '../inc/SearchBar';

function Home(props) {
  {/*Pengambilan nilai kecamata, kota, dan provinsi */}
  const { kecamatan } = props;
  const [kota, setKota] = useState("");
  const [provinsi, setProvinsi] = useState("");

  useEffect((lokasi) => {
    fetch(`http://34.101.124.69:3300/main/5/tampil_lokasi`)
      .then((response) => response.json())
      .then((data) => {
        const kota = data[0].kota;
        const provinsi = data[0].provinsi;
        setKota(kota);
        setProvinsi(provinsi);
        console.log(kota)
        console.log(provinsi)
      })
      .catch((error) => console.error(error));
  }, [kecamatan]);
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

  {/*Pembuatan Waktu Realtime*/ }
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const date = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');

  //untuk hourly
  const dateStr = `${year}-${month}-${date}T${hours}:00:00`;
  const encodedDateStr = encodeURIComponent(dateStr);

  document.textContent = dateStr;

  useEffect((livepollutant) => {
    let url = "";

    url = `http://34.101.124.69:3300/main/1/realtime/${encodedDateStr}/${kecamatan}`;
=======
    url = `http://34.101.124.69:3300/main/1/realtime/${encodedDateStr}/{kecamatan}`;
>>>>>>> 9b267458651854cd25bce1308c57381cd524ddbb
    {/* Tampilan 5 parameter utama untuk 1 Kota*/ }
    fetch(url)
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
        console.log(pm25)
      });
  }, []);


  useEffect((liveranking) => {
    {/* Live ranking*/ }
    let liveUrl = "";
    liveUrl = `http://34.101.124.69:3300/main/5/live_ranking/${encodedDateStr}`;
    fetch(liveUrl)
      .then((response) => response.json())
      .then((data) => {
        // Sort the data by "rata_nilai_ispu" in descending order
        data.sort((a, b) => b.rata_nilai_ispu - a.rata_nilai_ispu);
        setRankingData(data);
      })
      .catch((error) => console.error(error));
  });

  useEffect((pollutantcolor) => {
    {/*Penentuan Warna Polutan */ }
    let url = "";
    url = `http://34.101.124.69:3300/main/1/realtime/${encodedDateStr}/${kecamatan}`;

    fetch(url)
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
  });

  useEffect((whoactions) => {
    {/*penentuan tindakan who*/ }
    let liveUrl = "";
    liveUrl = `http://34.101.124.69:3300/main/1/realtime/${encodedDateStr}/${kecamatan}`;
    fetch(liveUrl)
      .then(response => response.json())
      .then(data => {
        const tindakan = data[0].tindakan;
        document.getElementById("tindakanWHO").innerHTML = tindakan || "Data tidak ditemukan";

      })
      .catch(error => console.error(error));
  });



  return (
    <div className="home-container">
      <div className="d-flex align-items-center">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <h3 className="text-left mr-auto" style={{ marginLeft: "100px", marginBottom: "0" }}>{kecamatan}</h3>
          <p style={{ marginLeft: "100px" }}>{kota}, {provinsi}</p>
        </div>
        <SearchBar />
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
      <div className="konten card" style = {{margin : "100px"}}>
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
                          <span className="float-right">{item.rata_nilai_ispu}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
              <div className="anjuranWHO col-md-8" style = {{marginLeft : "50px"}}>
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
