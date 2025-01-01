'use client';

import { useState, useEffect } from 'react';
import styles from './PasswordProtection.module.css';

const CORRECT_PASSWORD = 'pookandjoshy'; // You can change this to any password you want
const PASSWORD_KEY = 'site_authenticated';

const PasswordProtection = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if already authenticated
    const authenticated = localStorage.getItem(PASSWORD_KEY) === 'true';
    setIsAuthenticated(authenticated);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      localStorage.setItem(PASSWORD_KEY, 'true');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  if (isAuthenticated) {
    return children;
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Welcome</h1>
        <p className={styles.subtitle}>Please enter the password to continue</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className={styles.input}
            autoFocus
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.button}>
            Enter
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordProtection; 