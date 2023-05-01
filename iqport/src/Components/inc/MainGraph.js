import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'
import Home from '../Pages/Home.js';

function MainGraph() {
  //pembangunan server time
  function updateTime() {
    const now = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const day = days[now.getDay()];
    const date = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const timeString = `${day}, ${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
    document.getElementById('clock').textContent = timeString;
  }

  setInterval(updateTime, 1000);

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
    let colorUrl = "";

    //mengambil jam dari servertime
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const date = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    //untuk hourly
    const dateStr = `${year}-${month}-${date}T${hours}:00:00`;
    const encodedDateStr = encodeURIComponent(dateStr);
    document.getElementById('time').textContent = dateStr;

    //untuk daily dan this week
    const tanggalStr = `${year}-${month}-${date}`;
    const encodedTanggalStr = encodeURIComponent(tanggalStr);

    switch (param) {
      case "ISPU":
        yLabel = "ISPU";
        if (currentLabel === "hourly") {
          dataUrl = `http://34.101.124.69:3300/main/1/ISPU/${encodedDateStr}/Coblong1`;;
        }
        else if (currentLabel === "daily") {
          dataUrl = `http://34.101.124.69:3300/main/1/ISPU/mingguan/${encodedTanggalStr}/Coblong1`;
        }
        else {
          dataUrl = `http://34.101.124.69:3300/main/1/ISPU/harian/${encodedTanggalStr}/Coblong1`;
        }
        break;

      case "PM25":
        yLabel = "PM2.5 (ppm)";
        if (currentLabel === "hourly") {
          dataUrl = `http://34.101.124.69:3300/main/3/PM25/${encodedDateStr}/Coblong1`;
        }
        else if (currentLabel == "daily") {
          dataUrl = `http://34.101.124.69:3300/main/3/PM25/mingguan/${encodedTanggalStr}/Coblong1`;
        }
        else {
          dataUrl = `http://34.101.124.69:3300/main/3/PM25/harian/${encodedTanggalStr}/Coblong1`;
        }
        break;

      case "PM10":
        yLabel = "PM10 (ppm)";
        if (currentLabel === "hourly") {
          dataUrl = `http://34.101.124.69:3300/main/4/PM10/${encodedDateStr}/Coblong1`;;
        }
        else if (currentLabel === "daily") {
          dataUrl = `http://34.101.124.69:3300/main/4/PM10/mingguan/${encodedTanggalStr}/Coblong1`;
        }
        else {
          dataUrl = `http://34.101.124.69:3300/main/4/PM10/harian/${encodedTanggalStr}/Coblong1`;
        }
        break;
    }

    fetch(dataUrl)
      .then(response => response.json())
      .then(data => {
        const labels = [];


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
              return "white";
          }
        });

        const color = colorData;



        if (chart) {
          chart.destroy();
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
            }
          }
        });
      });
  }

  useEffect(() => {
    getData(currentParam);

    //penentuan warna bar dalam bar chart


  }, []);



  function handleParamClick(e) {
    e.preventDefault();
    let param;
    if (e.currentTarget.id === "pm25Button") {
      param = "PM25";
    } else if (e.currentTarget.id === "pm10Button") {
      param = "PM10";
    } else if (e.currentTarget.id === "ispuButton") {
      param = "ISPU";
    }
    getData(param);

  };

  function handleLabelClick(e, label) {
    e.preventDefault();
    setLabels(label);
    return false;
  }

  return (
    <div>
      <Home />
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <div id="button-container" style={{ marginLeft: "100px" }}>
        <button id="ispuButton" onClick={handleParamClick}>ISPU</button>
        <button id="pm25Button" onClick={handleParamClick}>PM2.5</button>
        <button id="pm10Button" onClick={handleParamClick}>PM10</button>
      </div>
      <div className="graph-container">
        <div className="graph">
          <canvas id="myChart"></canvas>
        </div>
      </div>
      <div id="button-container" style={{ marginLeft: "100px" }}>
        <button id="hourlyButton" onClick={(e) => { handleLabelClick(e, "hourly"); }}>Hourly</button>
        <button id="dailyButton" onClick={(e) => { handleLabelClick(e, "daily"); }}>Daily</button>
        <button id="weeklyButton" onClick={(e) => { handleLabelClick(e, "weekly"); }}>This Week</button>
      </div>
      <div id="time">

      </div>
    </div>
  );
}

export default MainGraph;
