import React from 'react';
import { Link } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';
import styles from '../styles/Header.module.css';

const Header = () => {
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
                Home
              </Link>
            </li>
            <li>
              <Link to="/farmer/login" className={styles.navLink}>
                Farmer Login
              </Link>
            </li>
            <li>
              <Link to="/consumer/login" className={styles.navLink}>
                Consumer Login
              </Link>
            </li>
          </ul>
          <div className={styles.languageSelector}>
            <LanguageSelector />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;