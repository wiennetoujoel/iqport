import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto'
import DateParam from './DateParam'


function CustomGraph(props) {
    const { startDateString, endDateString, selectedParam } = props;
  
 
    const chart = useRef(null);

    useEffect(() => {
        getData(selectedParam, startDateString, endDateString);
      }, [selectedParam, startDateString, endDateString]);

    async function getData(param, startDateString, endDateString) {

        const tanggalawal = encodeURIComponent(startDateString);
        const tanggalakhir = encodeURIComponent(endDateString);

        let yLabel = "";
        let dataUrl = "";

        switch (param) {
            case "ISPU":
                yLabel = "ISPU";
                dataUrl = `http://34.101.124.69:3300/main/1/ISPU/custom/${tanggalawal}/${tanggalakhir}/Andir`;
                break;

            case "PM25":
                yLabel = "PM2.5 (ppm)";
                dataUrl = `http://34.101.124.69:3300/main/3/PM25/custom/${tanggalawal}/${tanggalakhir}/Andir`;
                break;

            case "PM10":
                yLabel = "PM10 (ppm)";
                dataUrl = `http://34.101.124.69:3300/main/4/PM10/custom/${tanggalawal}/${tanggalakhir}/Coblong1`;
                break;

            default:
                break;
        }

        try {
            const response = await fetch(dataUrl);
            const data = await response.json();

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

                default:
                    break;
            }


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
                            backgroundColor: "blue",
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
        }
    }


    return (
        <div> 
            <DateParam/>
            <div className="chart-container">
                <canvas id="custom"></canvas>
            </div>
        </div>
    );
}

export default CustomGraph;
