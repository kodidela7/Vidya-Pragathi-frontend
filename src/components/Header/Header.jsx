import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Header.module.css';

export default function Header({ onOpenAdmin, onOpenJobs, onOpenRegister, onBackToHome }) {
  const { lang, toggleLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  const handleBrandClick = (e) => {
    closeMenu();
    if (onBackToHome) {
      e.preventDefault();
      onBackToHome();
    }
  };

  const handleRegisterClick = (e) => {
    closeMenu();
    if (onOpenRegister) {
      e.preventDefault();
      onOpenRegister();
    }
  };

  return (
    <header className={styles.siteHeaderWrapper}>
      {/* 1. Top Tricolor Ribbon */}
      <div className={styles.ribbon}></div>

      {/* 2. Compact Bulletin Bar */}
      <div className={styles.bulletinBar}>
        <div className={`site-container ${styles.bulletinInner}`}>
          <div className={styles.bulletinLeft}>
            <span className={styles.bulletinDistricts}>
              <span className="material-symbols-outlined" style={{ fontSize: '13px', verticalAlign: 'middle', marginRight: '4px' }}>location_on</span>
              {t('bulletinDistricts')}
            </span>
          </div>

          <div className={styles.bulletinRight}>
            {/* Bilingual Switcher */}
            <div className={styles.langToggle}>
              <button
                className={`${styles.langBtn} ${lang === 'en' ? styles.langBtnActive : ''}`}
                onClick={() => toggleLang('en')}
                type="button"
                aria-label="Switch to English"
              >
                English
              </button>
              <button
                className={`${styles.langBtn} ${lang === 'kn' ? styles.langBtnActive : ''}`}
                onClick={() => toggleLang('kn')}
                type="button"
                aria-label="ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಿ"
              >
                ಕನ್ನಡ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Navigation Bar */}
      <div className={styles.mainNavbar}>
        <div className={`site-container ${styles.navbarInner}`}>
          {/* Logo & Brand Identity */}
          <a
            href="#"
            className={styles.brand}
            onClick={handleBrandClick}
            aria-label={lang === 'kn' ? 'ಪದವಿ ಪಥ - ಪದವೀಧರರ ಕರಿಯರ್ ಡೆಸ್ಕ್' : 'Padavi Path - Graduate Career Desk'}
          >
            <img
              src={lang === 'kn' ? '/images/Graduate Career Desk Logo2.png' : '/images/Graduate Career Desk Logo-new.png'}
              alt={lang === 'kn' ? 'ಪದವಿ ಪಥ - ಪದವೀಧರರ ಕರಿಯರ್ ಡೆಸ್ಕ್' : 'Padavi Path - Graduate Career Desk'}
              className={styles.brandLogoImg}
            />
          </a>

          {/* Clean Navigation Links on Desktop (Per user request) */}
          <nav className={styles.navLinks} aria-label="Main Navigation">
            <a
              href="#jobs"
              className={styles.navLink}
              onClick={(e) => {
                e.preventDefault();
                if (onOpenJobs) onOpenJobs();
              }}
            >
              {t('navJobs')}
            </a>
            <a
              href="#events"
              className={styles.navLink}
              onClick={() => {
                if (onBackToHome) onBackToHome();
              }}
            >
              {t('navEvents')}
            </a>
            <a
              href="#helpdesk"
              className={styles.navLink}
              onClick={() => {
                if (onBackToHome) onBackToHome();
              }}
            >
              {t('navHelpdesk')}
            </a>
            <a
              href="#register"
              className={styles.registerHighlightBtn}
              onClick={handleRegisterClick}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>school</span>
              <span>{t('navGraduateRegister')}</span>
            </a>
          </nav>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            className={styles.mobileMenuToggle}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            type="button"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className={styles.mobileDrawer}>
            <a
              href="#jobs"
              className={styles.mobileNavLink}
              onClick={() => {
                closeMenu();
                if (onOpenJobs) onOpenJobs();
              }}
            >
              <span>{t('navJobs')}</span>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
            </a>
            <a
              href="#events"
              className={styles.mobileNavLink}
              onClick={() => {
                closeMenu();
                if (onBackToHome) onBackToHome();
              }}
            >
              <span>{t('navEvents')}</span>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
            </a>
            <a
              href="#helpdesk"
              className={styles.mobileNavLink}
              onClick={() => {
                closeMenu();
                if (onBackToHome) onBackToHome();
              }}
            >
              <span>{t('navHelpdesk')}</span>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
            </a>
            <a
              href="#register"
              className={styles.mobileRegisterHighlight}
              onClick={handleRegisterClick}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>school</span>
                <span>{t('navGraduateRegister')}</span>
              </span>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
