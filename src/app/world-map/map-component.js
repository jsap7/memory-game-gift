'use client';

import { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapComponent({
  myCountries,
  herCountries,
  onSelectCountry,
  getVisitStatus,
  getCountryName
}) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const [geoJsonData, setGeoJsonData] = useState(null);

  useEffect(() => {
    // Cleanup function to destroy map instance
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize map with restricted bounds
    mapRef.current = L.map(containerRef.current, {
      center: [30, 0],
      zoom: 1.5,
      minZoom: 1,
      maxZoom: 8,
      maxBounds: [
        [-90, -180],
        [90, 180]
      ],
      maxBoundsViscosity: 1.0,
      worldCopyJump: true,
      bounceAtZoomLimits: false,
      zoomSnap: 0.5,
      zoomDelta: 0.5,
      attributionControl: false,
      dragging: true, // Enable dragging by default
      tap: true, // Enable tap
      touchZoom: true, // Enable touch zoom
      scrollWheelZoom: true // Enable scroll wheel zoom
    });

    // Remove the mobile-specific touch handling since we want panning to work everywhere
    if (L.Browser.mobile) {
      mapRef.current.on('load', () => {
        mapRef.current.dragging.enable();
        mapRef.current.touchZoom.enable();
        mapRef.current.doubleClickZoom.enable();
      });
    }

    // Add custom attribution control
    const attribution = L.control.attribution({
      position: 'bottomright',
      prefix: false
    }).addTo(mapRef.current);
    
    attribution.addAttribution('<a href="https://www.openstreetmap.org/copyright">Sap Maps</a>');

    // Add legend control
    const legend = L.control({ position: 'bottomleft' });
    legend.onAdd = function(map) {
      const div = L.DomUtil.create('div', 'info legend');
      div.innerHTML = `
        <div class="legend-item">
          <span class="color-box" style="background: #2196F3"></span>
          <span>Josh Only</span>
        </div>
        <div class="legend-item">
          <span class="color-box" style="background: #FF4081"></span>
          <span>Pook Only</span>
        </div>
        <div class="legend-item">
          <span class="color-box" style="background: #AE6EE7"></span>
          <span>Both</span>
        </div>
        <div class="legend-item">
          <span class="color-box" style="background: #E0E0E0"></span>
          <span>Not Visited</span>
        </div>
      `;
      return div;
    };
    legend.addTo(mapRef.current);

    // Add CSS to style the attribution and legend
    const style = document.createElement('style');
    style.textContent = `
      .leaflet-container {
        background: #f5f5f5 !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;
      }
      .leaflet-control-container .leaflet-control {
        border: none !important;
      }
      .leaflet-overlay-pane path {
        stroke: transparent !important;
      }
      .leaflet-control-attribution {
        background-color: rgba(255, 255, 255, 0.9) !important;
        padding: 4px 8px !important;
        border-radius: 4px !important;
        font-size: 11px !important;
        color: #666 !important;
        box-shadow: 0 1px 5px rgba(0,0,0,0.1) !important;
        max-width: none !important;
        white-space: normal !important;
        overflow: visible !important;
        text-overflow: clip !important;
      }
      .leaflet-control-attribution a {
        color: #FF4081 !important;
        text-decoration: none !important;
      }
      .leaflet-control-attribution a:hover {
        text-decoration: underline !important;
      }
      .legend {
        background-color: rgba(255, 255, 255, 0.9) !important;
        padding: 8px !important;
        border-radius: 4px !important;
        box-shadow: 0 1px 5px rgba(0,0,0,0.1) !important;
      }
      .legend-item {
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        margin: 4px 0 !important;
        font-size: 11px !important;
        color: #666 !important;
      }
      .color-box {
        width: 16px !important;
        height: 16px !important;
        border-radius: 3px !important;
        opacity: 0.7 !important;
      }
      @media (max-width: 640px) {
        .legend {
          margin-bottom: 40px !important;
        }
      }
      .leaflet-popup-content-wrapper {
        border-radius: 8px !important;
        padding: 8px !important;
      }
      .leaflet-popup-content {
        margin: 0 !important;
        font-size: 12px !important;
        line-height: 1.4 !important;
      }
      @media (min-width: 768px) {
        .leaflet-popup-content {
          font-size: 14px !important;
        }
      }
      .leaflet-popup-content strong {
        display: block !important;
        margin-bottom: 4px !important;
        color: #333 !important;
      }
      .leaflet-popup-tip-container {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    // Add tile layer with restricted bounds
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      noWrap: true,
      bounds: [
        [-90, -180],
        [90, 180]
      ]
    }).addTo(mapRef.current);

    // Fetch GeoJSON data
    fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
      .then(response => response.json())
      .then(data => setGeoJsonData(data));

    return () => {
      style.remove();
    };
  }, []);

  useEffect(() => {
    if (!geoJsonData || !mapRef.current) return;

    // Style function
    const style = (feature) => {
      const countryCode = feature.properties.ISO_A2;
      const name = feature.properties.NAME || '';
      const admin = feature.properties.ADMIN || '';
      const sovereign = feature.properties.SOVEREIGNT || '';

      // French Guiana and other territories check
      if (countryCode === 'GF' || 
          (sovereign === 'France' && 
           admin !== 'France' && 
           !name.includes('Metropolitan France') && 
           name !== 'France')) {
        return {
          fillColor: '#E0E0E0',
          weight: 0,
          opacity: 0,
          color: 'transparent',
          fillOpacity: 0.7
        };
      }

      const inMine = myCountries.some(c => c.code === countryCode);
      const inHers = herCountries.some(c => c.code === countryCode);
      
      let fillColor = '#E0E0E0';
      if (inMine && inHers) fillColor = '#AE6EE7';
      else if (inMine) fillColor = '#2196F3';
      else if (inHers) fillColor = '#FF4081';

      return {
        fillColor: fillColor,
        weight: 0,
        opacity: 0,
        color: 'transparent',
        fillOpacity: 0.7
      };
    };

    // Add GeoJSON layer
    const geoJsonLayer = L.geoJSON(geoJsonData, {
      style: style,
      onEachFeature: (feature, layer) => {
        const countryCode = feature.properties.ISO_A2;
        const status = getVisitStatus(countryCode);
        const name = getCountryName(countryCode) === countryCode ? 
          (feature.properties.ADMIN || feature.properties.NAME) : 
          getCountryName(countryCode);

        layer.bindPopup(`
          <strong>${name}</strong><br/>
          Status: ${status}
        `);

        layer.on({
          mouseover: (e) => {
            layer.setStyle({
              fillOpacity: 0.9,
              weight: 0,
              opacity: 0
            });
          },
          mouseout: (e) => {
            layer.setStyle({
              fillOpacity: 0.7,
              weight: 0,
              opacity: 0
            });
          },
          click: (e) => {
            onSelectCountry({
              code: countryCode,
              name: name,
              status: status
            });
          }
        });
      }
    }).addTo(mapRef.current);

    // Cleanup function to remove GeoJSON layer
    return () => {
      if (mapRef.current) {
        geoJsonLayer.remove();
      }
    };
  }, [geoJsonData, myCountries, herCountries, getVisitStatus, getCountryName, onSelectCountry]);

  return (
    <div 
      ref={containerRef}
      style={{ 
        height: '100%', 
        width: '100%',
        touchAction: 'none' // Prevent default touch actions on mobile
      }}
    />
  );
} 