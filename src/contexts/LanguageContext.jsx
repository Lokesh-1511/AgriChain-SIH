import React, { createContext, useContext, useState, useEffect } from 'react';

// Import all language files
import enTranslations from '../locales/en.json';
import hiTranslations from '../locales/hi.json';
import taTranslations from '../locales/ta.json';
import odTranslations from '../locales/od.json';
import teTranslations from '../locales/te.json';
import knTranslations from '../locales/kn.json';
import mlTranslations from '../locales/ml.json';

// Language translations map
const translations = {
  en: enTranslations,
  hi: hiTranslations,
  ta: taTranslations,
  od: odTranslations,
  te: teTranslations,
  kn: knTranslations,
  ml: mlTranslations,
};

// Available languages
export const availableLanguages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'od', name: 'ଓଡ଼ିଆ' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'മലയാളം' },
];

// Create Language Context
const LanguageContext = createContext();

// Helper function to get nested object value by dot notation
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

// Language Provider Component
export const LanguageProvider = ({ children }) => {
  // Get initial language from localStorage or default to 'en'
  const getInitialLanguage = () => {
    try {
      return localStorage.getItem('agrichain-language') || 'en';
    } catch (error) {
      return 'en';
    }
  };

  const [currentLanguage, setCurrentLanguage] = useState(getInitialLanguage);

  // Save language preference to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('agrichain-language', currentLanguage);
    } catch (error) {
      console.warn('Could not save language preference to localStorage:', error);
    }
  }, [currentLanguage]);

  // Set language function
  const setLanguage = (languageCode) => {
    if (translations[languageCode]) {
      setCurrentLanguage(languageCode);
    } else {
      console.warn(`Language ${languageCode} not supported, falling back to English`);
      setCurrentLanguage('en');
    }
  };

  // Translation function with dot notation support
  const t = (path, fallback = '') => {
    const currentTranslations = translations[currentLanguage];
    const englishTranslations = translations.en;
    
    // Try to get translation from current language
    let translation = getNestedValue(currentTranslations, path);
    
    // Fallback to English if translation not found
    if (!translation && currentLanguage !== 'en') {
      translation = getNestedValue(englishTranslations, path);
    }
    
    // Return translation, fallback, or path as last resort
    return translation || fallback || path;
  };

  const contextValue = {
    currentLanguage,
    setLanguage,
    t,
    availableLanguages,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use Language Context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
};

export default LanguageContext;