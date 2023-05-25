import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import "leaflet/dist/leaflet.css";

function Map() {
  return (
    <MapContainer center={[-6.9175, 107.6191]} zoom={12.5} style={{ height: '400px', width: '50%', margin : "0 auto" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
      />
      <Marker position={[51.505, -0.09]} />
    </MapContainer>
  );
}

export default Map;
