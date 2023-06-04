import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons';
import './LiveTable.css'

function LiveTable() {
    const [data, setData] = useState([]);

    //untuk menampilkan tabel dari lokasi yang aktif memberikan data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://aqport.my.id/main/status_alat');
                const jsonData = await response.json();
                setData(jsonData);
                console.log(jsonData);
            } catch (error) {
                console.error('terjadi kesalahan saat mengambil data', error);
            }
        };

        fetchData(); // Panggil fetchData secara langsung saat komponen dimuat

        const interval = setInterval(fetchData, 60000); // Pemanggilan setiap 1 menit (60000 milidetik)

        // Membersihkan interval saat komponen tidak lagi digunakan
        return () => clearInterval(interval);
    }, []);


    const provinces = Array.from(new Set(data.map((item) => item.provinsi))).sort((a, b) => a.localeCompare(b));

    return (
        <div className="admin-main-content" style={{ margin: "0 auto", display: "flex", justifyContent: "center" }}>
            <h4 style={{ position: "absolute", color: "white", fontWeight: "450" }}>Tabel Lokasi Alat Yang Aktif</h4>

            {provinces.map((province) => {
                const provinceData = data.filter((item) => item.provinsi === province);
                const cities = Array.from(new Set(provinceData.map((item) => item.kota))).sort();

                return (
                    <table className="live-table" key={province} style={{marginTop:"40px"}}>
                        <thead>
                            <tr>
                                <th colSpan={3} className="judul-provinsi">{province}</th>
                            </tr>
                            <tr className="keterangan">
                                <th>Kota</th>
                                <th>Kecamatan</th>
                                <th>ID Alat</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cities.map((city) => {
                                const cityData = provinceData.filter((item) => item.kota === city);

                                return cityData.map((item, index) => {
                                    const { lattitude, longitude, id_alat, kecamatan } = item;


                                    return (
                                        <tr key={index} >
                                            {index === 0 && (
                                                <td rowSpan={cityData.length}>{city}</td>
                                            )}
                                            <td>{kecamatan}</td>
                                            <td>{id_alat}</td>
                                        </tr>
                                    );
                                });
                            })}
                        </tbody>
                    </table>
                );
            })}
            <br></br>
            {data.length === 0 &&
                <div className="data-empty">
                    <div className="card">
                        <div className="card-body">
                            Tidak ada data yang tersedia
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default LiveTable;
