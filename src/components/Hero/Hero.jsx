import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Hero.module.css';

export default function Hero({ onOpenPledgeModal }) {
  const { lang, t } = useLanguage();

  return (
    <section className={styles.heroWrapper} aria-label="Hero Spotlight">
      <div className={styles.glowBlob1}></div>
      <div className={styles.glowBlob2}></div>

      <div className="site-container">
        {/* Hero 2-Column Grid */}
        <div className={styles.heroGrid}>
          {/* Left Column: Headlines, Vision, Action & Coverage */}
          <div className={styles.heroContent}>
            <div className={styles.heroMainText}>
              <h1 className={styles.heroHeading}>
                {t('heroTitlePrefix')}{' '}
                <span className={styles.headingGradient}>
                  {t('heroTitleHighlight')}
                </span>{' '}
                {t('heroTitleSuffix')}
              </h1>

              {/* Mission Statement Quote */}
              <div className={styles.quoteCard}>
                <p className={styles.kannadaQuote}>
                  {t('heroQuote')}
                </p>
                <p className={styles.heroDesc}>
                  {t('heroDescription')}
                </p>
              </div>
            </div>

            {/* 4 Empowerment Pillars (Fills & balances large screens gracefully) */}
            <div className={styles.heroPillarsGrid}>
              <div className={styles.pillarCard}>
                <div className={styles.pillarIconBoxOrange}>
                  <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>work</span>
                </div>
                <div className={styles.pillarContent}>
                  <span className={styles.pillarTitle}>{t('pillar1Title')}</span>
                  <span className={styles.pillarDesc}>{t('pillar1Desc')}</span>
                </div>
              </div>

              <div className={styles.pillarCard}>
                <div className={styles.pillarIconBoxBlue}>
                  <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>psychology</span>
                </div>
                <div className={styles.pillarContent}>
                  <span className={styles.pillarTitle}>{t('pillar2Title')}</span>
                  <span className={styles.pillarDesc}>{t('pillar2Desc')}</span>
                </div>
              </div>

              <div className={styles.pillarCard}>
                <div className={styles.pillarIconBoxGreen}>
                  <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>school</span>
                </div>
                <div className={styles.pillarContent}>
                  <span className={styles.pillarTitle}>{t('pillar3Title')}</span>
                  <span className={styles.pillarDesc}>{t('pillar3Desc')}</span>
                </div>
              </div>

              <div className={styles.pillarCard}>
                <div className={styles.pillarIconBoxAmber}>
                  <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>support_agent</span>
                </div>
                <div className={styles.pillarContent}>
                  <span className={styles.pillarTitle}>{t('pillar4Title')}</span>
                  <span className={styles.pillarDesc}>{t('pillar4Desc')}</span>
                </div>
              </div>
            </div>

            {/* Constituency Coverage & Trust Strip removed per user request */}
          </div>

          {/* Right Column: High-Impact Voter Attraction Card */}
          <div className={styles.candidateHeroCard}>
            {/* 1. Full-Width Leadership & Official BJP Lotus Campaign Header */}
            <div className={styles.cardTopLeadershipBanner}>
              <img
                src="/images/candidate-poster-banner.jpeg"
                alt="BJP Leadership Team & Official Lotus Symbol - MLC 2026"
                className={styles.leadershipBannerImg}
                loading="eager"
              />
            </div>

            {/* 2. Candidate Showcase & Details Frame (Balanced layout without empty space) */}
            <div className={styles.candidateShowcaseFrame}>
              <div className={styles.candidatePortraitWrap}>
                <img
                  src="/images/candidate-portrait.jpeg"
                  alt="K. M. Suresh BJP MLC Candidate"
                  className={styles.candidatePortraitImg}
                  loading="eager"
                />
                <div className={styles.candidatePhotoBadge}>
                  <span className={styles.officialNdaPill}>BJP / NDA</span>
                  <span className={styles.electionYearPill}>MLC 2026</span>
                </div>
              </div>

              {/* Candidate Identity, Slogans & Voter Appeal Column */}
              <div className={styles.candidateDetailsCol}>
                <div className={styles.appealCalloutBar}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#ea580c' }}>how_to_vote</span>
                  <span className={styles.appealCalloutText}>
                    {lang === 'kn' ? 'ಬಿಜೆಪಿಗೆ ನಿಮ್ಮ ಮತ ಬೆಂಬಲ ನೀಡಿ!' : 'Pledge Your Vote for BJP!'}
                  </span>
                </div>

                <div className={styles.candidateBioBox}>
                  <span className={styles.constituencyTitleTag}>
                    {lang === 'kn' ? 'ಆಗ್ನೇಯ ಪದವೀಧರರ ಕ್ಷೇತ್ರ' : "South-East Graduates' Constituency"}
                  </span>
                  <h2 className={styles.candidateNameHeading}>
                    {lang === 'kn' ? t('candidateNameKn') : t('candidateName')}
                  </h2>
                  <p className={styles.candidateRolePill}>
                    {lang === 'kn' ? 'ಶಿಕ್ಷಣ ತಜ್ಞರು & ಅಧಿಕೃತ ಎನ್‌ಡಿಎ ಅಭ್ಯರ್ಥಿ' : 'Educationist & Official BJP/NDA Candidate'}
                  </p>
                </div>

                <div className={styles.sloganQuoteStrip}>
                  <span className={styles.sloganKannada}>
                    "ಪ್ರಬುದ್ಧ ಪದವೀಧರ — ಬಲಿಷ್ಠ ಕರ್ನಾಟಕ!"
                  </span>
                  <span className={styles.sloganEnglish}>
                    "ಶಿಕ್ಷಣ ಕ್ಷೇತ್ರದ ಅನುಭವದ ನಡಿಗೆ"
                  </span>
                </div>
              </div>
            </div>

            {/* Impact Highlights (District-free, focused on Karnataka youth) */}
            <div className={styles.highlightsGrid}>
              <div className={styles.highlightCellGreen}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#16a34a' }}>school</span>
                <div>
                  <span className={styles.cellTitle} style={{ color: '#16a34a' }}>100% Free</span>
                  <span className={styles.cellSub}>{t('candidateCoaching')}</span>
                </div>
              </div>

              <div className={styles.highlightCellOrange}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#ea580c' }}>groups</span>
                <div>
                  <span className={styles.cellTitle} style={{ color: '#c2410c' }}>Karnataka</span>
                  <span className={styles.cellSub}>{t('candidateDistrictHubs')}</span>
                </div>
              </div>
            </div>

            {/* High-Converting Vote Pledge CTA Button */}
            <button
              className={styles.cardVotePledgeBtn}
              onClick={onOpenPledgeModal}
              type="button"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>how_to_vote</span>
              <span>{t('ctaPledgeHero')}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
