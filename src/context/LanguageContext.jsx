import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../locales';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const explicitPref = localStorage.getItem('karnataka_desk_user_lang');
      if (explicitPref === 'en' || explicitPref === 'kn') {
        return explicitPref;
      }
      // Default to Kannada ('kn')
      localStorage.setItem('karnataka_desk_user_lang', 'kn');
      localStorage.setItem('karnataka_desk_lang', 'kn');
      return 'kn';
    } catch {
      return 'kn';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('karnataka_desk_user_lang', lang);
      localStorage.setItem('karnataka_desk_lang', lang);
    } catch {}
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = (selectedLang) => {
    if (selectedLang) {
      setLang(selectedLang);
      try {
        localStorage.setItem('karnataka_desk_user_lang', selectedLang);
        localStorage.setItem('karnataka_desk_lang', selectedLang);
      } catch {}
    } else {
      setLang(prev => {
        const next = prev === 'kn' ? 'en' : 'kn';
        try {
          localStorage.setItem('karnataka_desk_user_lang', next);
          localStorage.setItem('karnataka_desk_lang', next);
        } catch {}
        return next;
      });
    }
  };

  const t = (key) => {
    const currentDict = translations[lang] || translations.kn || translations.en;
    return currentDict[key] || translations.kn?.[key] || translations.en[key] || key;
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
    const fallbackLang = typeof localStorage !== 'undefined'
      ? (localStorage.getItem('karnataka_desk_user_lang') || localStorage.getItem('karnataka_desk_lang') || 'kn')
      : 'kn';
    const currentDict = translations[fallbackLang] || translations.kn || translations.en;
    return {
      lang: fallbackLang,
      setLang: () => {},
      toggleLang: () => {},
      t: (key) => currentDict[key] || translations.kn?.[key] || translations.en[key] || key
    };
  }
  return context;
}
