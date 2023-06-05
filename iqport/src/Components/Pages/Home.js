import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import SearchBar from '../inc/SearchBar';
import './Home.css';
import { faTimes } from "@fortawesome/free-solid-svg-icons";


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

  {/* const untuk 5 data polutan utama*/ }
  const [pm25, setPm25] = useState(null);
  const [pm10, setPm10] = useState(null);
  const [co, setCo] = useState(null);
  const [temperatur, setTemperatur] = useState(null);
  const [kelembapan, setKelembapan] = useState(null);

  {/*const untuk nilai ispu */ }
  const [ispu, setIspu] = useState(null);

  {/*const untu last update live pollutant */ }
  const [lastUpdate, setLastUpdate] = useState('');

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

  const getCurrentTime = () => {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    // Format waktu dengan menambahkan nol di depan jika nilainya kurang dari 10
    const formattedTime = `${day}/${month}/${year} ${addLeadingZero(hours)}:${addLeadingZero(minutes)}:${addLeadingZero(seconds)}`;

    return formattedTime;
  };

  const addLeadingZero = (value) => {
    return value < 10 ? `0${value}` : value;
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
          }
        })
        .then(data => {
          const endTime = performance.now(); // Waktu akhir
          const latency = endTime - startTime; // Perhitungan latency


          console.log(`Latency Live Pollutant: ${latency} milliseconds`);
          console.log(`Waktu realtime ${encodedDateStr} dengan kecamatan ${kecamatan}`)

          setPm25(data[0].rata_konsentrasi_pm25);
          setPm10(data[0].rata_konsentrasi_pm10);
          setCo(data[0].rata_konsentrasi_co);
          setTemperatur(data[0].rata_temperatur);
          setKelembapan(data[0].rata_kelembapan);
          setIspu(data[0].nilai_ispu);
          setLastUpdate(getCurrentTime());
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


  {/*const untuk live ranking*/ }
  const [rankingData, setRankingData] = useState([]);
  const [nilaiIspuElements, setNilaiIspuElements] = useState([]);

  const fetchRankingData = async () => {
    try {
      const liveUrl = `https://aqport.my.id/main/5/live_ranking/${encodedDateStr}`;
      const response = await fetch(liveUrl);
      const data = await response.json();

      const startTime = performance.now();

      const updatedRankingData = data.map((item, index) => {
        const ispu_ranking = item.rata_nilai_ispu;
        let ispuColor;
        let ispuTextColor = "";

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

        const endTime = performance.now(); // Waktu akhir
        const latency = endTime - startTime; // Perhitungan latency

        console.log(`Latency Live Ranking: ${latency} milliseconds`);


        return {
          ...item,
          ispuColor,
          ispuTextColor,
        };
      });

      const updatedNilaiIspuElements = Array.from({ length: updatedRankingData.length }, (_, index) => {
        const ispu_ranking = updatedRankingData[index].rata_nilai_ispu;
        const ispuColor = updatedRankingData[index].ispuColor;
        const ispuTextColor = ispuColor === "#000000" ? "#ffffff" : "#000000";

        return {
          id: `ranking-${index}`,
          value: ispu_ranking,
          backgroundColor: ispuColor,
          ispuTextColor,
        };
      });

      setRankingData(updatedRankingData);
      setNilaiIspuElements(updatedNilaiIspuElements);
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchRankingData();
  }, [encodedDateStr]);


  useEffect(() => {
    const interval = setInterval(() => {
      fetchRankingData(); // Panggil kembali fungsi fetchRankingData() untuk memperbarui data
    }, 60000); // Set interval 1 menit

    return () => clearInterval(interval); // Clear interval ketika komponen tidak lagi digunakan atau di-unmount
  }, []);

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
            message = "Baik";
          } else if (warna_ispu >= 51 && warna_ispu <= 100) {
            const percentage = Math.round(((warna_ispu - 51) / (100 - 51)) * 100);
            ispuColor = calculateColor("#ffff00", "#ff7f00", percentage);
            message = "Sedang";
          } else if (warna_ispu >= 101 && warna_ispu <= 150) {
            const percentage = Math.round(((warna_ispu - 101) / (150 - 101)) * 100);
            ispuColor = calculateColor("#ff7f00", "#ff0000", percentage);
            message = "Tidak Sehat untuk Grup Sensitif";
          } else if (warna_ispu >= 151 && warna_ispu <= 200) {
            const percentage = Math.round(((warna_ispu - 151) / (200 - 151)) * 100);
            ispuColor = calculateColor("#ff0000", "#800080", percentage);
            message = "Tidak Sehat";
          } else if (warna_ispu >= 201 && warna_ispu <= 300) {
            const percentage = Math.round(((warna_ispu - 201) / (300 - 201)) * 100);
            ispuColor = calculateColor("#800080", "#000000", percentage);
            message = "Sangat Tidak Sehat";
          } else {
            ispuColor = "#000000"; // Default color for other cases
            message = "Berbahaya";
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
  }, [encodedDateStr, kecamatan]);


  //untuk informasi lebih lanjut 3 polutan utama
  const [pm25OverlayVisible, setPM25OverlayVisible] = useState(false);
  const [pm10OverlayVisible, setPM10OverlayVisible] = useState(false);
  const [coOverlayVisible, setCoOverlayVisible] = useState(false);

  const pm25ToggleOverlay = () => {
    setPM25OverlayVisible(!pm25OverlayVisible);
  };

  const pm10ToggleOverlay = () => {
    setPM10OverlayVisible(!pm10OverlayVisible);
  };

  const coToggleOverlay = () => {
    setCoOverlayVisible(!coOverlayVisible);
  };

  const handleOutsideClick = (event) => {
    if (pm25OverlayVisible && !event.target.closest('.pm25-overlay')) {
      setPM25OverlayVisible(false);
    }
    if (pm10OverlayVisible && !event.target.closest('.pm10-overlay')) {
      setPM10OverlayVisible(false);
    }
    if (coOverlayVisible && !event.target.closest('.co-overlay')) {
      setCoOverlayVisible(false);
    }
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
        <div className="kolom-kiri col" style={{ minHeight: "600px" }}>
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
                  <p><strong>Temperatur</strong></p>
                  <h3>{temperatur ?? 'N/A'}°C</h3>
                </div>
              </div>
              <div className="card border-0" style={{ backgroundColor: "transparent" }}>
                <div className="card-body text-center">
                  <p><strong>Kelembaban</strong></p>
                  <h3>{kelembapan ?? 'N/A'}%</h3>
                </div>
              </div>
            </div>
            <div className="card-deck">
              <div className="card border-0" style={{ backgroundColor: "transparent" }}>
                <div className="pm25 card-body text-center">
                  <div className="pm25-header">
                    <strong>PM2.5</strong>
                    <div className="info-icon" onClick={pm25ToggleOverlay}>
                      <FontAwesomeIcon icon={faInfoCircle} />
                    </div>
                  </div>
                  <h3 id="pm25">{pm25 ?? 'N/A'}</h3>
                  <p>µg/m3</p>
                  {pm25OverlayVisible && (
                    <div className="pm25-overlay" onClick={pm25ToggleOverlay}>
                      <div className="pm25-overlay-content">
                        <div className="pm25-overlay-column paragraph-column" style={{ width: "66.66%" }}>
                          <div className="close-button" onClick={pm25ToggleOverlay}>
                            <FontAwesomeIcon icon={faTimes} style={{ cursor: "pointer" }} />
                          </div>
                          <p style={{ fontSize: "15px" }}>PM2.5</p>
                          <p style={{ textAlign: "justify", fontSize: "11px" }}>
                            PM2.5 (Particular Matter 2.5) adalah partikel-partikel udara yang berukuran lebih kecil dari 2.5 mikrometer
                          </p>
                          <p style={{ textAlign: "justify", fontSize: "11px" }}>
                            Paparan PM2.5 berlebih dapat menyebabkan gangguan saluran pernafasan, kanker paru-paru, dan penyakit paru-paru obstruktif kronis
                          </p>
                        </div>
                        <div className="pm25-overlay-column color-bar-column" style={{ width: "33.33%", position: "relative", left: "50px" }}>
                          <div className="color-bar" style={{ width: "20px", height: "200px", borderRadius: "10px", background: "linear-gradient(to bottom, #00ff00 0%, #ffff00 20%, #ff7f00 40%, #ff0000 60%, #800080 80%, #000000 100%)" }}>
                            <div className="scale" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end", height: "100%" }}>
                              <div className="scale-item" data-value="0">
                                <span className="scale-value0 pm25-0-value" style={{ position: "relative", top: "-15px", left: "11px" }}>0</span>
                                <span className="scale-label pm25-0" style={{ position: "relative", top: "-15px", left: "25px" }}>Baik</span>
                              </div>
                              <div className="scale-item" data-value="12">
                                <span className="scale-value pm25-12-value" style={{ position: "relative", left: "8px", top: "5px" }}>12</span>
                                <span className="scale-label pm25-12" style={{ position: "relative", left: "40px", top: "5px" }}>Sedang</span>
                                <span className="horizontal-line"></span>
                              </div>
                              <div className="scale-item" data-value="35">
                                <span className="scale-value pm25-35-value" style={{ position: "relative", left: "64px", top: "25px" }}>35</span>
                                <span className="scale-label pm25-35-label ">
                                  <span className="scale-label-line1 pm25-35-line1" style={{ position: "relative", top: "10px", left: "105px", display: "inline-block", width: "100px" }}>Tidak sehat</span>
                                  <span className="scale-label-line2 pm25-35-line2" style={{ position: "relative", top: "10px", left: "105px" }}> untuk grup sensitif</span>
                                </span>

                              </div>
                              <div className="scale-item" data-value="55">
                                <span className="scale-value pm25-55-value" style={{ position: "relative", left: "43px", top: "13px" }}>55</span>
                                <span className="scale-label pm25-55" style={{ position: "relative", top: "-2px", left: "85px", display: "inline-block", width: "80px" }}>Tidak Sehat</span>

                              </div>
                              <div className="scale-item" data-value="150">
                                <span className="scale-value pm25-150-value" style={{ position: "relative", left: "38px", top: "13px" }}>150</span>
                                <span className="scale-label pm25-150" style={{ position: "relative", top: "-2px", left: "85px", display: "inline-block", width: "80px" }}>Sangat Tidak Sehat</span>

                              </div>
                              <div className="scale-item" data-value="250">
                                <span className="scale-value-max pm25-250-value" style={{ position: "relative", left: "44px", top: "15px" }}>250</span>
                                <span className="scale-label pm25-250" style={{ position: "relative", left: "52px", top: "15px" }}>Berbahaya</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="card border-0" style={{ backgroundColor: "transparent" }}>
                <div className="pm10 card-body text-center">
                  <div className="pm10-header">
                    <strong>PM10</strong>
                    <div className="info-icon" onClick={pm10ToggleOverlay}>
                      <FontAwesomeIcon icon={faInfoCircle} />
                    </div>
                  </div>
                  <h3 id="pm10">{pm10 ?? 'N/A'}</h3>
                  <p>µg/m3</p>
                  {pm10OverlayVisible && (
                    <div className="pm10-overlay" onClick={pm10ToggleOverlay}>
                      <div className="pm10-overlay-content">
                        <div className="pm10-overlay-column paragraph-column" style={{ width: "66.66%" }}>
                          <div className="close-button" onClick={pm10ToggleOverlay}>
                            <FontAwesomeIcon icon={faTimes} style={{ cursor: "pointer" }} />
                          </div>
                          <p style={{ fontSize: "15px" }}>PM10</p>
                          <p style={{ textAlign: "justify", fontSize: "11px" }}>
                            PM10 (Particular Matter 10) adalah partikel partikel udara yang berukuran lebih kecil dari 10 mikrometer
                          </p>
                          <p style={{ textAlign: "justify", fontSize: "11px" }}>
                            Paparan PM10 berlebih dapat menyebabkan reaksi radang paru-paru dan ISPA
                          </p>
                        </div>
                        <div className="pm10-overlay-column color-bar-column" style={{ width: "33.33%", position: "relative", left: "50px" }}>
                          <div className="color-bar" style={{ width: "20px", height: "200px", borderRadius: "10px", background: "linear-gradient(to bottom, #00ff00 0%, #ffff00 20%, #ff7f00 40%, #ff0000 60%, #800080 80%, #000000 100%)" }}>
                            <div className="scale" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end", height: "100%" }}>
                              <div className="scale-item" data-value="0">
                                <span className="scale-value0 pm10-0-value" style={{ position: "relative", top: "-15px", left: "11px" }}>0</span>
                                <span className="scale-label pm10-0" style={{ position: "relative", top: "-15px", left: "25px" }}>Baik</span>
                              </div>
                              <div className="scale-item" data-value="55">
                                <span className="scale-value pm10-55-value" style={{ position: "relative", left: "8px", top: "5px" }}>55</span>
                                <span className="scale-label pm10-55" style={{ position: "relative", left: "40px", top: "5px" }}>Sedang</span>
                                <span className="horizontal-line"></span>
                              </div>
                              <div className="scale-item" data-value="155">
                                <span className="scale-value pm10-155-value" style={{ position: "relative", left: "59px", top: "25px" }}>155</span>
                                <span className="scale-label pm10-155-label">
                                  <span className="scale-label-line1 pm10-155-line1" style={{ position: "relative", top: "10px", left: "105px", display: "inline-block", width: "100px" }}>Tidak sehat</span>
                                  <span className="scale-label-line2 pm10-155-line2" style={{ position: "relative", top: "10px", left: "105px" }}> untuk grup sensitif</span>
                                </span>

                              </div>
                              <div className="scale-item" data-value="255">
                                <span className="scale-value pm10-255-value" style={{ position: "relative", left: "38px", top: "13px" }}>255</span>
                                <span className="scale-label pm10-255" style={{ position: "relative", top: "-2px", left: "85px", display: "inline-block", width: "80px" }}>Tidak Sehat</span>

                              </div>
                              <div className="scale-item" data-value="355">
                                <span className="scale-value pm10-355-value" style={{ position: "relative", left: "38px", top: "13px" }}>355</span>
                                <span className="scale-label pm10-355" style={{ position: "relative", top: "-2px", left: "85px", display: "inline-block", width: "80px" }}>Sangat Tidak Sehat</span>
                              </div>
                              <div className="scale-item" data-value="425">
                                <span className="scale-value-max pm10-425-value" style={{ position: "relative", left: "44px", top: "15px" }}>425</span>
                                <span className="scale-label pm10-425" style={{ position: "relative", left: "52px", top: "15px" }}>Berbahaya</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="card border-0" style={{ backgroundColor: "transparent" }}>
                <div className="co card-body text-center" >
                  <div className="co-header">
                    <strong>CO</strong>
                    <div className="info-icon" onClick={coToggleOverlay}>
                      <FontAwesomeIcon icon={faInfoCircle} />
                    </div>
                  </div>
                  <h3 id="co">{co ?? 'N/A'}</h3>
                  <p>ppm</p>
                  {coOverlayVisible && (
                    <div className="co-overlay" onClick={coToggleOverlay}>
                      <div className="co-overlay-content">
                        <div className="co-overlay-column paragraph-column" style={{ width: "66.66%" }}>
                          <div className="close-button" onClick={coToggleOverlay}>
                            <FontAwesomeIcon icon={faTimes} style={{ cursor: "pointer" }} />
                          </div>
                          <p style={{ fontSize: "15px" }}>CO</p>
                          <p style={{ textAlign: "justify", fontSize: "11px" }}>
                            CO (Carbon Monoxide) adalah gas tak berwarna, tidak berwarna, dan tidak berbau yang dihasilkan dari pembakaran gas, minyak, dan bahan bakar padat
                          </p>
                          <p style={{ textAlign: "justify", fontSize: "11px" }}>
                            Paparan CO berlebih menyebabkan gangguan pada kerja jantung, sistem saraf pusat, dan saluran pernapasan
                          </p>
                        </div>
                        <div className="co-overlay-column color-bar-column" style={{ width: "33.33%", position: "relative", left: "50px" }}>
                          <div className="color-bar" style={{ width: "20px", height: "200px", borderRadius: "10px", background: "linear-gradient(to bottom, #00ff00 0%, #ffff00 20%, #ff7f00 40%, #ff0000 60%, #800080 80%, #000000 100%)" }}>
                            <div className="scale" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end", height: "100%" }}>
                              <div className="scale-item" data-value="0">
                                <span className="scale-value0 co-0-value" style={{ position: "relative", top: "-15px", left: "11px" }}>0</span>
                                <span className="scale-label co-0" style={{ position: "relative", top: "-15px", left: "25px" }}>Baik</span>
                              </div>
                              <div className="scale-item" data-value="4.5">
                                <span className="scale-value co-45-value" style={{ position: "relative", left: "8px", top: "5px" }}>4.5</span>
                                <span className="scale-label co-45" style={{ position: "relative", left: "40px", top: "5px" }}>Sedang</span>
                                <span className="horizontal-line"></span>
                              </div>
                              <div className="scale-item" data-value="9.5">
                                <span className="scale-value co-95-value" style={{ position: "relative", left: "61px", top: "25px" }}>9.5</span>
                                <span className="scale-label co-95-label">
                                  <span className="scale-label-line1 co-95-line1" style={{ position: "relative", top: "10px", left: "105px", display: "inline-block", width: "100px" }}>Tidak sehat</span>
                                  <span className="scale-label-line2 co-95-line2" style={{ position: "relative", top: "10px", left: "105px" }}> untuk grup sensitif</span>
                                </span>

                              </div>
                              <div className="scale-item" data-value="12.5">
                                <span className="scale-value co-125-value" style={{ position: "relative", left: "36px", top: "13px" }}>12.5</span>
                                <span className="scale-label co-125" style={{ position: "relative", top: "-2px", left: "85px", display: "inline-block", width: "80px" }}>Tidak Sehat</span>

                              </div>
                              <div className="scale-item" data-value="15.5">
                                <span className="scale-value co-155-value" style={{ position: "relative", left: "36px", top: "13px" }}>15.5</span>
                                <span className="scale-label co-155" style={{ position: "relative", top: "-2px", left: "85px", display: "inline-block", width: "80px" }}>Sangat Tidak Sehat</span>

                              </div>
                              <div className="scale-item" data-value="30.5">
                                <span className="scale-value-max co-305-value" style={{ position: "relative", left: "45px", top: "15px" }}>30.5</span>
                                <span className="scale-label co-305" style={{ position: "relative", left: "52px", top: "15px" }}>Berbahaya</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div style={{ fontStyle: 'italic', fontSize: "12px", position: "relative", top: "10px", right: "5px" }}>Last Update: {lastUpdate}</div>
          </div>
        </div>
        <div className="kolom-kanan col">
          {/*<div className="penjelasan-polutan card" style={{ backgroundColor: "rgb(236, 242, 255)" }}>
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
          </div>*/}
          <div className="rank-who row card-body" style={{ marginTop: "20px", marginLeft: "10px" }}>
            <div className="col-md">
              <div className="ranking-list card" style={{ minHeight: " 146px", width: "580px", backgroundColor: "rgb(236, 242, 255)", marginBottom: "20px" }}>
                <div className="card-body">
                  <h5>Kualitas Udara Kota Bandung setiap stasiun</h5>
                  <ol>
                    {rankingData.map((item, index) => (
                      <li key={index} className = "daftar-ranking">
                        {item.lokasi}
                        <span
                          id={`ranking-${index}`}
                          className="nilai-ranking float-right card-body"
                          style={{
                            backgroundColor: nilaiIspuElements[index]?.backgroundColor || "",
                            color: nilaiIspuElements[index]?.ispuTextColor || "",
                          }}
                        >
                          {item.rata_nilai_ispu}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
            <div className="anjuranWHO col" style={{ marginRight: "20px" }}>
              <div className="card" style={{ minHeight: "150px", backgroundColor: "rgb(236, 242, 255)" }}>
                <div className="card-body">
                  <h5>Anjuran WHO</h5>
                  <p id="tindakanWHO"></p>
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
