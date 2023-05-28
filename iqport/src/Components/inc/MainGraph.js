import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto'
import Home from '../Pages/Home.js';
import { useParams, } from 'react-router-dom';
import DateParam from './DateParam';
import './MainGraph.css';


function MainGraph() {
  //mengambil kecamatan dari searchbar
  const { kecamatan } = useParams();

  //untuk menentukan button yang mana sedang aktif pada
  const [activeParam, setActiveParam] = useState('ISPU');
  const [activeLabel, setActiveLabel] = useState('hourly');

  //Masuk ke pembuatan chart
  let apiUrl = "";
  let chart = null;
  let currentParam = "ISPU";
  let currentLabel = "hourly";

  function setLabels(label) {
    currentLabel = label;
    getData(currentParam, currentLabel);
  }

  function getData(param) {
    currentParam = param;
    let yLabel = "";
    let dataUrl = "";

    //mengambil jam dari servertime
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const date = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    //untuk hourly
    const dateStr = `${year}-${month}-${date}T${hours}:00:00`;
    const encodedDateStr = encodeURIComponent(dateStr);
    document.getElementById("clock").textContent = dateStr;

    //untuk daily dan this week
    const tanggalStr = `${year}-${month}-${date}`;
    const encodedTanggalStr = encodeURIComponent(tanggalStr);

    switch (param) {
      case "ISPU":
        yLabel = "ISPU";
        if (currentLabel === "hourly") {
          dataUrl = `https://aqport.my.id/main/1/ISPU/${encodedDateStr}/${kecamatan}`;
        }
        else if (currentLabel === "daily") {
          dataUrl = `https://aqport.my.id/main/1/ISPU/mingguan/${encodedTanggalStr}/${kecamatan}`;
        }
        else {
          dataUrl = `https://aqport.my.id/main/1/ISPU/harian/${encodedTanggalStr}/${kecamatan}`;
        }
        break;

      case "PM25":
        yLabel = "PM2.5 (µg/m3)";
        if (currentLabel === "hourly") {
          dataUrl = `https://aqport.my.id/main/3/PM25/${encodedDateStr}/${kecamatan}`;
        }
        else if (currentLabel == "daily") {
          dataUrl = `https://aqport.my.id/main/3/PM25/mingguan/${encodedTanggalStr}/${kecamatan}`;
        }
        else {
          dataUrl = `https://aqport.my.id/main/3/PM25/harian/${encodedTanggalStr}/${kecamatan}`;
        }
        break;

      case "PM10":
        yLabel = "PM10 (µg/m3)";
        if (currentLabel === "hourly") {
          dataUrl = `https://aqport.my.id/main/4/PM10/${encodedDateStr}/${kecamatan}`;;
        }
        else if (currentLabel === "daily") {
          dataUrl = `https://aqport.my.id/main/4/PM10/mingguan/${encodedTanggalStr}/${kecamatan}`;
        }
        else {
          dataUrl = `https://aqport.my.id/main/4/PM10/harian/${encodedTanggalStr}/${kecamatan}`;
        }
        break;

      case "CO":
        yLabel = "CO (ppm)";
        if (currentLabel === "hourly") {
          dataUrl = `https://aqport.my.id/main/4/CO/${encodedDateStr}/${kecamatan}`;;
        }
        else if (currentLabel === "daily") {
          dataUrl = `https://aqport.my.id/main/4/CO/mingguan/${encodedTanggalStr}/${kecamatan}`;
        }
        else {
          dataUrl = `https://aqport.my.id/main/4/CO/harian/${encodedTanggalStr}/${kecamatan}`;
        }
        break;

      case "temperatur":
        yLabel = "Temperature (°C)";
        if (currentLabel === "hourly") {
          dataUrl = `https://aqport.my.id/main/2/temperatur/${encodedDateStr}/${kecamatan}`;;
        }
        else if (currentLabel === "daily") {
          dataUrl = `https://aqport.my.id/main/2/temperatur/mingguan/${encodedTanggalStr}/${kecamatan}`;
        }
        else {
          dataUrl = `https://aqport.my.id/main/2/temperatur/harian/${encodedTanggalStr}/${kecamatan}`;
        }
        break;

      case "kelembapan":
        yLabel = "Humidity (%)";
        if (currentLabel === "hourly") {
          dataUrl = `https://aqport.my.id/main/3/kelembapan/${encodedDateStr}/${kecamatan}`;;
        }
        else if (currentLabel === "daily") {
          dataUrl = `https://aqport.my.id/main/3/kelembapan/mingguan/${encodedTanggalStr}/${kecamatan}`;
        }
        else {
          dataUrl = `https://aqport.my.id/main/3/kelembapan/harian/${encodedTanggalStr}/${kecamatan}`;
        }
        break;
    }

    const startTime = performance.now(); // Waktu awal

    fetch(dataUrl)
      .then(response => response.json())
      .then(data => {
        const labels = [];

        const endTime = performance.now(); // Waktu akhir
        const latency = endTime - startTime; // Perhitungan latency

        console.log(`Latency Main Graph: ${latency} milliseconds`);


        if (currentLabel === "hourly") {
          labels.push(...data.map(d => d.jam));
        }
        else if (currentLabel === "daily") {
          labels.push(...data.map(d => d.tanggal));
        }
        else {
          labels.push(...data.map(d => d.tanggal));
        }

        let yData = [];

        switch (param) {
          case "ISPU":
            if (currentLabel === "hourly") {
              yData = data.map(d => d.input_value);
            }
            else if (currentLabel === "daily") {
              yData = data.map(d => d.rata_nilai_ispu);
            }
            else {
              yData = data.map(d => d.rata_nilai_ispu);
            }
            break;

          case "PM25":
            if (currentLabel === "hourly") {
              yData = data.map(d => d.rata_konsentrasipm25);
            }
            else if (currentLabel === "daily") {
              yData = data.map(d => d.rata_pm25);
            }
            else {
              yData = data.map(d => d.rata_pm25);
            }
            break;

          case "PM10":
            if (currentLabel === "hourly") {
              yData = data.map(d => d.rata_konsentrasi_pm10);
            }
            else if (currentLabel === "daily") {
              yData = data.map(d => d.rata_pm10);
            }
            else {
              yData = data.map(d => d.rata_pm10);
            }
            break;

          case "CO":
            if (currentLabel === "hourly") {
              yData = data.map(d => d.rata_co);
            }
            else if (currentLabel === "daily") {
              yData = data.map(d => d.rata_nilai_co);
            }
            else {
              yData = data.map(d => d.rata_nilai_co);
            }
            break;

          case "temperatur":
            if (currentLabel === "hourly") {
              yData = data.map(d => d.rata_temperatur);
            }
            else if (currentLabel === "daily") {
              yData = data.map(d => d.rata_nilai_temperatur);
            }
            else {
              yData = data.map(d => d.rata_nilai_temperatur);
            }
            break;

          case "kelembapan":
            if (currentLabel === "hourly") {
              yData = data.map(d => d.rata_kelembapan);
            }
            else if (currentLabel === "daily") {
              yData = data.map(d => d.rata_nilai_kelembapan);
            }
            else {
              yData = data.map(d => d.rata_nilai_kelembapan);
            }
            break;
        }

        //untuk penentuan warna bar chart
        let colorData = data.map(d => {
          switch (d.color) {
            case "hijau":
              return "#B3FFAE";
            case "merah":
              return "#FF6464";
            case "kuning":
              return "#FFE9A0";
            case "hitam":
              return "#B0A4A4";
            case "biru":
              return "#C0DBEA";
            default:
              return "grey";
          }
        });

        const color = colorData;

        if (chart) {
          chart.destroy();
          chart = null;
        }

        chart = new Chart(document.getElementById("myChart"), {

          type: "bar",
          data: {
            labels: labels,
            datasets: [
              {
                label: currentParam,
                data: yData,
                backgroundColor: color,
                borderColor: "rgba(0, 0, 0, 1)",
                borderWidth: 1
              }
            ]
          },
          options: {
            scales: {
              yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: yLabel
                },
                ticks: {
                  beginAtZero: true,
                  stepSize: 5
                }
              }]
            },
          
          }
        });
      });
  }

  useEffect(() => {
    getData(currentParam);

  }, []);



  function handleParamClick(e) {
    e.preventDefault();
    let param;
    if (e.currentTarget.id === "pm25Button") {
      param = "PM25";
    } else if (e.currentTarget.id === "pm10Button") {
      param = "PM10";
    } else if (e.currentTarget.id === "coButton") {
      param = "CO";
    } else if (e.currentTarget.id === "ispuButton") {
      param = "ISPU";
    } else if (e.currentTarget.id === "temperaturButton") {
      param = "temperatur";
    } else if (e.currentTarget.id === "kelembapanButton") {
      param = "kelembapan";
    }
    getData(param);

  };

  function handleLabelClick(p, label) {
    p.preventDefault();
    setLabels(label);
    return false;
  }

  return (
    <div className="Main-Container" style={{ paddingTop: "20px" }}>
      <Home kecamatan={kecamatan} />
      <div className="graph-card card" style={{ margin: "60px auto", marginBottom: "0", height: "570px", backgroundColor: "rgb(236, 242, 255)  " }}>
        <h5 className = "title-card" style={{ margin: "0 auto", marginTop: "10px" }}> Historic Air Quality Graphic for {kecamatan} </h5>
        <div id="button-container" style={{ marginTop: "20px" }}  >
          <button className="button" id="ispuButton" onClick={handleParamClick}>ISPU</button>
          <button className="button" id="pm25Button" onClick={handleParamClick}>PM2.5</button>
          <button className="button" id="pm10Button" onClick={handleParamClick}>PM10</button>
          <button className="button" id="coButton" onClick={handleParamClick}>CO</button>
          <button className="button" id="temperaturButton" onClick={handleParamClick}>Temperature</button>
          <button className="button" id="kelembapanButton" onClick={handleParamClick}>Humidity</button>
        </div>
        <div className="graph-container">
          <div className="graph d-flex">
            <canvas id="myChart"></canvas>
          </div>
        </div>
        <div id="button-container" style={{ margin: "0 auto", marginBottom: "20px" }}>
          <button className="button" id="hourlyButton" onClick={(p) => { handleLabelClick(p, "hourly"); }}>Hourly</button>
          <button className="button" id="dailyButton" onClick={(p) => { handleLabelClick(p, "daily"); }}>Daily</button>
          <button className="button" id="weeklyButton" onClick={(p) => { handleLabelClick(p, "weekly"); }}>This Week</button>
        </div>
      </div>
      <div id="clock">
      </div>
      <DateParam kecamatan={kecamatan} />
    </div>
  );
}

export default MainGraph;
