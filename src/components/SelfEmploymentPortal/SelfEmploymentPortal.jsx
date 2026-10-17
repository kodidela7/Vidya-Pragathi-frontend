import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { selfEmploymentHero, selfEmploymentPillars } from '../../data/selfEmploymentData';
import styles from './SelfEmploymentPortal.module.css';

export default function SelfEmploymentPortal({ onOpenRegister }) {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('all');

  // Scroll to top on page mount
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const handleRegisterClick = (e) => {
    if (e) e.preventDefault();
    if (onOpenRegister) {
      onOpenRegister();
    }
  };

  const filteredPillars = activeTab === 'all'
    ? selfEmploymentPillars
    : selfEmploymentPillars.filter((p) => p.id === activeTab);

  return (
    <div className={styles.portalContainer}>
      {/* 1. Hero Section (No back button, full-width responsive site-container) */}
      <section className={styles.heroSection}>
        <div className={`site-container ${styles.heroContent}`}>
          <div className={styles.heroBadge}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>eco</span>
            <span>{lang === 'kn' ? selfEmploymentHero.badgeKn : selfEmploymentHero.badgeEn}</span>
          </div>

          <h1 className={styles.heroTitle}>
            {lang === 'kn' ? (
              <>
                {selfEmploymentHero.titleKnPrefix}{' '}
                <span className={styles.heroHighlight}>{selfEmploymentHero.titleKnHighlight}</span>
              </>
            ) : (
              <>
                {selfEmploymentHero.titleEnPrefix}{' '}
                <span className={styles.heroHighlight}>{selfEmploymentHero.titleEnHighlight}</span>
              </>
            )}
          </h1>

          <p className={styles.heroSubtitle}>
            {lang === 'kn' ? selfEmploymentHero.subtitleKn : selfEmploymentHero.subtitleEn}
          </p>

          {/* Registration Notice Box */}
          <div className={styles.heroCtaBox}>
            <div className={styles.heroCtaTextWrap}>
              <span className={`material-symbols-outlined ${styles.heroCtaIcon}`}>support_agent</span>
              <p className={styles.heroCtaMessage}>
                {lang === 'kn'
                  ? selfEmploymentHero.registrationCalloutKn
                  : selfEmploymentHero.registrationCalloutEn}
              </p>
            </div>
            <button
              type="button"
              className={styles.registerCtaBtn}
              onClick={handleRegisterClick}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>how_to_reg</span>
              <span>{lang === 'kn' ? 'ನೋಂದಣಿ ನಮೂನೆ ಭರ್ತಿ ಮಾಡಿ' : 'Fill Registration Form'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. CREATIVE INTERACTIVE SELECTOR DECK (4 Interactive Control Cards) */}
      <nav className={styles.selectorDeckWrapper} aria-label="Domain Selector">
        <div className={`site-container ${styles.deckGrid}`}>
          {/* Card 0: All Horizons */}
          <button
            type="button"
            className={`${styles.deckCard} ${activeTab === 'all' ? styles.deckCardActive : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <div className={`${styles.deckIconBox} ${styles.deckIconBox_all}`}>
              <span className="material-symbols-outlined">dashboard_customize</span>
            </div>
            <div className={styles.deckTextWrap}>
              <span className={styles.deckTitle}>{lang === 'kn' ? 'ಎಲ್ಲಾ ವಿಭಾಗಗಳು' : 'All Horizons'}</span>
              <span className={styles.deckSubtitle}>{lang === 'kn' ? 'ಸಮಗ್ರ ಮಾರ್ಗದರ್ಶನ' : 'Complete Roadmap'}</span>
            </div>
          </button>

          {/* Card 1, 2, 3: Individual Pillars */}
          {selfEmploymentPillars.map((pillar) => {
            const isActive = activeTab === pillar.id;
            const iconBoxClass = styles[`deckIconBox_${pillar.colorTheme}`] || styles.deckIconBox_blue;

            return (
              <button
                key={pillar.id}
                type="button"
                className={`${styles.deckCard} ${isActive ? styles.deckCardActive : ''}`}
                onClick={() => setActiveTab(pillar.id)}
              >
                <div className={`${styles.deckIconBox} ${iconBoxClass}`}>
                  <span className="material-symbols-outlined">{pillar.icon}</span>
                </div>
                <div className={styles.deckTextWrap}>
                  <span className={styles.deckTitle}>{lang === 'kn' ? pillar.titleKn : pillar.titleEn}</span>
                  <span className={styles.deckSubtitle}>
                    {lang === 'kn' ? pillar.shortSubtitleKn : pillar.shortSubtitleEn}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 3. Main Pillars Content (Expansive Full-Width Grid on Large Screens) */}
      <main className={`site-container ${styles.mainContent}`}>
        {filteredPillars.map((pillar) => {
          const iconBoxClass = styles[`pillarIconBox_${pillar.colorTheme}`] || styles.pillarIconBox_blue;

          return (
            <article key={pillar.id} className={styles.pillarCard} id={pillar.id}>
              {/* Desktop 2-Column Split Hero (Left: Text & Overview, Right: Concept Visual) */}
              <div className={styles.pillarHeroSplit}>
                {/* Left Column: Titles & Details */}
                <div className={styles.pillarTextCol}>
                  <div className={styles.pillarHeader}>
                    <div className={`${styles.pillarIconBox} ${iconBoxClass}`}>
                      <span className="material-symbols-outlined">{pillar.icon}</span>
                    </div>
                    <div className={styles.pillarTitleWrap}>
                      <h2 className={styles.pillarTitle}>
                        {lang === 'kn' ? pillar.titleKn : pillar.titleEn}
                      </h2>
                    </div>
                  </div>

                  {/* Tagline Banner from Docx */}
                  <div className={styles.taglineBanner}>
                    <p className={styles.taglineText}>
                      "{lang === 'kn' ? pillar.taglineKn : pillar.taglineEn}"
                    </p>
                  </div>

                  {/* Main Introductory Description */}
                  <p className={styles.pillarDescription}>
                    {lang === 'kn' ? pillar.descKn : pillar.descEn}
                  </p>

                  {/* In-Pillar Quick Registration Trigger */}
                  <div className={styles.pillarQuickActionRow}>
                    <button
                      type="button"
                      className={styles.pillarQuickActionBtn}
                      onClick={handleRegisterClick}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>how_to_reg</span>
                      <span>{lang === 'kn' ? 'ವೈಯಕ್ತಿಕ ಮಾರ್ಗದರ್ಶನಕ್ಕೆ ನೋಂದಾಯಿಸಿ' : 'Register for Mentorship'}</span>
                    </button>
                  </div>
                </div>

                {/* Right Column: Visual Concept Image & Editor Dimensions */}
                {pillar.image && (
                  <div className={styles.imageVisualBox}>
                    <img
                      src={pillar.image}
                      alt={lang === 'kn' ? pillar.titleKn : pillar.titleEn}
                      className={styles.pillarImage}
                      loading="lazy"
                    />
                    <div className={styles.imageMetaBar}>
                      <span className={styles.imageDimBadge}>
                        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>aspect_ratio</span>
                        <span>Dimensions: {pillar.imageMeta.recommendedWidth} × {pillar.imageMeta.recommendedHeight} ({pillar.imageMeta.aspectRatio})</span>
                      </span>
                      <span>Spec: {pillar.imageMeta.shortDescription}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Section: Full-Width 3-Column Highlights Grid */}
              <div className={styles.highlightsSection}>
                <h3 className={styles.highlightsHeading}>
                  <span className={`material-symbols-outlined ${styles.highlightsIcon}`}>verified</span>
                  <span>{lang === 'kn' ? pillar.highlightsLabelKn : pillar.highlightsLabelEn}</span>
                </h3>

                <div className={styles.featuresGrid}>
                  {pillar.items.map((item, idx) => (
                    <div key={idx} className={styles.featureCard}>
                      <div className={styles.featureHeader}>
                        <span className={`material-symbols-outlined ${styles.featureIcon}`}>{item.icon}</span>
                        <h4 className={styles.featureTitle}>
                          {lang === 'kn' ? item.titleKn : item.titleEn}
                        </h4>
                      </div>
                      <p className={styles.featureDesc}>
                        {lang === 'kn' ? item.descKn : item.descEn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* In-Card Guidance Support Callout */}
              <div className={styles.pillarFooterRegister}>
                <p className={styles.pillarFooterText}>
                  {lang === 'kn'
                    ? `ಈ ವಿಭಾಗದಲ್ಲಿ ಮಾರ್ಗದರ್ಶನ ಮತ್ತು ತಜ್ಞರ ನೆರವು ಪಡೆಯಲು ಬಯಸುವಿರಾ? ನಮ್ಮ ಸಂಪನ್ಮೂಲ ಕೋಶವನ್ನು ಸಂಪರ್ಕಿಸಿ.`
                    : `Interested in mentorship and guidance for this track? Register your interest with our resource desk.`}
                </p>
                <button
                  type="button"
                  className={styles.pillarRegisterBtn}
                  onClick={handleRegisterClick}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit_note</span>
                  <span>{lang === 'kn' ? 'ನೋಂದಣಿ ಮಾಡಿ / Register' : 'Register for Mentorship'}</span>
                </button>
              </div>
            </article>
          );
        })}

        {/* 4. Bottom Grand Call to Action (Full width across wide screen) */}
        <div className={styles.bottomGrandCta}>
          <h3 className={styles.grandCtaTitle}>
            {lang === 'kn' ? 'ಸ್ವಾವಲಂಬನೆ & ಉದ್ಯಮ ಬೆಂಬಲ ಕೋಶ' : 'Enterprise & Self-Reliance Support Desk'}
          </h3>
          <p className={styles.grandCtaSubtitle}>
            {lang === 'kn'
              ? 'ಆಗ್ನೇಯ ಪದವೀಧರ ಕ್ಷೇತ್ರದ ವ್ಯಾಪ್ತಿಯ ತುಮಕೂರು, ಕೋಲಾರ, ಚಿಕ್ಕಬಳ್ಳಾಪುರ, ಚಿತ್ರದುರ್ಗ ಹಾಗೂ ದಾವಣಗೆರೆ ಜಿಲ್ಲೆಗಳ ಪದವೀಧರರಿಗೆ ಸ್ವಯಂ ಉದ್ಯೋಗ, ಸ್ಟಾರ್ಟಪ್ ಮತ್ತು ಆಧುನಿಕ ಕೃಷಿ ಕುರಿತು ತಜ್ಞರ ವೈಯಕ್ತಿಕ ಮಾರ್ಗದರ್ಶನವನ್ನು ನಾವು ಒದಗಿಸುತ್ತೇವೆ. ಬೆಂಬಲ ಪಡೆಯಲು ಇಂದೇ ನೋಂದಣಿ ನಮೂನೆ ಭರ್ತಿ ಮಾಡಿ.'
              : 'We provide dedicated individual mentorship, guidance, and institutional connections across Tumakuru, Kolar, Chikkaballapur, Chitradurga, and Davanagere districts. Fill out the registration form today to access support.'}
          </p>
          <button
            type="button"
            className={styles.grandRegisterBtn}
            onClick={handleRegisterClick}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>school</span>
            <span>{lang === 'kn' ? 'ಪದವೀಧರರ ನೋಂದಣಿ ನಮೂನೆ ಭರ್ತಿ ಮಾಡಿ' : 'Fill Graduate Registration Form'}</span>
          </button>
        </div>
      </main>
    </div>
  );
}
