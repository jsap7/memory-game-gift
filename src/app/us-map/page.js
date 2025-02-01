'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import Link from 'next/link';

const myStates = [
  { code: 'CA', name: 'California', flag: '🌊' },
  { code: 'MA', name: 'Massachusetts', flag: '🦞' },
  { code: 'NJ', name: 'New Jersey', flag: '🏖️' },
  { code: 'FL', name: 'Florida', flag: '🌴' },
  { code: 'VA', name: 'Virginia', flag: '⚓' },
  { code: 'ME', name: 'Maine', flag: '🦐' },
  { code: 'NH', name: 'New Hampshire', flag: '🏔️' },
  { code: 'VT', name: 'Vermont', flag: '🍁' },
  { code: 'CT', name: 'Connecticut', flag: '🌳' },
  { code: 'RI', name: 'Rhode Island', flag: '🛟' },
  { code: 'NY', name: 'New York', flag: '🗽' },
  { code: 'DE', name: 'Delaware', flag: '🐚' },
  { code: 'PA', name: 'Pennsylvania', flag: '🏛️' },
  { code: 'MD', name: 'Maryland', flag: '🦀' },
  { code: 'NC', name: 'North Carolina', flag: '🌲' },
  { code: 'SC', name: 'South Carolina', flag: '🏕️' },
  { code: 'GA', name: 'Georgia', flag: '🍑' },
  { code: 'DC', name: 'District of Columbia', flag: '🏛️' },
  { code: 'WV', name: 'West Virginia', flag: '🍻' },
  { code: 'TN', name: 'Tennessee', flag: '🎸' },
  { code: 'KY', name: 'Kentucky', flag: '🐎' },
  { code: 'MI', name: 'Michigan', flag: '🚗' },
  { code: 'IL', name: 'Illinois', flag: '🌆' },
  { code: 'UT', name: 'Utah', flag: '🏔️' },
  { code: 'TX', name: 'Texas', flag: '🤠' },
  { code: 'HI', name: 'Hawaii', flag: '🌺' },
];

const herStates = [
  { code: 'AZ', name: 'Arizona', flag: '🌵' },
  { code: 'DE', name: 'Delaware', flag: '🐚' },
  { code: 'FL', name: 'Florida', flag: '🌴' },
  { code: 'HI', name: 'Hawaii', flag: '🌺' },
  { code: 'MD', name: 'Maryland', flag: '🦀' },
  { code: 'MN', name: 'Minnesota', flag: '🌲' },
  { code: 'NJ', name: 'New Jersey', flag: '🏖️' },
  { code: 'NY', name: 'New York', flag: '🗽' },
  { code: 'PA', name: 'Pennsylvania', flag: '🏛️' },
  { code: 'SC', name: 'South Carolina', flag: '🏕️' },
  { code: 'TN', name: 'Tennessee', flag: '🎸' },
  { code: 'TX', name: 'Texas', flag: '🤠' },
  { code: 'VA', name: 'Virginia', flag: '⚓' },
  { code: 'WV', name: 'West Virginia', flag: '🍻' },
  { code: 'DC', name: 'District of Columbia', flag: '🏛️' },
  { code: 'NC', name: 'North Carolina', flag: '🌲' },
];

const getVisitStatus = (stateCode) => {
  const inMine = myStates.some(s => s.code === stateCode);
  const inHers = herStates.some(s => s.code === stateCode);
  if (inMine && inHers) return 'Both visited';
  if (inMine) return 'Only Josh visited';
  if (inHers) return 'Only Gigi visited';
  return 'Not visited yet';
};

