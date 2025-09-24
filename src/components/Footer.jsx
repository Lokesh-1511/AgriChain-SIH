import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import styles from '../styles/Footer.module.css';

const Footer = () => {
  const { t, currentLanguage, availableLanguages } = useLanguage();
  const currentLangName = availableLanguages.find(lang => lang.code === currentLanguage)?.name || 'English';

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Main Footer Content */}
        <div className={styles.footerContent}>
          {/* Brand Section */}
          <div className={styles.brandSection}>
            <Link to="/" className={styles.footerLogo}>
              AGRICHAIN
            </Link>
            <p className={styles.brandDesc}>
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Quick Links */}
          <div className={styles.linkSection}>
            <h4 className={styles.linkTitle}>{t('footer.links')}</h4>
            <ul className={styles.linkList}>
              <li>
                <Link to="/farmer/login" className={styles.footerLink}>
                  {t('nav.farmer')} {t('auth.login')}
                </Link>
              </li>
              <li>
                <Link to="/consumer/login" className={styles.footerLink}>
                  {t('nav.consumer')} {t('auth.login')}
                </Link>
              </li>
              <li>
                <Link to="/about" className={styles.footerLink}>
                  {t('footer.about')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className={styles.footerLink}>
                  {t('footer.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Language Info */}
          <div className={styles.languageSection}>
            <h4 className={styles.linkTitle}>{t('footer.language')}</h4>
            <p className={styles.currentLanguage}>
              {currentLangName} ({currentLanguage.toUpperCase()})
            </p>
            <p className={styles.languageNote}>
              7 languages available
            </p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className={styles.footerBottom}>
          <div className={styles.copyright}>
            <p>&copy; 2025 AgriChain. All rights reserved.</p>
          </div>
          <div className={styles.legalLinks}>
            <Link to="/privacy" className={styles.legalLink}>
              {t('footer.privacy')}
            </Link>
            <Link to="/terms" className={styles.legalLink}>
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;