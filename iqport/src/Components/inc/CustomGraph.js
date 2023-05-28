import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto'
import './CustomGraph.css'
import PropTypes from "prop-types";


function CustomGraph({ startDateString, endDateString, selectedParam, kecamatan = "" }) {
    let dataUrl = "";


    const [startDate, setStartDate] = useState(new Date(startDateString));
    const [endDate, setEndDate] = useState(new Date(endDateString));
    const [param, setParam] = useState(selectedParam);
    const chart = useRef(null);

    useEffect(() => {
        getData(selectedParam, startDateString, endDateString);
    }, [selectedParam, startDateString, endDateString]);

    async function getData(param, startDateString, endDateString) {
        const tanggalawal = encodeURIComponent(startDateString);
        const tanggalakhir = encodeURIComponent(endDateString);

        let yLabel = "";


        switch (param) {
            case "ISPU":
                yLabel = "ISPU";
                dataUrl = `https://aqport.my.id/main/1/ISPU/custom/${tanggalawal}/${tanggalakhir}/${kecamatan}`;
                break;

            case "PM25":
                yLabel = "PM2.5 (ppm)";
                dataUrl = `https://aqport.my.id/main/3/PM25/custom/${tanggalawal}/${tanggalakhir}/${kecamatan}`;
                break;

            case "PM10":
                yLabel = "PM10 (ppm)";
                dataUrl = `https://aqport.my.id/main/4/PM10/custom/${tanggalawal}/${tanggalakhir}/${kecamatan}`;
                break;

            case "CO":
                yLabel = "CO (ppm)";
                dataUrl = `https://aqport.my.id/main/4/CO/custom/${tanggalawal}/${tanggalakhir}/${kecamatan}`;
                break;

            case "temperatur":
                yLabel = "Temperature (°C)";
                dataUrl = `https://aqport.my.id/main/2/temperatur/custom/${tanggalawal}/${tanggalakhir}/${kecamatan}`;
                break;

            case "kelembapan":
                yLabel = "Humidity (%)";
                dataUrl = `https://aqport.my.id/main/3/kelembapan/custom/${tanggalawal}/${tanggalakhir}/${kecamatan}`;
                break;

            default:
                break;
        }
        const startTime = performance.now(); // Waktu awal

        try {
            const response = await fetch(dataUrl);
            const data = await response.json();

            const endTime = performance.now(); // Waktu akhir
            const latency = endTime - startTime; // Perhitungan latency
    
            console.log(`Latency Custom Graph: ${latency} milliseconds`);

            const labels = data.map((d) => d.tanggal);
            let yData = [];

            switch (param) {
                case "ISPU":
                    yData = data.map((d) => d.nilai_ispu);
                    break;

                case "PM25":
                    yData = data.map((d) => d.rata_pm25);
                    break;

                case "PM10":
                    yData = data.map((d) => d.rata_pm10);
                    break;

                case "CO":
                    yData = data.map((d) => d.rata_nilai_co);
                    break;

                case "temperatur":
                    yData = data.map((d) => d.rata_nilai_temperatur);
                    break;

                case "kelembapan":
                    yData = data.map((d) => d.rata_nilai_kelembapan);
                    break;

                default:
                    break;
            }
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

            if (chart.current) {
                chart.current.destroy();
            }
            chart.current = new Chart(document.getElementById("custom"), {
                type: "bar",
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: yLabel,
                            data: yData,
                            backgroundColor: color,
                            borderColor: "rgba(0, 0, 0, 1)",
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    scales: {
                        yAxes: [
                            {
                                scaleLabel: {
                                    display: true,
                                    labelString: yLabel,
                                },
                                ticks: {
                                    beginAtZero: true,
                                    stepSize: 5,
                                },
                            },
                        ],
                    },
                },
            });
        } catch (error) {
            console.error(error);
            console.log(param);
            console.log(startDateString);
            console.log(endDateString);
        }
    }

    return (
        <div>
            <div className="chart-container">
                <canvas id="custom"></canvas>
            </div>
        </div>
    );
}

CustomGraph.propTypes = {
    selectedParam: PropTypes.string.isRequired,
    startDateString: PropTypes.string.isRequired,
    endDateString: PropTypes.string.isRequired,
};

export default CustomGraph;
