import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import styles from '../styles/LandingPage.module.css';

const LandingPage = () => {
  const { t } = useLanguage();

  return (
    <div className={styles.landingPage}>
      <div className={styles.hero}>
        <h1 className={styles.title}>{t('hero.title')}</h1>
        <p className={styles.subtitle}>
          {t('hero.subtitle')}
        </p>
        <div className={styles.actions}>
          <Link to="/farmer/register" className={styles.primaryBtn}>
            Join as {t('nav.farmer')}
          </Link>
          <Link to="/consumer/register" className={styles.secondaryBtn}>
            Join as {t('nav.consumer')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;