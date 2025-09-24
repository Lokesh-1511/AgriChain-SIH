import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import styles from '../styles/LandingPage.module.css';

const LandingPage = () => {
  const { t } = useLanguage();

  return (
    <div className={styles.landingPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{t('hero.title')}</h1>
          <p className={styles.heroSubtitle}>{t('hero.subtitle')}</p>
          
          {/* Main CTA Cards */}
          <div className={styles.ctaCards}>
            <Link to="/farmer/login" className={`${styles.ctaCard} ${styles.farmerCard}`}>
              <div className={styles.ctaIcon}>🌾</div>
              <h3 className={styles.ctaTitle}>{t('hero.farmerCTA')}</h3>
              <p className={styles.ctaDesc}>{t('hero.farmerDesc')}</p>
              <div className={styles.ctaButton}>
                {t('auth.login')} →
              </div>
            </Link>
            
            <Link to="/consumer/login" className={`${styles.ctaCard} ${styles.consumerCard}`}>
              <div className={styles.ctaIcon}>🛒</div>
              <h3 className={styles.ctaTitle}>{t('hero.consumerCTA')}</h3>
              <p className={styles.ctaDesc}>{t('hero.consumerDesc')}</p>
              <div className={styles.ctaButton}>
                {t('auth.login')} →
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔍</div>
            <h4 className={styles.featureTitle}>{t('features.traceability.title')}</h4>
            <p className={styles.featureDesc}>{t('features.traceability.desc')}</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🤖</div>
            <h4 className={styles.featureTitle}>{t('features.ai.title')}</h4>
            <p className={styles.featureDesc}>{t('features.ai.desc')}</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>💳</div>
            <h4 className={styles.featureTitle}>{t('features.payments.title')}</h4>
            <p className={styles.featureDesc}>{t('features.payments.desc')}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;