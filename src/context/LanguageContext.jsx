import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../locales';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('karnataka_desk_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('karnataka_desk_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = (selectedLang) => {
    if (selectedLang) {
      setLang(selectedLang);
    } else {
      setLang(prev => (prev === 'en' ? 'kn' : 'en'));
    }
  };

  const t = (key) => {
    const currentDict = translations[lang] || translations.en;
    return currentDict[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
