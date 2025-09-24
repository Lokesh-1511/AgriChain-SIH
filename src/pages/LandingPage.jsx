import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/LandingPage.module.css';

const LandingPage = () => {
  return (
    <div className={styles.landingPage}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Welcome to AgriChain</h1>
        <p className={styles.subtitle}>
          Farm to Fork Traceability - Track your food from production to consumption
        </p>
        <div className={styles.actions}>
          <Link to="/farmer/register" className={styles.primaryBtn}>
            Join as Farmer
          </Link>
          <Link to="/consumer/register" className={styles.secondaryBtn}>
            Join as Consumer
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;