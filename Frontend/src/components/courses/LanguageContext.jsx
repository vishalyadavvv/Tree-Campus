// client/src/context/LanguageContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('hindi');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
  };

  const translate = (hindiText, englishText) => {
    return language === 'hindi' ? hindiText : englishText;
  };

  const value = {
    language,
    changeLanguage,
    translate,
    isHindi: language === 'hindi',
    isEnglish: language === 'english'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

