import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './SearchBar.css';



function SearchBar() {
    {/*const untuk search bar*/ }
    const [location, setLocation] = useState("");
    const [locations, setLocations] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const searchRef = useRef(null);


    {/* Mengelompokkan data berdasarkan kota dan provinsi */ }
    const groupByCityProvince = (data) => {
        return data.reduce((result, item) => {
            const { kota, provinsi, kecamatan } = item;

            if (!result[kota]) {
                result[kota] = {};
            }

            if (!result[kota][provinsi]) {
                result[kota][provinsi] = [];
            }

            result[kota][provinsi].push(kecamatan);

            return result;
        }, {});
    };

    {/* Render dropdown location */ }
    const renderLocationDropdown = () => {
        const groupedLocations = groupByCityProvince(locations);

        return (
            <div className="location-dropdown" style={{ maxHeight: "200px", overflowY: "scroll" }}>
                {Object.keys(groupedLocations).map((kota) => {
                    return Object.keys(groupedLocations[kota]).map((provinsi) => {
                        return (
                            <div key={`${kota}_${provinsi}`} className="location-item" >
                                <div style={{fontWeight:"bold", fontSize:"15px", opacity:"0.75"}}>{kota}, {provinsi}</div>
                                {groupedLocations[kota][provinsi].map((kecamatan) => (
                                    <div className="kecamatan" key={kecamatan} style={{ cursor: "pointer", }} onClick={() => handleClick(kecamatan, kota, provinsi)}>
                                        {kecamatan}
                                    </div>
                                ))}
                            </div>
                        );
                    });
                })}
            </div>
        );
    };
    const [kota, setKota] = useState('');
    const [provinsi, setProvinsi] = useState('');

    const handleClick = (kecamatan, kota, provinsi) => {
        console.log('kota:', kota, 'provinsi:', provinsi);
        setKota(kota);
        setProvinsi(provinsi);
        window.location.href = `/main-graph/${kecamatan}?kota=${kota}&provinsi=${provinsi}`;
    };




    {/*Hook untuk searchbar */ }
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("click", handleOutsideClick);

        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [searchRef]);

    const handleLocationChange = (event) => {
        const { value } = event.target;
        setLocation(value);

        if (value !== "") {
            fetch(`http://34.101.124.69:3300/main/5/tampil_lokasi`)
                .then((response) => response.json())
                .then((data) => {
                    const filteredLocations = data.filter((loc) =>
                        loc.kecamatan.toLowerCase().includes(value.toLowerCase()) ||
                        loc.kota.toLowerCase().includes(value.toLowerCase()) ||
                        loc.provinsi.toLowerCase().includes(value.toLowerCase())
                    );
                    setLocations(filteredLocations);
                    setShowDropdown(true);
                })
                .catch((error) => console.log(error));
        } else {
            setShowDropdown(false);
            setLocations([]);
        }
    };


    return (
        <div className="search-bar" ref={searchRef} style={{ marginRight: "30px" }}>
            <form className="form-inline my-2 my-lg-0">
                <input
                    className="form-control mr-sm-2"
                    type="search"
                    placeholder="Cari lokasi"
                    aria-label="Search"
                    value={location}
                    onChange={handleLocationChange}
                />
                <button id ="searchIcon" className="btn btn-outline-success my-2 my-sm-0" type="submit">
                    <FontAwesomeIcon icon={faSearch} />
                </button>
            </form>
            {showDropdown && renderLocationDropdown()}
        </div>
    );
}

export default SearchBar;