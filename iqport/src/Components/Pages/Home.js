import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import SearchBar from '../inc/SearchBar';
import './Home.css';


function Home(props) {
  const [updatedData, setUpdatedData] = useState(null);

  {/*Pengambilan nilai kecamata, kota, dan provinsi */ }
  const { kecamatan } = props;
  const [kota, setKota] = useState("");
  const [provinsi, setProvinsi] = useState("");

  useEffect((lokasi) => {
    fetch(`https://aqport.my.id/main/5/tampil_lokasi`)
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

  const [encodedDateStr, setEncodedDateStr] = useState('');

  const updateEncodedDateStr = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const date = now.getDate().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');

    const dateStr = `${year}-${month}-${date}T${hours}:${minutes}:00`;
    const encodedDate = encodeURIComponent(dateStr);
    setEncodedDateStr(encodedDate);

  };



  useEffect(() => {
    updateEncodedDateStr();

    const interval = setInterval(() => {
      updateEncodedDateStr();
    }, 60000); // Memperbarui waktu setiap 1 menit

    return () => {
      clearInterval(interval); // Membersihkan interval saat komponen di-unmount
    };
  }
    , []);


  useEffect(() => {
    const fetchData = () => {
      const startTime = performance.now(); // Waktu awal

      let url = `https://aqport.my.id/main/1/realtime/${encodedDateStr}/${kecamatan}`;

      fetch(url)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('An error occurred while fetching data.');
          }
        })
        .then(data => {
          const endTime = performance.now(); // Waktu akhir
          const latency = endTime - startTime; // Perhitungan latency

          console.log(`Latency Live Pollutant: ${latency} milliseconds`);

          setPm25(data[0].rata_konsentrasi_pm25);
          setPm10(data[0].rata_konsentrasi_pm10);
          setCo(data[0].rata_konsentrasi_co);
          setTemperatur(data[0].rata_temperatur);
          setKelembapan(data[0].rata_kelembapan);
          setIspu(data[0].nilai_ispu);
        })
        .catch(error => {
          console.log(error);
          setError('An error occurred while fetching data.');
        });
    };

    fetchData(); // Initial fetch

    const interval = setInterval(fetchData, 60000); // Fetch every 1 minute

    return () => {
      clearInterval(interval); // Clean up interval on component unmount
    };
  }, [encodedDateStr, kecamatan]);


  // untuk penentuan warna
  function calculateColor(startColor, endColor, percentage) {
    const startRGB = hexToRgb(startColor);
    const endRGB = hexToRgb(endColor);

    const r = Math.round(startRGB.r + (endRGB.r - startRGB.r) * (percentage / 100));
    const g = Math.round(startRGB.g + (endRGB.g - startRGB.g) * (percentage / 100));
    const b = Math.round(startRGB.b + (endRGB.b - startRGB.b) * (percentage / 100));

    return rgbToHex(r, g, b);
  }

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }



  useEffect(() => {
    {/* Live ranking*/ }
    let liveUrl = "";
    liveUrl = `https://aqport.my.id/main/5/live_ranking/${encodedDateStr}`;
    fetch(liveUrl)
      .then((response) => response.json())
      .then((data) => {
        setRankingData(data);

        // Loop through each data item
        data.forEach((item, index) => {
          const ispu_ranking = item.rata_nilai_ispu;
          let ispuColor;
          let ispuTextColor = "";

          // Apply color based on the value range
          if (ispu_ranking >= 0 && ispu_ranking <= 50) {
            const percentage = Math.round(((ispu_ranking - 0) / (50 - 0)) * 100);
            ispuColor = calculateColor("#00ff00", "#ffff00", percentage);
          } else if (ispu_ranking >= 51 && ispu_ranking <= 100) {
            const percentage = Math.round(((ispu_ranking - 51) / (100 - 51)) * 100);
            ispuColor = calculateColor("#ffff00", "#ff7f00", percentage);
          } else if (ispu_ranking >= 101 && ispu_ranking <= 150) {
            const percentage = Math.round(((ispu_ranking - 101) / (150 - 101)) * 100);
            ispuColor = calculateColor("#ff7f00", "#ff0000", percentage);
          } else if (ispu_ranking >= 151 && ispu_ranking <= 200) {
            const percentage = Math.round(((ispu_ranking - 151) / (200 - 151)) * 100);
            ispuColor = calculateColor("#ff0000", "#800080", percentage);
          } else if (ispu_ranking >= 201 && ispu_ranking <= 300) {
            const percentage = Math.round(((ispu_ranking - 201) / (300 - 201)) * 100);
            ispuColor = calculateColor("#800080", "#000000", percentage);
          } else {
            ispuColor = "#000000"; // Default color for other cases
          }

          // Mengatur tampilan elemen dengan ID "ranking-{index}"
          const nilaiIspuElement = document.getElementById(`ranking-${index}`);
          if (nilaiIspuElement) {
            nilaiIspuElement.innerHTML = ispu_ranking ?? "N/A";
            nilaiIspuElement.style.backgroundColor = ispuColor;
            ispuTextColor = ispuColor === "#000000" ? "#ffffff" : "#000000";
            nilaiIspuElement.style.color = ispuTextColor;
          }
        });
      })
      .catch((error) => console.error(error));
  });
  

  useEffect((pollutantcolor) => {
    {/*Penentuan Warna Polutan */ }
    const fetchData = () => {
      let url = "";
      url = `https://aqport.my.id/main/1/realtime/${encodedDateStr}/${kecamatan}`;

      fetch(url)
        .then(response => response.json())
        .then(data => {

          //pm25      
          const pm25 = data[0].rata_konsentrasi_pm25;
          let pm25Color;
          let pm25TextColor = "";

          if (pm25 >= 0 && pm25 <= 12) {
            const percentage = Math.round(((pm25 - 0) / (12 - 0)) * 100);
            pm25Color = calculateColor("#00ff00", "#ffff00", percentage);
          } else if (pm25 >= 12.1 && pm25 <= 35.4) {
            const percentage = Math.round(((pm25 - 12.1) / (35.4 - 12.1)) * 100);
            pm25Color = calculateColor("#ffff00", "#ff7f00", percentage);
          } else if (pm25 >= 35.5 && pm25 <= 55.4) {
            const percentage = Math.round(((pm25 - 35.5) / (55.4 - 35.5)) * 100);
            pm25Color = calculateColor("#ff7f00", "#ff0000", percentage);
          } else if (pm25 >= 55.5 && pm25 <= 150.4) {
            const percentage = Math.round(((pm25 - 55.5) / (150.4 - 55.5)) * 100);
            pm25Color = calculateColor("#ff0000", "#800080", percentage);
          } else if (pm25 >= 150.5 && pm25 <= 250.4) {
            const percentage = Math.round(((pm25 - 150.5) / (250.4 - 150.5)) * 100);
            pm25Color = calculateColor("#800080", "#000000", percentage);
          } else {
            pm25Color = "#000000"; // Default color for other cases
          }

          document.getElementById("pm25").innerHTML = pm25 ?? "N/A";

          pm25TextColor = pm25Color === "#000000" ? "#ffffff" : "#000000";

          const pm25Card = document.querySelector(".card.border-0 .pm25.card-body.text-center h3");
          pm25Card.style.backgroundColor = pm25Color;
          pm25Card.style.color = pm25TextColor;

          //pm10
          const pm10 = data[0].rata_konsentrasi_pm10;
          let pm10Color;
          let pm10TextColor = "";

          if (pm10 >= 0 && pm10 <= 54) {
            const percentage = Math.round(((pm10 - 0) / (54 - 0)) * 100);
            pm10Color = calculateColor("#00ff00", "#ffff00", percentage);
          } else if (pm10 >= 55 && pm10 <= 154) {
            const percentage = Math.round(((pm10 - 55) / (154 - 55)) * 100);
            pm10Color = calculateColor("#ffff00", "#ff7f00", percentage);
          } else if (pm10 >= 155 && pm10 <= 254) {
            const percentage = Math.round(((pm10 - 155) / (254 - 155)) * 100);
            pm10Color = calculateColor("#ff7f00", "#ff0000", percentage);
          } else if (pm10 >= 255 && pm10 <= 354) {
            const percentage = Math.round(((pm10 - 255) / (354 - 255)) * 100);
            pm10Color = calculateColor("#ff0000", "#800080", percentage);
          } else if (pm10 >= 355 && pm10 <= 424) {
            const percentage = Math.round(((pm10 - 355) / (424 - 355)) * 100);
            pm10Color = calculateColor("#800080", "#000000", percentage);
          } else {
            pm10Color = "#000000"; // Default color for other cases
          }


          document.getElementById("pm10").innerHTML = pm10 ?? "N/A";
          pm10TextColor = pm10Color === "#000000" ? "#ffffff" : "#000000";

          const pm10Card = document.querySelector(".card.border-0 .pm10.card-body.text-center h3");
          pm10Card.style.backgroundColor = pm10Color;
          pm10Card.style.color = pm10TextColor;

          //co
          const co = data[0].rata_konsentrasi_co;
          let coColor;
          let coTextColor = "";

          if (co >= 0 && co <= 4.4) {
            const percentage = Math.round(((co - 0) / (4.4 - 0)) * 100);
            coColor = calculateColor("#00ff00", "#ffff00", percentage);
          } else if (co >= 4.5 && co <= 9.4) {
            const percentage = Math.round(((co - 4.5) / (9.4 - 4.5)) * 100);
            coColor = calculateColor("#ffff00", "#ff7f00", percentage);
          } else if (co >= 9.5 && co <= 12.4) {
            const percentage = Math.round(((co - 9.5) / (12.4 - 9.5)) * 100);
            coColor = calculateColor("#ff7f00", "#ff0000", percentage);
          } else if (co >= 12.5 && co <= 15.4) {
            const percentage = Math.round(((co - 12.5) / (15.4 - 12.5)) * 100);
            coColor = calculateColor("#ff0000", "#800080", percentage);
          } else if (co >= 15.5 && co <= 30.4) {
            const percentage = Math.round(((co - 15.5) / (30.4 - 15.5)) * 100);
            coColor = calculateColor("#800080", "#000000", percentage);
          } else {
            coColor = "#000000"; // Default color for other cases
          }

          document.getElementById("co").innerHTML = co ?? "N/A";
          coTextColor = coColor === "#000000" ? "#ffffff" : "#000000";

          const coCard = document.querySelector(".card.border-0 .co.card-body.text-center h3");
          coCard.style.backgroundColor = coColor;
          coCard.style.color = coTextColor;

          //ispu
          const warna_ispu = data[0].nilai_ispu;
          let ispuColor;
          let ispuTextColor = "";
          let message;

          if (warna_ispu >= 0 && warna_ispu <= 50) {
            const percentage = Math.round(((warna_ispu - 0) / (50 - 0)) * 100);
            ispuColor = calculateColor("#00ff00", "#ffff00", percentage);
            message = "Good";
          } else if (warna_ispu >= 51 && warna_ispu <= 100) {
            const percentage = Math.round(((warna_ispu - 51) / (100 - 51)) * 100);
            ispuColor = calculateColor("#ffff00", "#ff7f00", percentage);
            message = "Moderate";
          } else if (warna_ispu >= 101 && warna_ispu <= 150) {
            const percentage = Math.round(((warna_ispu - 101) / (150 - 101)) * 100);
            ispuColor = calculateColor("#ff7f00", "#ff0000", percentage);
            message = "Unhealthy for Sensitive Groups";
          } else if (warna_ispu >= 151 && warna_ispu <= 200) {
            const percentage = Math.round(((warna_ispu - 151) / (200 - 151)) * 100);
            ispuColor = calculateColor("#ff0000", "#800080", percentage);
            message = "Unhealthy";
          } else if (warna_ispu >= 201 && warna_ispu <= 300) {
            const percentage = Math.round(((warna_ispu - 201) / (300 - 201)) * 100);
            ispuColor = calculateColor("#800080", "#000000", percentage);
            message = "Very Unhealthy";
          } else {
            ispuColor = "#000000"; // Default color for other cases
            message = "Hazardous";
          }

          // Mengatur tampilan elemen dengan ID "nilaiIspu"
          const nilaiIspuElement = document.getElementById("nilaiIspu");
          nilaiIspuElement.innerHTML = warna_ispu ?? "N/A";
          nilaiIspuElement.style.backgroundColor = ispuColor;


          ispuTextColor = ispuColor === "#000000" ? "#ffffff" : "#000000";
          nilaiIspuElement.style.color = ispuTextColor;

          document.getElementById("messageIspu").innerHTML = message;
        })
        .catch(error => console.error(error));
    }

    fetchData(); // Initial fetch

    const interval = setInterval(fetchData, 60000); // Fetch every 1 minute

    return () => {
      clearInterval(interval); // Clean up interval on component unmount
    };
  }, [encodedDateStr, kecamatan]);

  useEffect(() => {
    {/*penentuan tindakan who*/ }
    let liveUrl = "";
    liveUrl = `https://aqport.my.id/main/1/realtime/${encodedDateStr}/${kecamatan}`;
    const startTime = performance.now(); // Waktu awal
    fetch(liveUrl)
      .then(response => response.json())
      .then(data => {
        const tindakan = data[0].tindakan;
        const formattedTindakan = tindakan.replace(/\.\n/g, "<br><br>");
        document.getElementById("tindakanWHO").innerHTML = formattedTindakan || "Data tidak ditemukan";

        const endTime = performance.now(); // Waktu akhir
        const latency = endTime - startTime; // Perhitungan latency

        console.log(`Latency Tindakan WHO: ${latency} milliseconds`);
      })
      .catch(error => console.error(error));
  });

  //untuk hover 5 polutan utama
  const [ispm25Hovered, setIspm25Hovered] = useState(false);
  const [ispm10Hovered, setIspm10Hovered] = useState(false);
  const [iscoHovered, setIscoHovered] = useState(false);

  const pm25HandleMouseEnter = () => {
    setIspm25Hovered(true);
  };

  const pm25HandleMouseLeave = () => {
    setIspm25Hovered(false);
  };

  const pm10HandleMouseEnter = () => {
    setIspm10Hovered(true);
  };

  const pm10HandleMouseLeave = () => {
    setIspm10Hovered(false);
  };

  const coHandleMouseEnter = () => {
    setIscoHovered(true);
  };

  const coHandleMouseLeave = () => {
    setIscoHovered(false);
  };



  return (
    <div className="home-container" style={{ marginTop: "50px" }}>
      <div className="d-flex align-items-center">
        <div className="informasiKota" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <h3 className="text-left mr-auto" style={{ margin: "0 20px" }}>{kecamatan}</h3>
          <p style={{ margin: "0 20px" }}>{kota}, {provinsi}</p>
        </div>
        <SearchBar />
      </div>
      <div className="row">
        <div className="kolom-kiri col">
          <div className="CurrentAQI card mb-3" style={{ backgroundColor: "rgb(236, 242, 255)" }}>
            <div className="card-body col d-flex align-items-center">
              <div id="nilaiIspu" className="nilai-ISPU card-body d-flex align-items-center justify-content-center" style={{ backgroundColor: "red", maxWidth: "100px", borderRadius: "10px" }}>
                <p className="card-text" style={{ fontWeight: "bold", fontSize: "30px", textAlign: "center", margin: "0 auto" }}>{ispu ?? "No data"}</p>
              </div>
              <div>
                <h5 className="penulisan-ispu" style={{ marginLeft: "5px" }}>Indeks Standar Pencemar Udara (ISPU)</h5>
                <p id="messageIspu" style={{ fontSize: "18px", margin: "0", marginTop: "5px", marginLeft: "5px" }}></p>
              </div>
            </div>
          </div>
          <div className="card-deck-wrapper" style={{ backgroundColor: "rgb(236, 242, 255)" }}>
            <div className="card-deck">
              <div
                className="card border-0"
                style={{ backgroundColor: "transparent" }}
              >
                <div className="card-body text-center">
                  <p><strong>Temperature</strong></p>
                  <h3>{temperatur ?? 'N/A'}°C</h3>
                </div>
              </div>
              <div className="card border-0" style={{ backgroundColor: "transparent" }}>
                <div className="card-body text-center">
                  <p><strong>Humidity</strong></p>
                  <h3>{kelembapan ?? 'N/A'}%</h3>
                </div>
              </div>
            </div>
            <div className="card-deck">
              <div className="card border-0"
                style={{ backgroundColor: "transparent" }}
                onMouseEnter={pm25HandleMouseEnter}
                onMouseLeave={pm25HandleMouseLeave}
              >
                <div className="pm25 card-body text-center" style={{ cursor: "pointer" }}>
                  <p><strong>PM2.5</strong></p>
                  <h3 id="pm25">
                    {pm25 ?? "N/A"}
                  </h3>
                  <p>µg/m3</p>
                  {ispm25Hovered && (
                    <div className="pm25-overlay">
                      <div className="pm25-overlay-content">
                        <div className="pm25-overlay-column">
                          <p>PM2.5</p>
                          <p>PM2.5 (Particular Matter 2.5) adalah partikel partikel udara yang berukuran lebih kecil dari 2.5 mikrometer </p>
                          <p>Paparan PM2.5 berlebih dapat menyebabkan gangguan saluran pernafasan, kanker paru-paru, dan penyakit paru-paru obstruktif kronis</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="card border-0" style={{ backgroundColor: "transparent" }}>
                <div className="pm10 card-body text-center" style={{ cursor: "pointer" }} onMouseEnter={pm10HandleMouseEnter} onMouseLeave={pm10HandleMouseLeave}>
                  <p><strong>PM10</strong></p>
                  <h3 id="pm10">{pm10 ?? 'N/A'}</h3>
                  <p>µg/m3</p>
                  {ispm10Hovered && (
                    <div className="pm10-overlay">
                      <div className="pm10-overlay-content">
                        <div className="pm10-overlay-column">
                          <p>PM10</p>
                          <p>PM10 (Particular Matter 10) adalah partikel partikel udara yang berukuran lebih kecil dari 10 mikrometer </p>
                          <p>Paparan PM10 berlebih dapat menyebabkan reaksi radang paru-paru dan ISPA</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="card border-0" style={{ backgroundColor: "transparent" }}>
                <div className="co card-body text-center" style={{ cursor: "pointer" }} onMouseEnter={coHandleMouseEnter} onMouseLeave={coHandleMouseLeave}>
                  <p><strong>CO</strong></p>
                  <h3 id="co">{co ?? 'N/A'}</h3>
                  <p>ppm</p>
                  {iscoHovered && (
                    <div className="co-overlay">
                      <div className="co-overlay-content">
                        <div className="co-overlay-column">
                          <p>CO</p>
                          <p>CO (Carbon Monoxide) adalah gas tak berwarna, tidak berwarna, dan tidak berbau yang dihasilkan dari pembakaran gas, minyak, dan bahan bakar padat</p>
                          <p>Paparan CO berlebih menyebabkan gangguan pada kerja jantung, sistem saraf pusat, dan saluran pernapasan</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="kolom-kanan col">
          <div className="penjelasan-polutan card" style={{ backgroundColor: "rgb(236, 242, 255)" }}>
            <h5 style={{ marginTop: "10px", marginLeft: "15px" }}>Pollutant Measurement</h5>
            <div className="ISPU" style={{ margin: " 20px", marginBottom: "0px", marginTop: "0" }}>
              ISPU
              <div className="color-bar" style={{ marginBottom: "0", margin: "20px auto", width: "95%", height: "20px", borderRadius: "10px", background: "linear-gradient(to right, #00ff00 0%, #ffff00 20%, #ff7f00 40%, #ff0000 60%, #800080 80%, #000000 100%)" }}>
                <div className="scale">
                  <div className="scale-item" data-value="0">
                    <span className="scale-value0" style={{ right: "90%" }}> 0</span>
                    <span className="scale-label">Good</span>
                  </div>
                  <div className="scale-item" data-value="51">
                    <span className="scale-value">51</span>
                    <span className="scale-label">Moderate</span>
                    <span className="vertical-line"></span>
                  </div>
                  <div className="scale-item" data-value="101">
                    <span className="scale-value">101</span>
                    <span className="scale-label">
                      <span class="scale-label-line1">Unhealthy for</span>
                      <span class="scale-label-line2"> sensitive groups</span>
                    </span>
                    <span className="vertical-line"></span>
                  </div>
                  <div className="scale-item" data-value="151">
                    <span className="scale-value">151</span>
                    <span className="scale-label">Unhealthy</span>
                    <span className="vertical-line"></span>
                  </div>
                  <div className="scale-item" data-value="201">
                    <span className="scale-value">201</span>
                    <span className="scale-label">Very Unhealthy</span>
                    <span className="vertical-line"></span>
                  </div>
                  <div className="scale-item" data-value="301">
                    <span className="scale-value-max">301</span>
                    <span className="scale-label">Hazardous</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="PM25" style={{ margin: " 20px", marginBottom: "10px" }}>
              {'PM25 (µg/m3)'}
              <div className="color-bar" style={{ marginBottom: "0px", margin: "20px auto", width: "95%", height: "20px", borderRadius: "10px", background: "linear-gradient(to right, #00ff00 0%, #ffff00 20%, #ff7f00 40%, #ff0000 60%, #800080 80%, #000000 100%)" }}>
                <div className="scale">
                  <div className="scale-item" data-value="0">
                    <span className="scale-value0" style={{ right: "90%" }}> 0</span>
                    <span className="scale-label">Good</span>
                  </div>
                  <div className="scale-item" data-value="12">
                    <span className="scale-value">12</span>
                    <span className="scale-label">Moderate</span>
                    <span className="vertical-line"></span>
                  </div>
                  <div className="scale-item" data-value="35">
                    <span className="scale-value">35</span>
                    <span className="scale-label">
                      <span class="scale-label-line1">Unhealthy for</span>
                      <span class="scale-label-line2"> sensitive groups</span>
                    </span>
                    <span className="vertical-line"></span>
                  </div>
                  <div className="scale-item" data-value="55">
                    <span className="scale-value">55</span>
                    <span className="scale-label">Unhealthy</span>
                    <span className="vertical-line"></span>
                  </div>
                  <div className="scale-item" data-value="150">
                    <span className="scale-value">150</span>
                    <span className="scale-label">Very Unhealthy</span>
                    <span className="vertical-line"></span>
                  </div>
                  <div className="scale-item" data-value="250">
                    <span className="scale-value-max">250</span>
                    <span className="scale-label">Hazardous</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="PM10" style={{ margin: " 20px", marginBottom: "10px" }}>
              {'PM10 (µg/m3)'}
              <div className="color-bar" style={{ marginBottom: "0", margin: "20px auto", width: "95%", height: "20px", borderRadius: "10px", background: "linear-gradient(to right, #00ff00 0%, #ffff00 20%, #ff7f00 40%, #ff0000 60%, #800080 80%, #000000 100%)" }}>
                <div className="scale">
                  <div className="scale-item" data-value="0">
                    <span className="scale-value0" style={{ right: "90%" }}> 0</span>
                    <span className="scale-label">Good</span>
                  </div>
                  <div className="scale-item" data-value="55">
                    <span className="scale-value">55</span>
                    <span className="scale-label">Moderate</span>
                    <span className="vertical-line"></span>
                  </div>
                  <div className="scale-item" data-value="155">
                    <span className="scale-value">155</span>
                    <span className="scale-label">
                      <span class="scale-label-line1">Unhealthy for</span>
                      <span class="scale-label-line2"> sensitive groups</span>
                    </span>
                    <span className="vertical-line"></span>
                  </div>
                  <div className="scale-item" data-value="255">
                    <span className="scale-value">255</span>
                    <span className="scale-label">Unhealthy</span>
                    <span className="vertical-line"></span>
                  </div>
                  <div className="scale-item" data-value="355">
                    <span className="scale-value">355</span>
                    <span className="scale-label">Very Unhealthy</span>
                    <span className="vertical-line"></span>
                  </div>
                  <div className="scale-item" data-value="425">
                    <span className="scale-value-max">425</span>
                    <span className="scale-label">Hazardous</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="CO" style={{ margin: " 20px", marginBottom: "55px" }}>
              {'CO (ppm)'}
              <div className="color-bar" style={{ marginBottom: "0", margin: "20px auto", width: "95%", height: "20px", borderRadius: "10px", background: "linear-gradient(to right, #00ff00 0%, #ffff00 20%, #ff7f00 40%, #ff0000 60%, #800080 80%, #000000 100%)" }}>
                <div className="scale">
                  <div className="scale-item" data-value="0">
                    <span className="scale-value0" style={{ right: "90%" }}> 0</span>
                    <span className="scale-label">Good</span>
                  </div>
                  <div className="scale-item" data-value="4.5">
                    <span className="scale-value">4.5</span>
                    <span className="scale-label">Moderate</span>
                    <span className="vertical-line"></span>
                  </div>
                  <div className="scale-item" data-value="9.5">
                    <span className="scale-value">9.5</span>
                    <span className="scale-label">
                      <span class="scale-label-line1">Unhealthy for</span>
                      <span class="scale-label-line2"> sensitive groups</span>
                    </span>
                    <span className="vertical-line"></span>
                  </div>
                  <div className="scale-item" data-value="12.5">
                    <span className="scale-value">12.5</span>
                    <span className="scale-label">Unhealthy</span>
                    <span className="vertical-line"></span>
                  </div>
                  <div className="scale-item" data-value="15.5">
                    <span className="scale-value">15.5</span>
                    <span className="scale-label">Very Unhealthy</span>
                    <span className="vertical-line"></span>
                  </div>
                  <div className="scale-item" data-value="30.5">
                    <span className="scale-value-max">30.5</span>
                    <span className="scale-label">Hazardous</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="rank-who row card-body" style={{ marginTop: "20px", marginLeft: "10px" }}>
        <div className="col-md">
          <div className="ranking-list card" style={{ width: "580px", backgroundColor: "rgb(236, 242, 255)" }}>
            <div className="card-body">
              <h5>Kualitas Udara Kota Bandung setiap stasiun</h5>
              <ol>
                {rankingData.map((item, index) => (
                  <li key={index}>
                    {item.lokasi}
                    <span id={`ranking-${index}`} className="nilai-ranking float-right card-body">{item.rata_nilai_ispu}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
        <div className="anjuranWHO col" style={{ marginRight: "20px" }}>
          <div className="card" style={{ backgroundColor: "rgb(236, 242, 255)" }}>
            <div className="card-body">
              <h5>Anjuran WHO</h5>
              <p id="tindakanWHO"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
