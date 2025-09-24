import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSelector = () => {
  const { currentLanguage, setLanguage, availableLanguages } = useLanguage();

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <select 
      value={currentLanguage}
      onChange={handleLanguageChange}
      style={{ 
        padding: '0.25rem 0.5rem', 
        borderRadius: '3px', 
        border: '1px solid #ccc',
        backgroundColor: 'white'
      }}
    >
      {availableLanguages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector;