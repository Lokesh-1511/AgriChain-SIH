import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';
import styles from '../styles/Header.module.css';

const Header = () => {
  const { t, currentLanguage } = useLanguage();

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link to="/" className={styles.logo}>
          AGRICHAIN
        </Link>
        <nav className={styles.nav}>
          <ul className={styles.navLinks}>
            <li>
              <Link to="/" className={styles.navLink}>
                {t('nav.home')}
              </Link>
            </li>
            <li>
              <Link to="/farmer/login" className={styles.navLink}>
                {t('nav.farmer')} {t('auth.login')}
              </Link>
            </li>
            <li>
              <Link to="/consumer/login" className={styles.navLink}>
                {t('nav.consumer')} {t('auth.login')}
              </Link>
            </li>
          </ul>
          <div className={styles.languageSelector}>
            <span className={styles.currentLang}>({currentLanguage.toUpperCase()})</span>
            <LanguageSelector />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;