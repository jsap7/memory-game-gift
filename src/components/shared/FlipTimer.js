import React, { useState, useEffect } from 'react';
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import '@leenguyen/react-flip-clock-countdown/dist/index.css';
import { Clock } from 'lucide-react';
import styles from './SharedStyles.module.css';

const RandomNumber = () => {
  const [number, setNumber] = useState('88');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setNumber(Math.floor(Math.random() * 90 + 10).toString());
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return number;
};

const FlipTimer = () => {
  const [showTimer, setShowTimer] = useState(false);
  
  // January 22nd, 2025, 14:00 (2:00 PM) Paris time
  const targetDate = new Date('2025-01-22T14:00:00+01:00').getTime();

  useEffect(() => {
    setTimeout(() => setShowTimer(true), 1500);
  }, []);

  return (
    <div className={styles.timerContainer}>
      <div className={styles.timerTitle}>
        <Clock className={styles.clockIcon} />
        <h2>Time Til Paris!</h2>
      </div>
      <div className={styles.flipTimer}>
        {!showTimer ? (
          <div className={styles.loadingNumbers}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className={styles.loadingCard}>
                <div className={styles.loadingDigits}>
                  <RandomNumber />
                </div>
                <div className={styles.loadingLabel}>
                  {i === 0 ? 'DAYS' : i === 1 ? 'HOURS' : i === 2 ? 'MINS' : 'SECS'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <FlipClockCountdown
            to={targetDate}
            labels={['DAYS', 'HOURS', 'MINS', 'SECS']}
            labelStyle={{
              fontSize: 10,
              fontWeight: 500,
              textTransform: 'uppercase',
              color: '#666'
            }}
            digitBlockStyle={{
              width: 40,
              height: 60,
              fontSize: 30,
              backgroundColor: '#2D2D2D',
              color: 'white',
            }}
            dividerStyle={{ color: '#2D2D2D', height: 1 }}
            separatorStyle={{ color: '#2D2D2D', size: '6px' }}
            duration={0.5}
          />
        )}
      </div>
    </div>
  );
};

export default FlipTimer; 