import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import styles from '../styles/LanguageSelector.module.css';

const LanguageSelector = () => {
  const { currentLanguage, setLanguage, availableLanguages } = useLanguage();

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <div className={styles.selectorWrapper}>
      <select 
        value={currentLanguage}
        onChange={handleLanguageChange}
        className={styles.selector}
        title="Select Language"
      >
        {availableLanguages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name} ({lang.code.toUpperCase()})
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;