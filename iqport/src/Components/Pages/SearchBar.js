import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function SearchBar() {
  const [location, setLocation] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetch("http://34.101.124.69:3300/main/5/live_ranking/2023-03-30%2009:00:00")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setFilteredData(data);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleLocationInputChange = (event) => {
    setLocation(event.target.value);

    const filtered = data.filter((item) =>
      item.lokasi.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <div className="location-found-container">
      <h3 className="text-left my-2">Bandung {location}</h3>
      <div className="search-bar">
        <form className="form-inline my-2 my-lg-0">
          <input
            className="form-control mr-sm-2"
            type="search"
            placeholder="Cari kecamatan"
            aria-label="Search"
            value={location}
            onChange={handleLocationInputChange}
          />
          <button className="btn btn-outline-success my-2 my-sm-0" type="submit">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </form>
      </div>
      <div>
        {filteredData.map((item) => (
          <p key={item.lokasi}>{item.lokasi}</p>
        ))}
      </div>
    </div>
  );
}

export default SearchBar;
