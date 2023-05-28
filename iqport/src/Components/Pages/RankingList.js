import React, { useState, useEffect } from "react";

function RankingList() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://aqport.my.id/main/5/live_ranking/2023-03-30%2009:00:00")
      .then((response) => response.json())
      .then((data) => {
        // Sort the data by "rata_nilai_ispu" in descending order
        data.sort((a, b) => b.rata_nilai_ispu - a.rata_nilai_ispu);
        setData(data);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="col-md-3 ml-3">
      <div className="ranking-list card">
        <div className="card-body">
          <h5>Kualitas Udara Kota Bandung setiap stasiun</h5>
          <ol>
            {data.map((item, index) => (
              <li key={index}>
                {item.lokasi}
                <span className="float-right">{item.rata_nilai_ispu} ppm</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default RankingList;