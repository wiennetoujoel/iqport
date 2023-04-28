import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'

function MainGraph() {
  
  let apiUrl = "";
  let chart = null;
  let currentParam = "PM25";
  let currentLabel = "hourly";

  function setLabels(label) {
    currentLabel = label;
    getData(currentParam, currentLabel);
  }

  function getData(param) {
    currentParam = param;
    let yLabel = "";
    let dataUrl = "";

    switch (param) {
      case "PM25":
        yLabel = "PM2.5 (ppm)";
        if (currentLabel === "hourly") {
          dataUrl = "http://34.101.124.69:3300/main/3/PM25/2023-04-05/Andir";
        } else {
          dataUrl = "http://34.101.124.69:3300/main/3/PM25/harian/2023-04-05/Andir";
        }
        break;

      case "PM10":
        yLabel = "PM10 (ppm)";
        if (currentLabel === "hourly") {
          dataUrl = "http://34.101.124.69:3300/main/4/PM10/2023-04-05/Andir";
        } else {
          dataUrl = "http://34.101.124.69:3300/main/4/PM10/harian/2023-04-05/Andir";
        }
        break;

      case "temperatur":
        yLabel = "Temperatur (°C)";
        if (currentLabel === "hourly") {
          dataUrl = "http://34.101.124.69:3300/main/2/temperatur/2023-04-05/Andir";
        }
        else {
          dataUrl = "http://34.101.124.69:3300/main/2/temperatur/harian/2023-04-05/Andir";
        }
        break;

      case "kelembaban":
        yLabel = "Kelembaban (%)";
        if (currentLabel === "hourly") {
          dataUrl = "http://34.101.124.69:3300/main/3/kelembapan/2023-04-05/Andir";
        }
        else {
          dataUrl = "http://34.101.124.69:3300/main/3/kelembapan/harian/2023-04-05/Andir";
        }
        break;

      case "co":
        yLabel = "CO (ppm)";
        if (currentLabel === "hourly") {
          dataUrl = "http://34.101.124.69:3300/main/4/CO/2023-04-05/Andir";
        }
        else {
          dataUrl = "http://34.101.124.69:3300/main/4/CO/harian/2023-04-05/Andir";
        }
        break;
    }

    fetch(dataUrl)
      .then(response => response.json())
      .then(data => {
        const labels = [];

        if (currentLabel === "hourly") {
          labels.push(...data.map(d => d.jam));
        } else {
          labels.push(...data.map(d => d.tanggal));
        }

        let yData = [];

        switch (param) {
          case "PM25":
            if (currentLabel === "hourly") {
              yData = data.map(d => d.rata_konsentrasipm25);
            }
            else {
              yData = data.map(d => d.rata_pm25);
            }
            break;

          case "PM10":
            if (currentLabel === "hourly") {
              yData = data.map(d => d.rata_konsentrasi_pm10);
            }
            else {
              yData = data.map(d => d.rata_pm10);
            }
            break;

          case "temperatur":
            if (currentLabel === "hourly") {
              yData = data.map(d => d.rata_temperatur);
            }
            else {
              yData = data.map(d => d.rata_nilai_temperatur);
            }
            break;

          case "kelembaban":
            if (currentLabel === "hourly") {
              yData = data.map(d => d.rata_kelembapan);
            }
            else {
              yData = data.map(d => d.rata_nilai_kelembapan);
            }
            break;

          case "co":
            if (currentLabel === "hourly") {
              yData = data.map(d => d.rata_co);
            }
            else {
              yData = data.map(d => d.rata_nilai_co);
            }

        }

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
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
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

  getData(currentParam);

  return (
    <div>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <canvas id="myChart"></canvas>
      <div>
        <button onclick="getData('PM25')">PM2.5</button>
        <button onclick="getData('PM10')">PM10</button>
        <button onclick="getData('temperatur')">Temperatur</button>
        <button onclick="getData('kelembaban')">Kelembaban</button>
        <button onclick="getData('co')">CO</button>

        <button onclick="setLabels('hourly')">Hourly</button>
        <button onclick="setLabels('daily')">Daily</button>
      </div>
    </div>
  )
}

export default MainGraph;
