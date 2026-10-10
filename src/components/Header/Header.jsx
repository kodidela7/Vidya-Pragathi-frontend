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
            <span className={styles.bulletinBadge}>
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>how_to_vote</span>
              {t('bulletinTag')}
            </span>
            <span className={styles.bulletinDistricts}>
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

            {/* Quick Admin Portal Access */}
            <button
              type="button"
              className={styles.adminAccessBtn}
              onClick={onOpenAdmin}
              title="Admin Login & Operations"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>lock</span>
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Navigation Bar */}
      <div className={styles.mainNavbar}>
        <div className={`site-container ${styles.navbarInner}`}>
          {/* Logo & Brand Identity */}
          <a href="#" className={styles.brand} onClick={handleBrandClick}>
            <div className={styles.brandIcon}>
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>spa</span>
            </div>
            <div className={styles.brandText}>
              <div className={styles.brandTitleRow}>
                <span className={styles.brandName}>{t('brandTitle')}</span>
                <span className={styles.brandBadge}>BJP South-East</span>
              </div>
              <span className={styles.brandSubtitle}>
                {t('brandSubtitle')}
              </span>
            </div>
          </a>

          {/* Clean Navigation Links on Desktop (Buttons removed per user request) */}
          <nav className={styles.navLinks} aria-label="Main Navigation">
            <a href="#jobs" className={styles.navLink} onClick={(e) => { if (onOpenJobs) { e.preventDefault(); onOpenJobs(); } }}>{t('navOpportunities')}</a>
            <a href="#matrix" className={styles.navLink}>{t('navSkills')}</a>
            <a href="#events" className={styles.navLink}>{t('navEvents')}</a>
            <a href="#candidate" className={styles.navLink}>{t('navCandidate')}</a>
            <a href="#register" className={styles.navLink} onClick={handleRegisterClick}>{t('navRegister')}</a>
            <a href="#helpdesk" className={styles.navLink}>{t('navHelpdesk')}</a>
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
            <a href="#jobs" className={styles.mobileNavLink} onClick={() => { closeMenu(); if (onOpenJobs) onOpenJobs(); }}>
              <span>{t('navOpportunities')}</span>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
            </a>
            <a href="#matrix" className={styles.mobileNavLink} onClick={closeMenu}>
              <span>{t('navSkills')}</span>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
            </a>
            <a href="#events" className={styles.mobileNavLink} onClick={closeMenu}>
              <span>{t('navEvents')}</span>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
            </a>
            <a href="#candidate" className={styles.mobileNavLink} onClick={closeMenu}>
              <span>{t('navCandidate')}</span>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
            </a>
            <a href="#register" className={styles.mobileNavLink} onClick={handleRegisterClick}>
              <span>{t('navRegister')}</span>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
            </a>
            <a href="#helpdesk" className={styles.mobileNavLink} onClick={closeMenu}>
              <span>{t('navHelpdesk')}</span>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
            </a>
            <button
              type="button"
              className={styles.mobileNavLink}
              style={{ background: '#f8fafc', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left', color: '#c2410c', fontWeight: 700 }}
              onClick={() => { closeMenu(); onOpenAdmin && onOpenAdmin(); }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>lock</span>
                <span>Admin Login Portal</span>
              </span>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
