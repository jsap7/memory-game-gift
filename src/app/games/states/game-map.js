'use client';

import { useEffect, useRef, useCallback } from 'react';
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

export default function GameMap({ onStateClick, correctGuesses = [], gameStatus }) {
  const mapRef = useRef(null);
  const geoJsonRef = useRef(null);

  const initializeMap = useCallback(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('game-map', {
        center: [39.8283, -98.5795],
        zoom: 4,
        minZoom: 3,
        maxZoom: 8,
        zoomControl: true,
        attributionControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);

      const attribution = L.control.attribution({
        position: 'bottomright',
        prefix: false
      }).addTo(mapRef.current);
      
      attribution.addAttribution('<a href="https://www.openstreetmap.org/copyright">Sap Maps</a>');
    }
  }, []);

  const updateMap = useCallback(() => {
    fetch('/us-map/states.json')
      .then(response => response.json())
      .then(data => {
        if (geoJsonRef.current) {
          geoJsonRef.current.remove();
        }

        const style = (feature) => {
          const stateCode = stateIdToCode[feature.id];
          const isCorrect = correctGuesses.includes(stateCode);
          
          return {
            fillColor: isCorrect ? '#4CAF50' : '#E0E0E0',
            weight: 1,
            opacity: 1,
            color: '#666',
            fillOpacity: isCorrect ? 0.8 : 0.7,
            dashArray: null
          };
        };

        geoJsonRef.current = L.geoJSON(data, {
          style: style,
          onEachFeature: (feature, layer) => {
            const stateCode = stateIdToCode[feature.id];
            
            layer.on({
              mouseover: (e) => {
                const isCorrect = correctGuesses.includes(stateCode);
                layer.setStyle({
                  fillOpacity: 0.9,
                  weight: 2,
                  color: '#333'
                });
                layer.bringToFront();
              },
              mouseout: (e) => {
                const isCorrect = correctGuesses.includes(stateCode);
                layer.setStyle({
                  fillOpacity: isCorrect ? 0.8 : 0.7,
                  weight: 1,
                  color: '#666'
                });
              },
              click: (e) => {
                if (stateCode && gameStatus === 'playing') {
                  onStateClick(stateCode);
                }
              }
            });
          }
        }).addTo(mapRef.current);
      });
  }, [correctGuesses, gameStatus, onStateClick]);

  useEffect(() => {
    initializeMap();
    updateMap();

    const style = document.createElement('style');
    style.textContent = `
      .leaflet-container {
        background: #f5f5f5 !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;
      }
      .leaflet-control-container .leaflet-control {
        border: none !important;
      }
      .leaflet-control-attribution {
        background-color: rgba(255, 255, 255, 0.9) !important;
        padding: 4px 8px !important;
        border-radius: 4px !important;
        font-size: 11px !important;
        color: #666 !important;
        box-shadow: 0 1px 5px rgba(0,0,0,0.1) !important;
      }
      .leaflet-control-attribution a {
        color: #FF4081 !important;
        text-decoration: none !important;
      }
      .leaflet-control-attribution a:hover {
        text-decoration: underline !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      style.remove();
    };
  }, [initializeMap, updateMap]);

  return <div id="game-map" style={{ height: '600px', width: '100%' }} />;
} 