import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';
import styles from '../styles/Header.module.css';

const Header = () => {
  const { t } = useLanguage();

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          AGRICHAIN
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav} aria-label="Main navigation">
          <ul className={styles.navList}>
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
        </nav>

        {/* Right side controls */}
        <div className={styles.headerControls}>
          <div className={styles.languageWrapper}>
            <LanguageSelector />
          </div>
          
          {/* Mobile hamburger menu (non-functional visual for now) */}
          <button 
            className={styles.mobileMenuBtn} 
            aria-label="Open mobile menu"
            type="button"
          >
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;