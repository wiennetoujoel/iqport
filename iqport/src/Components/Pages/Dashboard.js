import React, { useEffect, useState, useRef } from 'react';
import './Dashboard.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const AdminDashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://34.101.124.69:3300/main/5/tampil_lokasi');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Terjadi kesalahan saat mengambil data:', error);
      }
    };

    fetchData();
  }, []);

  const provinces = Array.from(new Set(data.map((item) => item.provinsi))).sort();
  const csvData = [];

  const generateCSV = (kecamatan) => {
    window.open(`http://34.101.124.69:3300/main/download-csv/${kecamatan}`);
  };

  //Dropdown untuk Tambah Lokasi
  const Dropdown = ({ title, inputs }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
      id_alat: '',
      kecamatan: '',
      kota: '',
      provinsi: '',
      lattitude: '',
      longitude: ''
    });
    const dropdownRef = useRef(null);

    useEffect(() => {
      const handleOutsideClick = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleOutsideClick);
      return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
      };
    }, []);

    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    };

    useEffect(() => {
      console.log(formData);
    }, [formData]);

    const handleSubmit = (e) => {
      e.preventDefault();

      // Kirim permintaan GET ke backend untuk memeriksa keberadaan id_alat
      axios
        .get('http://34.101.124.69:3300/main/5/tampil_lokasi')
        .then((response) => {
          // Dapatkan daftar id_alat dari respons backend
          const existingIdAlat = response.data.map((lokasi) => lokasi.id_alat);

          // Periksa apakah id_alat sudah digunakan
          if (existingIdAlat.includes(formData.id_alat)) {
            // Jika sudah digunakan, tampilkan pesan peringatan
            alert('ID Alat sudah digunakan!');
          } else {
            // Jika belum digunakan, kirim permintaan POST ke backend menggunakan Axios
            axios
              .post('http://34.101.124.69:3300/main/5/tambah_lokasi', formData)
              .then((response) => {
                // Tangani respon dari backend jika berhasil
                console.log(response.status);
                console.log(response.data);
                setIsOpen(!isOpen);
              })
              .catch((error) => {
                // Tangani kesalahan jika terjadi
                console.error(error);
              });
          }
        })
        .catch((error) => {
          // Tangani kesalahan jika terjadi saat mengambil data dari backend
          console.error(error);
        });
    };

    return (
      <div className="dropdown-container">
        <button className="dropdown-button" onClick={toggleDropdown}>
          {title} <span className="fas fa-angle-down"></span>
        </button>
        {isOpen && (
          <div className="dropdown-content" ref={dropdownRef}>
            <form onSubmit={handleSubmit} className="col">
              {inputs.map((input, index) => {
                return (
                  <input
                    type="text"
                    placeholder={input.split("_").join(" ")}
                    name={input.toLowerCase()}
                    value={formData[input.toLowerCase()]}
                    key={index}
                    onChange={handleInputChange}
                    style={{ width: "180px" }}
                  />
                );
              })}
              <button type="submit">Submit</button>
            </form>
          </div>
        )}
      </div>
    );
  };


  //Dropddown untuk hapus lokasi 
  const [showDropdown, setShowDropdown] = useState(false);

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const DeleteLocationDropdown = () => {
    const [idAlat, setIdAlat] = useState("");
    const [locationData, setLocationData] = useState(null);

    const handleIdAlatChange = (e) => {
      setIdAlat(e.target.value);
    };

    const handleCheckLocation = () => {
      if (idAlat) {
        axios
          .get(`http://34.101.124.69:3300/main/5/tampil_lokasi`)
          .then((response) => {
            const filteredData = response.data.find(
              (location) => location.id_alat.toString() === idAlat
            );
            if (filteredData) {
              console.log("Data lokasi:", filteredData);
              setLocationData(filteredData);
            } else {
              console.log("Data lokasi tidak ditemukan");
              setLocationData(null);
            }
          })
          .catch((error) => {
            console.error("Terjadi kesalahan:", error);
            setLocationData(null);
          });
      }
    };

    const handleDeleteLocation = () => {
      if (idAlat) {
        axios
          .delete(`http://34.101.124.69:3300/main/5/hapus_lokasi/${idAlat}`)
          .then((response) => {
            console.log("Lokasi berhasil dihapus:", response.data);
            // Lakukan tindakan tambahan setelah lokasi dihapus jika diperlukan
          })
          .catch((error) => {
            console.error("Terjadi kesalahan:", error);
          });
        setShowDropdown(!showDropdown);
      }
    };

    return (
      <div className="delete-dropdown-content">
        <div className="input-group">
          <label>ID Alat:</label>
          <input type="text" value={idAlat} onChange={handleIdAlatChange} />
          <button onClick={handleCheckLocation}>Check</button>
        </div>
        {locationData && (
          <div className="location-data">
            <p>ID Alat: {locationData.id_alat}</p>
            <p>Kecamatan: {locationData.kecamatan}</p>
            <p>Kota: {locationData.kota}</p>
            <p>Provinsi: {locationData.provinsi}</p>
            <p>Latitude: {locationData.lattitude}</p>
            <p>Longitude: {locationData.longitude}</p>
          </div>
        )}
        {locationData && (
          <div className="button-group" style={{ margin: "0 auto", paddingBottom: "10px" }}>
            <button onClick={handleDeleteLocation}>Delete</button>
          </div>
        )}
      </div>
    );
  };

  //Dropdown untuk edit lokasi
  const [showEditDropdown, setShowEditDropdown] = useState(false);

  const handleToggleEditDropdown = () => {
    setShowEditDropdown(!showEditDropdown);
  };

  const EditLocationDropdown = () => {
    const [idAlat, setIdAlat] = useState("");
    const [locationData, setLocationData] = useState(null);

    const [editIdAlat, setEditIdAlat] = useState("");
    const [editKecamatan, setEditKecamatan] = useState("");
    const [editKota, setEditKota] = useState("");
    const [editProvinsi, setEditProvinsi] = useState("");
    const [editLatitude, setEditLatitude] = useState("");
    const [editLongitude, setEditLongitude] = useState("");
    const [editLocationData, setEditLocationData] = useState(null);

    const handleEditIdAlatChange = (e) => {
      setIdAlat(e.target.value);
    };

    const handleCheckLocation = () => {
      if (idAlat) {
        axios
          .get(`http://34.101.124.69:3300/main/5/tampil_lokasi`)
          .then((response) => {
            const filteredData = response.data.find(
              (location) => location.id_alat.toString() === idAlat
            );
            if (filteredData) {
              console.log("Data lokasi:", filteredData);
              setEditLocationData(filteredData);
            } else {
              console.log("Data lokasi tidak ditemukan");
              setEditLocationData(null);
            }
          })
          .catch((error) => {
            console.error("Terjadi kesalahan:", error);
            setLocationData(null);
          });
      }
    };

    const handleEditLocation = () => {
      if (idAlat) {
        const updatedLocationData = {
          id_revisi: editIdAlat, // Menggunakan id_revisi untuk menyimpan nilai yang sudah diedit
          kecamatan: editKecamatan,
          kota: editKota,
          provinsi: editProvinsi,
          lattitude: editLatitude,
          longitude: editLongitude,
        };

        axios
          .put(`http://34.101.124.69:3300/main/5/edit_lokasi/${idAlat}`, updatedLocationData)
          .then((response) => {
            console.log("Lokasi berhasil diedit:", response.data);
            // nutup dropdown 
            setShowEditDropdown(!showEditDropdown);
          })
          
          .catch((error) => {
            console.error("Terjadi kesalahan:", error);
          });
      }
    };

    return (
      <div className="edit-dropdown-content">
        <div className="input-group">
          <label>ID Alat:</label>
          <input type="text" value={idAlat} onChange={handleEditIdAlatChange} />
          <button onClick={handleCheckLocation}>Check</button>
        </div>
        {editLocationData && (
          <div className="location-data">
            <p>ID Alat: {editLocationData.id_alat}</p>
            <p>Kecamatan: {editLocationData.kecamatan}</p>
            <p>Kota: {editLocationData.kota}</p>
            <p>Provinsi: {editLocationData.provinsi}</p>
            <p>Latitude: {editLocationData.lattitude}</p>
            <p>Longitude: {editLocationData.longitude}</p>
          </div>
        )}
        {editLocationData && (
          <div className="edit-form">
            <div className="input-group">
              <label>Edit ID Alat:</label>
              <input type="text" value={editIdAlat} onChange={(e) => setEditIdAlat(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Edit Kecamatan:</label>
              <input type="text" value={editKecamatan} onChange={(e) => setEditKecamatan(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Edit Kota:</label>
              <input type="text" value={editKota} onChange={(e) => setEditKota(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Edit Provinsi:</label>
              <input type="text" value={editProvinsi} onChange={(e) => setEditProvinsi(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Edit Latitude:</label>
              <input type="text" value={editLatitude} onChange={(e) => setEditLatitude(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Edit Longitude:</label>
              <input type="text" value={editLongitude} onChange={(e) => setEditLongitude(e.target.value)} />
            </div>
            <div className="button-group" style={{ margin: "0 auto", paddingBottom: "10px" }}>
              <button onClick={handleEditLocation}>Edit</button>
            </div>
          </div>
        )}
      </div>
    );




  }

  //return hasil keseluruhan
  return (
    <div className="admin-dashboard col">
      <header>
        <h1 style={{ paddingTop: "50px", color: "white", marginLeft: "20px" }}>Welcome, Admin!</h1>
      </header>
      <div className="admin-dashboard-content">
        <div className="admin-actions">
          <Dropdown
            title="Tambah Lokasi"
            inputs={[
              "ID_Alat",
              "Kecamatan",
              "Kota",
              "Provinsi",
              "Lattitude",
              "Longitude",
            ]}
          />
          <button className="admin-action hapus-lokasi text-left" onClick={handleToggleDropdown}>
            Hapus Lokasi <i className="fas fa-angle-down" style={{ float: "right", marginTop: "4px" }}></i>
          </button>
          {showDropdown && <DeleteLocationDropdown />}
          <button className="admin-action edit-lokasi text-left" onClick={handleToggleEditDropdown}>
            Edit Lokasi <i className="fas fa-angle-down" style={{ float: "right", marginTop: "4px" }}></i>
          </button>
          {showEditDropdown && <EditLocationDropdown />}
        </div>
        <div className="admin-main-content">
          <h4 style={{ marginLeft: "20px", color: "white" }}>Tabel Data</h4>
          {provinces.map((province) => {
            const provinceData = data.filter((item) => item.provinsi === province);
            const cities = Array.from(new Set(provinceData.map((item) => item.kota))).sort();

            return (
              <table className="data-table" key={province}>
                <thead>
                  <tr>
                    <th colSpan={7}>{province}</th>
                  </tr>
                  <tr>
                    <th>Kota</th>
                    <th>Kecamatan</th>
                    <th>ID Lokasi</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>CSV</th>
                  </tr>
                </thead>
                <tbody>
                  {cities.map((city) => {
                    const cityData = provinceData.filter((item) => item.kota === city);

                    return cityData.map((item, index) => {
                      const { lattitude, longitude, id_alat, kecamatan } = item;


                      // Tambahkan data ke dalam array CSV
                      csvData.push({
                        Provinsi: province,
                        Kota: city,
                        Kecamatan: kecamatan,
                        "ID Lokasi": id_alat,
                        Latitude: lattitude,
                        Longitude: longitude,
                      });

                      return (
                        <tr key={index}>
                          {index === 0 && (
                            <td rowSpan={cityData.length}>{city}</td>
                          )}
                          <td>{kecamatan}</td>
                          <td>{id_alat}</td>
                          <td>{lattitude}</td>
                          <td>{longitude}</td>
                          <td>
                            <button
                              className="csv-button"
                              onClick={() => generateCSV(kecamatan)}
                            >
                              CSV
                            </button>
                          </td>

                        </tr>
                      );
                    });
                  })}
                </tbody>
              </table>
            );
          })}
          {data.length === 0 && <p>Tidak ada data yang tersedia.</p>}

        </div>
      </div>

      <footer>
        {/* Tambahkan footer jika diperlukan */}
      </footer>
    </div>
  );
};

export default AdminDashboard;
