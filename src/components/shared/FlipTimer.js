import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import styles from './SharedStyles.module.css';

const FlipTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2025-01-22T14:00:00+01:00').getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num) => String(num).padStart(2, '0');

  return (
    <div className={styles.timerContainer}>
      <div className={styles.timerTitle}>
        <Clock className={styles.clockIcon} />
        <h2>Time Til Paris!</h2>
      </div>
      <div className={styles.countdownDisplay}>
        <div className={styles.timeUnit}>
          <div className={styles.number}>{formatNumber(timeLeft.days)}</div>
          <div className={styles.label}>DAYS</div>
        </div>
        <div className={styles.timeUnit}>
          <div className={styles.number}>{formatNumber(timeLeft.hours)}</div>
          <div className={styles.label}>HOURS</div>
        </div>
        <div className={styles.timeUnit}>
          <div className={styles.number}>{formatNumber(timeLeft.minutes)}</div>
          <div className={styles.label}>MINS</div>
        </div>
        <div className={styles.timeUnit}>
          <div className={styles.number}>{formatNumber(timeLeft.seconds)}</div>
          <div className={styles.label}>SECS</div>
        </div>
      </div>
    </div>
  );
};

export default FlipTimer; 