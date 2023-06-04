import React, { useEffect, useState, useRef } from 'react';
import './Dashboard.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons';
import LiveTable from './LiveTable';
import SigninForm from '../Pages/SigninForm';

const AdminDashboard = () => {
  const [data, setData] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedIn");
    if (isLoggedIn) {
      const { username, email } = JSON.parse(isLoggedIn);
      setLoggedIn({
        loggedIn: true,
        email,
        username,
      });
      setUsername(username);
    }
  }, []);



  //untuk menampilkan tabel seluruh lokasi yang terdaftar di database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://aqport.my.id/main/5/tampil_lokasi');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Terjadi kesalahan saat mengambil data:', error);
      }
    };

    fetchData();
  }, []);

  const provinces = Array.from(new Set(data.map((item) => item.provinsi))).sort((a, b) => a.localeCompare(b));
  const csvData = [];

  const generateCSV = (kecamatan) => {
    window.open(`https://aqport.my.id/main/download-csv/${kecamatan}`);
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
        .get('https://aqport.my.id/main/5/tampil_lokasi')
        .then((response) => {
          // Dapatkan daftar id_alat dari respons backend
          const existingIdAlat = response.data.map((lokasi) => lokasi.id_alat);

          // Periksa apakah id_alat sudah digunakan
          if (existingIdAlat.includes(formData.id_alat)) {
            // Jika sudah digunakan, tampilkan pesan peringatan
            alert('ID Alat sudah digunakan!');
            console.log(response.data)
          } else {
            // Jika belum digunakan, kirim permintaan POST ke backend menggunakan Axios
            axios
              .post('https://aqport.my.id/main/5/tambah_lokasi', formData)
              .then((response) => {
                // Tangani respon dari backend jika berhasil
                console.log(response.status);
                console.log(response.data);
                setIsOpen(!isOpen);
              })
              .catch((error) => {
                // Tangani kesalahan jika terjadi
                console.error(error);
                if (error.response && error.response.status === 409) {
                  // Jika respons status adalah 409 (Conflict), tampilkan pesan peringatan
                  alert('Konflik data: ID Alat sudah digunakan!');
                } else {
                  // Jika kesalahan bukan karena konflik data, tangani secara umum
                  console.error(error);
                }
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
                  <div key={index} style={{ display: "flex", flexDirection: "column" }}>
                    <input
                      type="text"
                      placeholder={input.split("_").join(" ")}
                      name={input.toLowerCase()}
                      value={formData[input.toLowerCase()]}
                      onChange={handleInputChange}
                      style={{ width: "165px", marginRight: "10px" }}
                    />
                  </div>
                );
              })}
              <br />
              <button type="submit" className='submit-button'>Submit</button>
            </form>
          </div>
        )}
      </div>
    );
  };


  //Dropddown untuk hapus lokasi 
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Fungsi untuk menutup dropdown jika pengguna mengklik di luar dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    // Tambahkan event listener ketika komponen dimount
    document.addEventListener('mousedown', handleClickOutside);

    // Hapus event listener ketika komponen akan unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const DeleteLocationDropdown = () => {
    const [idAlat, setIdAlat] = useState("");
    const [locationData, setLocationData] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleIdAlatChange = (e) => {
      setIdAlat(e.target.value);
    };

    const handleCheckLocation = () => {
      if (idAlat) {
        axios
          .get(`https://aqport.my.id/main/5/tampil_lokasi`)
          .then((response) => {
            const filteredData = response.data.find(
              (location) => location.id_alat.toString() === idAlat
            );
            if (filteredData) {
              console.log("Data lokasi:", filteredData);
              setLocationData(filteredData);
            } else {
              alert('ID Alat tidak ditemukan');
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
          .delete(`https://aqport.my.id/main/5/hapus_lokasi/${idAlat}`)
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

    const handleConfirmDelete = () => {
      setShowConfirmation(true);
    };

    const handleCancelDelete = () => {
      setShowConfirmation(false);
    };

    return (
      <div className="delete-dropdown-content">
        <div className="input-group">
          <label>ID Alat:</label>
          <input type="text" value={idAlat} onChange={handleIdAlatChange} style={{ marginLeft: "10px", borderRadius: "5px" }} />
          <button onClick={handleCheckLocation} style={{ marginLeft: "10px", borderRadius: "5px" }}>Check</button>
        </div>
        {locationData && (
          <div className="location-data">
            <div className="data-row">
              <p className="data-label">ID Alat:</p>
              <p>{locationData.id_alat}</p>
            </div>
            <div className="data-row">
              <p className="data-label">Kecamatan:</p>
              <p>{locationData.kecamatan}</p>
            </div>
            <div className="data-row">
              <p className="data-label">Kota:</p>
              <p>{locationData.kota}</p>
            </div>
            <div className="data-row">
              <p className="data-label">Provinsi:</p>
              <p>{locationData.provinsi}</p>
            </div>
            <div className="data-row">
              <p className="data-label">Latitude:</p>
              <p>{locationData.lattitude}</p>
            </div>
            <div className="data-row">
              <p className="data-label">Longitude:</p>
              <p>{locationData.longitude}</p>
            </div>
            <div className="button-group button-delete">
              <button
                className="delete-button"
                onClick={handleConfirmDelete}
                style={{ position: "relative", borderRadius: "5px", textAlign: "center" }}
              >
                Delete
              </button>
            </div>
          </div>
        )}
        {locationData && showConfirmation && (
          <div className="overlay-container">
            <div className="delete-confirmation-overlay">
              <p>Apakah anda yakin untuk menghapus lokasi ID alat ini?</p>
              <div className="button-group" style={{ justifyContent: "center", display: "flex", position: "relative", width: "100%", margin: "auto", display: "flex", marginLeft: "-10px" }}>
                <button className="cancel-button" onClick={handleCancelDelete}>
                  Cancel
                </button>
                <button className="delete-button" onClick={handleDeleteLocation}>
                  Delete
                </button>
              </div>
            </div>
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

    const [editLocationData, setEditLocationData] = useState(null);

    const handleEditIdAlatChange = (e) => {
      setIdAlat(e.target.value);
    };

    const handleCheckLocation = () => {
      if (idAlat) {
        axios
          .get(`https://aqport.my.id/main/5/tampil_lokasi`)
          .then((response) => {
            const filteredData = response.data.find(
              (location) => location.id_alat.toString() === idAlat
            );
            if (filteredData) {
              console.log("Data lokasi:", filteredData);
              setEditLocationData(filteredData);
            } else {
              alert('ID Alat tidak ditemukan');
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
      if (idAlat && editLocationData) {
        const updatedLocationData = {
          id_revisi: editLocationData.id_alat,
          kecamatan: editLocationData.kecamatan,
          kota: editLocationData.kota,
          provinsi: editLocationData.provinsi,
          lattitude: editLocationData.lattitude,
          longitude: editLocationData.longitude,
        };

        axios
          .put(`https://aqport.my.id/main/5/edit_lokasi/${idAlat}`, updatedLocationData)
          .then((response) => {
            console.log("Lokasi berhasil diedit:", response.data);
            setShowEditDropdown(!showEditDropdown);
          })
          .catch((error) => {
            console.error("Terjadi kesalahan:", error);
          });
      }
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEditLocationData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };

    return (
      <div className="edit-dropdown-content">
        <div className="input-group">
          <label >ID Alat:</label>
          <input
            type="text"
            value={idAlat}
            onChange={handleEditIdAlatChange}
            style={{ marginLeft: "10px", borderRadius: "5px" }}
          />
          <button
            onClick={handleCheckLocation}
            style={{ marginLeft: "10px", borderRadius: "5px" }}
          >
            Check
          </button>
        </div>
        {editLocationData && (
          <div className="edit-form">
            <div className="input-group">
              <label style={{ fontWeight: "600" }}>Edit ID Alat:</label>
              <input
                className="data-input"
                type="text"
                name="id_alat"
                value={editLocationData.id_alat}
                onChange={handleInputChange}
                style={{ marginLeft: "18px" }}
              />
            </div>
            <div className="input-group">
              <label style={{ fontWeight: "600" }}>Edit Kecamatan:</label>
              <input
                className="data-input"
                type="text"
                name="kecamatan"
                value={editLocationData.kecamatan}
                onChange={handleInputChange}
                style={{ marginLeft: "3px" }}
              />
            </div>
            <div className="input-group">
              <label style={{ fontWeight: "600" }}>Edit Kota:</label>
              <input
                className="data-input"
                type="text"
                name="kota"
                value={editLocationData.kota}
                onChange={handleInputChange}
                style={{ marginLeft: "34px" }}
              />
            </div>
            <div className="input-group">
              <label style={{ fontWeight: "600" }}>Edit Provinsi  :</label>
              <input
                className="data-input"
                type="text"
                name="provinsi"
                value={editLocationData.provinsi}
                onChange={handleInputChange}
                style={{ marginLeft: "21px" }}
              />
            </div>
            <div className="input-group">
              <label style={{ fontWeight: "600" }}>Edit Latitude  :</label>
              <input
                className="data-input"
                type="text"
                name="lattitude"
                value={editLocationData.lattitude}
                onChange={handleInputChange}
                style={{ marginLeft: "5px" }}
              />
            </div>
            <div className="input-group">
              <label style={{ fontWeight: "600" }}>Edit Longitude :</label>
              <input
                className="data-input"
                type="text"
                name="longitude"
                value={editLocationData.longitude}
                onChange={handleInputChange}
                style={{ marginLeft: "5px" }}
              />
            </div>
            <div className="button-group" style={{ margin: "0 auto", paddingBottom: "10px" }}>
              <button onClick={handleEditLocation} className="edit-button">Edit</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  //Tombol untuk Tabel seluruh lokasi
  const [showTable, setShowTable] = useState(false);

  const handleTableDropdown = () => {
    setShowTable(!showTable);
    console.log(!showTable)
  };

  const TableLocation = () => {
    return (
      <div className="admin-main-content" style={{ margin: "0 auto", display: "flex", justifyContent: "center" }}>
        {provinces.map((province) => {
          const provinceData = data.filter((item) => item.provinsi === province);
          const cities = Array.from(new Set(provinceData.map((item) => item.kota))).sort();
          return (
            <table className="data-table" key={province}>
              <thead>
                <tr>
                  <th colSpan={7} className="judul-provinsi">{province}</th>
                </tr>
                <tr className="keterangan">
                  <th>Kota</th>
                  <th>Kecamatan</th>
                  <th>ID Alat</th>
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
                          <td rowSpan={cityData.length} className="pengaturan-kota">{city}</td>
                        )}
                        <td className="pengaturan-kecamatan">{kecamatan}</td>
                        <td className="pengaturan-alat">{id_alat}</td>
                        <td className="pengaturan-lattitude">{lattitude}</td>
                        <td className="pengaturan-longitude">{longitude}</td>
                        <td>
                          <FontAwesomeIcon
                            className="csv-icon"
                            icon={faFileArrowDown}
                            style={{ cursor: "pointer" }}
                            onClick={() => generateCSV(kecamatan)}
                          />
                        </td>
                      </tr>
                    );
                  });
                })}
              </tbody>
            </table>
          );
        })}
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





  //return hasil keseluruhan
  return (
    <div className="admin-dashboard col">
      <header>
        <h2 style={{ paddingTop: "75px", color: "white", marginLeft: "20px" }}>Welcome, {username}!</h2>
      </header>
      <LiveTable />
      <div className="admin-dashboard-content">
        <div className="admin-actions">
          <Dropdown
            className="admin-action"
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
          <button className="admin-action tabel-lokasi text-left" onClick={handleTableDropdown}>
            Tabel Lokasi <i className="fas fa-angle-down" style={{ float: "right", marginTop: "4px" }}></i>
          </button>
          {showTable && <TableLocation />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
