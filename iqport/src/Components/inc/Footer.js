import React, { useState } from 'react';

function Footer() {
    //mau bikin 10 koordinat
  const [koordinat, setKoordinat] = useState(Array(10).fill({ x: 0, y: 0 }));

  const handleSubmit = (e) => {
    e.preventDefault();

    // mengambil nilai x dan y dari form
    const x = e.target.elements.x.value;
    const y = e.target.elements.y.value;
    
    // memperbarui nilai koordinat di state
    setKoordinat((prevCoordinates) =>
      prevCoordinates.map((coord, index) =>
        index === Number(e.target.dataset.index) ? { x, y } : coord
      )
    );
  };

  return (
    <div>
      {koordinat.map((coord, index) => (
        <div
          key={index}
          id={`coor${index + 1}`}
        >
          <p>X: {coord.x}</p>
          <p>Y: {coord.y}</p>
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        {koordinat.map((coord, index) => (
          <div key={index}>
            <label htmlFor={`coor${index + 1}`}>Coordinate {index + 1}</label>
            <br />
            <label htmlFor={`x${index + 1}`}>X:</label>
            <input type="number" id={`x${index + 1}`} name="x" />
            <label htmlFor={`y${index + 1}`}>Y:</label>
            <input type="number" id={`y${index + 1}`} name="y" />
            <button type="submit" data-index={index}>
              Submit
            </button>
          </div>
        ))}
      </form>
    </div>
  );
}

export default Footer;
