import React, { useEffect, useRef, useState } from 'react';
import PropTypes from "prop-types";
import CustomGraph from './CustomGraph';
import './DateParam.css'

function DateParam(props) {
    const { kecamatan } = props;
    const [startDateString, setStartDateString] = useState("");
    const [endDateString, setEndDateString] = useState("");
    const [selectedParam, setSelectedParam] = useState("ISPU");

    const [date1, setDate1] = useState("");
    const [date2, setDate2] = useState("");
    const [currentParam, setCurrentParam] = useState("ISPU");

    const dateInput1Ref = useRef(null);
    const dateInput2Ref = useRef(null);

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
        // Mengambil nilai parameter terbaru dari state
        const selectedParam = currentParam;
        const today = new Date();
        const startDate = new Date(date1);
        const endDate = new Date(date2);

        if (startDate > today || endDate > today) {
            alert("Tanggal awal atau akhir tidak bisa lebih besar dari hari ini");
        } else {
            const diffTime = endDate - startDate;
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

                setStartDateString(startDateString);
                setEndDateString(endDateString);
                setSelectedParam(selectedParam);

                console.log("Parameter:", selectedParam);
                console.log("Start date:", startDateString);
                console.log("End date:", endDateString);
            }
        }
    };

    const handleChangeParam = (e) => {
        setCurrentParam(e.target.value);
    };

    return (
        <div className="customgraph card "
            style={{ margin: "0 auto", maxWidth: "1000px", backgroundColor: "rgb(236, 242, 255)" }}
        >
            <div className="title-card" style={{ margin: "0 auto", marginTop: "20px" }}>
                <h5 className="title-line1">Grafik Historis Custom untuk</h5>
                <h5 className="title-line2"> {kecamatan}</h5>
            </div>
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
                <select class="form-control" id="param" name="param" onChange={handleChangeParam}>
                    <option value="ISPU">ISPU</option>
                    <option value="PM25">PM2.5 </option>
                    <option value="PM10">PM10 </option>
                    <option value="CO">CO</option>
                    <option value="temperatur">Temperature</option>
                    <option value="kelembapan">Kelembaban</option>
                </select>
            </div>
            <button id="submitButton" onClick={handleSubmit} style={{ width: "100px", display: "flex", alignSelf: "center", marginTop: "0px" }}>Submit</button>
            <CustomGraph startDateString={startDateString} endDateString={endDateString} selectedParam={selectedParam} kecamatan={kecamatan} />
        </div>
    );
}

DateParam.propTypes = {
    startDateString: PropTypes.string.isRequired,
    endDateString: PropTypes.string.isRequired,
    selectedParam: PropTypes.string.isRequired,
};

export default DateParam;