const getStateName = (stateCode) => {
  const myState = myStates.find(s => s.code === stateCode);
  const herState = herStates.find(s => s.code === stateCode);
  return (myState || herState)?.name || stateCode;
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

export default function USMapPage() {
  const [selectedState, setSelectedState] = useState(null);

  // Get states for each category
  const bothVisited = myStates.filter(state => 
    herStates.some(s => s.code === state.code)
  );

  const onlyJosh = myStates.filter(state => 
    !herStates.some(s => s.code === state.code)
  );

  const onlyPook = herStates.filter(state => 
    !myStates.some(s => s.code === state.code)
  );

  return (
    <div className="map-page">
      <Link href="/" className="back-button">
        ← Back
      </Link>

      <div className="title-container">
        <h1 className="map-title">States We've Been To</h1>
      </div>

      <style jsx>{`
        .title-container {
          text-align: center;
          margin: 2rem 0;
        }

        .map-title {
          font-size: 2.5rem;
          color: #333;
          margin: 0;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .map-title {
            font-size: 2rem;
          }
        }
      `}</style>

      <div className="map-container">
        <Map
          myStates={myStates}
          herStates={herStates}
          onSelectState={setSelectedState}
          getVisitStatus={getVisitStatus}
          getStateName={getStateName}
        />
        <div className="legend">
          <h4>States Visited</h4>
          <div className="legend-item">
            <span className="legend-color josh-only"></span>
            <span className="legend-text">Josh Only ({onlyJosh.length})</span>
          </div>
          <div className="legend-item">
            <span className="legend-color gigi-only"></span>
            <span className="legend-text">Gigi Only ({onlyPook.length})</span>
          </div>
          <div className="legend-item">
            <span className="legend-color both"></span>
            <span className="legend-text">Both ({bothVisited.length})</span>
          </div>
          <div className="legend-item">
            <span className="legend-color not-visited"></span>
            <span className="legend-text">Not Visited</span>
          </div>
        </div>
      </div>

      {selectedState && (
        <div className="state-info">
          <h3>{selectedState.name}</h3>
          <p>{selectedState.status}</p>
        </div>
      )}

      <div className="lists-container">
        <div className="list-section">
          <h2 className="list-title">Josh Only ({onlyJosh.length})</h2>
          <div className="state-list">
            {onlyJosh.map(state => (
              <div key={state.code} className="state-item">
                <span className="state-flag">{state.flag}</span>
                <span className="state-name">{state.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="list-section">
          <h2 className="list-title">Pook Only ({onlyPook.length})</h2>
          <div className="state-list">
            {onlyPook.map(state => (
              <div key={state.code} className="state-item">
                <span className="state-flag">{state.flag}</span>
                <span className="state-name">{state.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="list-section">
          <h2 className="list-title">Both ({bothVisited.length})</h2>
          <div className="state-list">
            {bothVisited.map(state => (
              <div key={state.code} className="state-item">
                <span className="state-flag">{state.flag}</span>
                <span className="state-name">{state.name}</span>
              </div>
            ))}
          </div>
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
          display: flex;
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .legend {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          height: fit-content;
          min-width: 200px;
          border: 1px solid #e0e0e0;
        }

        .legend h4 {
          margin: 0 0 1rem 0;
          font-size: 1.2rem;
          color: #333;
        }

        .legend-item {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
          font-size: 1rem;
          color: #666;
        }

        .legend-color {
          display: inline-block;
          width: 24px;
          height: 24px;
          margin-right: 12px;
          border-radius: 4px;
          border: 1px solid rgba(0,0,0,0.1);
        }

        .legend-text {
          flex: 1;
        }

        .josh-only {
          background: #2196F3;
        }

        .gigi-only {
          background: #FF4081;
        }

        .both {
          background: #AE6EE7;
        }

        .not-visited {
          background: #E0E0E0;
        }

        .lists-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          max-width: 1400px;
          margin: 2rem auto;
          padding: 0 1rem;
        }

        .list-section {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          border: 1px solid #e0e0e0;
        }

        .list-title {
          margin: 0 0 1rem 0;
          font-size: 1.2rem;
          color: #333;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #f0f0f0;
        }

        .state-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .state-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          border-radius: 4px;
          background: #f8f8f8;
        }

        .state-flag {
          font-size: 1.2rem;
        }

        .state-name {
          color: #666;
        }

        @media (max-width: 768px) {
          .map-container {
            flex-direction: column;
          }

          .legend {
            margin-top: 1rem;
          }

          .lists-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
} 