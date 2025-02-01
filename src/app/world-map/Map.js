'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';

export default function Map({ onEachCountry }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    import('leaflet/dist/leaflet.css');
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{ 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        Loading map...
      </div>
    );
  }

  return (
    <div key={`map-container-${Date.now()}`} style={{ height: '100%', width: '100%' }}>
      <MapContainer
        key={`map-${Date.now()}`}
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        minZoom={2}
        maxZoom={10}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <GeoJSON
          key={`geojson-${Date.now()}`}
          data={require('./countries.json')}
          onEachFeature={onEachCountry}
        />
      </MapContainer>
    </div>
  );
} 