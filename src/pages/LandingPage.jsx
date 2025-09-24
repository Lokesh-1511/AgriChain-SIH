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
        
        <div className={styles.dashboardCards}>
          <Link to="/farmer/dashboard" className={styles.dashboardCard}>
            <div className={styles.cardIcon}>🌾</div>
            <h3 className={styles.cardTitle}>{t('hero.farmerDashboard')}</h3>
            <p className={styles.cardSubtitle}>{t('hero.farmerSubtitle')}</p>
            <div className={styles.cardButton}>
              {t('auth.login')} →
            </div>
          </Link>
          
          <Link to="/consumer/dashboard" className={styles.dashboardCard}>
            <div className={styles.cardIcon}>🛒</div>
            <h3 className={styles.cardTitle}>{t('hero.consumerDashboard')}</h3>
            <p className={styles.cardSubtitle}>{t('hero.consumerSubtitle')}</p>
            <div className={styles.cardButton}>
              {t('auth.login')} →
            </div>
          </Link>
        </div>

        <div className={styles.registerLinks}>
          <p>New user? 
            <Link to="/farmer/register" className={styles.registerLink}>
              {t('nav.farmer')} {t('auth.register')}
            </Link>
            or
            <Link to="/consumer/register" className={styles.registerLink}>
              {t('nav.consumer')} {t('auth.register')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;