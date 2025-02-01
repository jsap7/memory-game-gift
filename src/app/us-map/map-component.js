'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// State ID to postal code mapping
const stateIdToCode = {
  '01': 'AL', '02': 'AK', '04': 'AZ', '05': 'AR', '06': 'CA',
  '08': 'CO', '09': 'CT', '10': 'DE', '11': 'DC', '12': 'FL',
  '13': 'GA', '15': 'HI', '16': 'ID', '17': 'IL', '18': 'IN',
  '19': 'IA', '20': 'KS', '21': 'KY', '22': 'LA', '23': 'ME',
  '24': 'MD', '25': 'MA', '26': 'MI', '27': 'MN', '28': 'MS',
  '29': 'MO', '30': 'MT', '31': 'NE', '32': 'NV', '33': 'NH',
  '34': 'NJ', '35': 'NM', '36': 'NY', '37': 'NC', '38': 'ND',
  '39': 'OH', '40': 'OK', '41': 'OR', '42': 'PA', '44': 'RI',
  '45': 'SC', '46': 'SD', '47': 'TN', '48': 'TX', '49': 'UT',
  '50': 'VT', '51': 'VA', '53': 'WA', '54': 'WV', '55': 'WI',
  '56': 'WY'
};

export default function MapComponent({
  myStates,
  herStates,
  onSelectState,
  getVisitStatus,
  getStateName
}) {
  const mapRef = useRef(null);
  const geoJsonRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize map
      mapRef.current = L.map('map', {
        center: [39.8283, -98.5795], // Center of the US
        zoom: 4,
        minZoom: 3,
        maxZoom: 8
      });

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);

      // Add custom attribution control
      const attribution = L.control.attribution({
        position: 'bottomright',
        prefix: false
      }).addTo(mapRef.current);
      
      attribution.addAttribution('<a href="https://www.openstreetmap.org/copyright">Sap Maps</a>');

      // Remove old attribution control
      mapRef.current.attributionControl.remove();
    }

    // Fetch GeoJSON data
    fetch('/us-map/states.json')
      .then(response => response.json())
      .then(data => {
        if (geoJsonRef.current) {
          geoJsonRef.current.remove();
        }

        // Style function
        const style = (feature) => {
          // Get state code from the ID mapping
          const stateCode = stateIdToCode[feature.id];
          
          if (!stateCode) {
            console.warn('No state code found for ID:', feature.id);
            return {
              fillColor: '#E0E0E0',
              weight: 1,
              opacity: 1,
              color: '#666',
              fillOpacity: 0.7,
              dashArray: null
            };
          }

          const inMine = myStates.some(s => s.code === stateCode);
          const inHers = herStates.some(s => s.code === stateCode);
          
          let fillColor = '#E0E0E0';
          if (inMine && inHers) fillColor = '#AE6EE7';
          else if (inMine) fillColor = '#2196F3';
          else if (inHers) fillColor = '#FF4081';

          return {
            fillColor: fillColor,
            weight: 1,
            opacity: 1,
            color: '#666',
            fillOpacity: 0.7,
            dashArray: null
          };
        };

        // Add GeoJSON layer
        geoJsonRef.current = L.geoJSON(data, {
          style: style,
          onEachFeature: (feature, layer) => {
            const stateCode = stateIdToCode[feature.id];
            const status = getVisitStatus(stateCode);
            const name = getStateName(stateCode) === stateCode ? 
              feature.properties.name : 
              getStateName(stateCode);

            layer.bindPopup(`
              <strong>${name}</strong><br/>
              Status: ${status}
            `);

            layer.on({
              mouseover: (e) => {
                layer.setStyle({
                  fillOpacity: 0.9,
                  weight: 1.5,
                  color: '#333'
                });
                layer.bringToFront();
              },
              mouseout: (e) => {
                layer.setStyle({
                  fillOpacity: 0.7,
                  weight: 1,
                  color: '#666'
                });
              },
              click: (e) => {
                onSelectState({
                  code: stateCode,
                  name: name,
                  status: status
                });
              }
            });
          }
        }).addTo(mapRef.current);
      });

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [myStates, herStates, getVisitStatus, getStateName, onSelectState]);

  return <div id="map" style={{ height: '600px', width: '100%' }} />;
} 