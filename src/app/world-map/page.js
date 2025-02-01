/* Create new file for the world map feature */
'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import Link from 'next/link';

const myCountries = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
  { code: 'BS', name: 'The Bahamas', flag: '🇧🇸' },
  { code: 'KY', name: 'The Cayman Islands', flag: '🇰🇾' },
  { code: 'VG', name: 'The British Virgin Islands', flag: '🇻🇬' },
  { code: 'TC', name: 'Turks and Caicos', flag: '🇹🇨' },
  { code: 'HN', name: 'Honduras', flag: '🇭🇳' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷' },
  { code: 'BZ', name: 'Belize', flag: '🇧🇿' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' }
];

const herCountries = [
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'BS', name: 'The Bahamas', flag: '🇧🇸' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'CZ', name: 'Czechia', flag: '🇨🇿' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'US', name: 'United States', flag: '🇺🇸' }
];

const getVisitStatus = (countryCode) => {
  const inMine = myCountries.some(c => c.code === countryCode);
  const inHers = herCountries.some(c => c.code === countryCode);
  if (inMine && inHers) return 'Both visited';
  if (inMine) return 'Only Josh visited';
  if (inHers) return 'Only Gigi visited';
  return 'Not visited yet';
};

const getCountryName = (countryCode) => {
  const myCountry = myCountries.find(c => c.code === countryCode);
  const herCountry = herCountries.find(c => c.code === countryCode);
  return (myCountry || herCountry)?.name || countryCode;
};

// Dynamically import the Map component with SSR disabled
const Map = dynamic(() => import('./map-component'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      height: '600px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px'
    }}>
      Loading map...
    </div>
  )
});

export default function WorldMapPage() {
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Get countries for each category
  const bothVisited = myCountries.filter(country => 
    herCountries.some(c => c.code === country.code)
  );

  const onlyJosh = myCountries.filter(country => 
    !herCountries.some(c => c.code === country.code)
  );

  const onlyPook = herCountries.filter(country => 
    !myCountries.some(c => c.code === country.code)
  );

  return (
    <div className="map-page">
      <Link href="/" className="back-button">
        ← Back
      </Link>

      <div className="map-container">
        <Map
          myCountries={myCountries}
          herCountries={herCountries}
          onSelectCountry={setSelectedCountry}
          getVisitStatus={getVisitStatus}
          getCountryName={getCountryName}
        />
      </div>

      <div className="countries-grid">
        <div className="country-list">
          <h2 className="list-title josh">Josh Only ({onlyJosh.length})</h2>
          <ul className="country-items">
            {onlyJosh.map(country => (
              <li key={country.code} className="country-item">
                <span className="country-flag">{country.flag}</span>
                <span className="country-name">{country.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="country-list">
          <h2 className="list-title pook">Pook Only ({onlyPook.length})</h2>
          <ul className="country-items">
            {onlyPook.map(country => (
              <li key={country.code} className="country-item">
                <span className="country-flag">{country.flag}</span>
                <span className="country-name">{country.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="country-list">
          <h2 className="list-title both">Both ({bothVisited.length})</h2>
          <ul className="country-items">
            {bothVisited.map(country => (
              <li key={country.code} className="country-item">
                <span className="country-flag">{country.flag}</span>
                <span className="country-name">{country.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style jsx>{`
        .map-page {
          padding: 1rem 1rem 100px 1rem;
          min-height: 100vh;
          background: #f5f5f5;
          position: relative;
        }

        @media (min-width: 768px) {
          .map-page {
            padding: 2rem 2rem 100px 2rem;
          }
        }

        .back-button {
          display: inline-block;
          padding: 0.5rem 1rem;
          margin-bottom: 1rem;
          background: white;
          border-radius: 8px;
          color: #333;
          text-decoration: none;
          font-weight: 500;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: transform 0.2s ease;
        }

        .back-button:hover {
          transform: translateX(-2px);
        }

        .map-container {
          height: 300px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          margin-bottom: 1.5rem;
        }

        @media (min-width: 768px) {
          .map-container {
            height: 400px;
            margin-bottom: 2rem;
          }
        }

        @media (min-width: 1024px) {
          .map-container {
            height: 500px;
          }
        }

        .countries-grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: 1fr;
        }

        @media (min-width: 768px) {
          .countries-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }
        }

        @media (min-width: 1024px) {
          .countries-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
          }
        }

        .country-list {
          background: white;
          border-radius: 12px;
          padding: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        @media (min-width: 768px) {
          .country-list {
            padding: 1.5rem;
          }
        }

        .list-title {
          font-size: 1.2rem;
          padding-bottom: 0.5rem;
          margin-bottom: 1rem;
          border-bottom-width: 2px;
          border-bottom-style: solid;
        }

        @media (min-width: 768px) {
          .list-title {
            font-size: 1.4rem;
          }
        }

        .list-title.josh {
          color: #2196F3;
          border-bottom-color: #2196F3;
        }

        .list-title.pook {
          color: #FF4081;
          border-bottom-color: #FF4081;
        }

        .list-title.both {
          color: #AE6EE7;
          border-bottom-color: #AE6EE7;
        }

        .country-items {
          list-style: none;
          padding: 0;
          margin: 0;
          font-size: 0.9rem;
        }

        @media (min-width: 768px) {
          .country-items {
            font-size: 1rem;
          }
        }

        .country-item {
          padding: 0.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .country-flag {
          font-size: 1.2rem;
        }

        .country-name {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
} 