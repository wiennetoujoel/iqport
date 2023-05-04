import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto'

function CustomGraph() {
    //penentuan tanggal awal dan akhir
    const [date1, setDate1] = useState("");
    const [date2, setDate2] = useState("");
    const [dateRange, setDateRange] = useState({
        startDateString: '',
        endDateString: ''
    });

    const dateInput1Ref = useRef(null);
    const dateInput2Ref = useRef(null);

    const [currentParam, setCurrentParam] = useState("ISPU");
    const chart = useRef(null);

    useEffect(() => {
        getData(currentParam, dateRange.startDateString, dateRange.endDateString);
      }, [currentParam, dateRange]);

    const handleChange1 = (e) => {
        setDate1(e.target.value);
        handleLabel(dateInput1Ref, setDate1);
    };

    const handleChange2 = (e) => {
        setDate2(e.target.value);
        handleLabel(dateInput2Ref, setDate2);
    };

    // Fungsi untuk menampilkan label di atas input date setelah user memilih tanggal
    const handleLabel = (dateInputRef, setDate) => {
        const label = dateInputRef.current.parentNode.querySelector(".label");
        if (dateInputRef.current.value) {
            label.classList.add("active");
            setDate(dateInputRef.current.value);
        } else {
            label.classList.remove("active");
            setDate("");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const today = new Date();
        const startDate = new Date(date1);
        const endDate = new Date(date2);

        if (startDate > today || endDate > today) {
            alert("Tanggal awal atau akhir tidak bisa lebih besar dari hari ini");
        } else {
            const diffTime = Math.abs(endDate - startDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 30) {
                alert("Tanggal awal dan akhir terpaut lebih dari 30 hari");
            }
            else if (diffDays < 1) {
                alert("Tanggal akhir tidak bisa sama atau mendahului tanggal awal");
            }
            else {
                const startDateString = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`;
                const endDateString = `${endDate.getFullYear()}-${(endDate.getMonth() + 1).toString().padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}`;

                setDateRange({ startDateString, endDateString });
                setCurrentParam("ISPU"); 
            }
        }
    };

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
        }
    }

    const handleChangeParam = (e) => {
        setCurrentParam(e.target.value);
    };


    return (
        <div className="customgraph card "
            style={{ margin: "20px", marginLeft: "100px", marginRight: "100px" }}
        > Custom Graph
            <div className="row">
                <div className="col">
                    <div
                        className="card-body" style={{ padding: "0px" }}>
                        <div className="tanggalAwal form-group" style={{ width: "300px", padding: "20px" }}>
                            <label className="label ml-2">Tanggal Awal</label>
                            <input type="date" onChange={() => handleLabel(dateInput1Ref, setDate1)} ref={dateInput1Ref} />
                        </div>
                        <div className="tanggalAkhir form-group" style={{ width: "300px", padding: "20px" }}>
                            <label className="label ml-2">Tanggal Akhir</label>
                            <input type="date" onChange={() => handleLabel(dateInput2Ref, setDate2)} ref={dateInput2Ref} />
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-group" style={{ width: "300px", padding: "20px", margin: "0 auto", marginTop: "-50px" }}>
                <label for="param">Parameter</label>
                <select class="form-control" id="param" name="param">
                    <option value="PM25">PM2.5 </option>
                    <option value="PM10">PM10 </option>
                    <option value="ISPU">ISPU</option>
                </select>
            </div>
            <button id="submitButton" onClick={handleSubmit} style={{ width: "100px", display: "flex", alignSelf: "center", marginTop: "0px" }}>Submit</button>
            <div className="chart-container">
                <canvas id="custom"></canvas>
            </div>
        </div>
    );
}

export default CustomGraph;
