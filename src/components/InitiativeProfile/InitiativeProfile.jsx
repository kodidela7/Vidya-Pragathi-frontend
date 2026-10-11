import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import styles from './InitiativeProfile.module.css';

export default function InitiativeProfile({ onOpenPledgeModal, onOpenRegister }) {
  const { lang, t } = useLanguage();

  return (
    <section className={styles.profileSection} id="candidate" aria-label="Candidate Profile and Manifesto">
      <div className="site-container">
        <div className={styles.manifestoCard}>
          <div className={styles.profileLayout}>
            {/* Left Column: Candidate Bio & Leadership */}
            <div className={styles.candidateCol}>
              <div className={styles.portraitWrapper}>
                <img
                  src="/images/new_Images/Candidate Profile Namaste1.png"
                  alt="K. M. Suresh MLC Candidate"
                  className={styles.candidateImg}
                  loading="lazy"
                />
                <div className={styles.badgeRibbon}>
                  {t('candidateBadge')}
                </div>
              </div>

              <div>
                <h3 className={styles.candidateTitle}>
                  {lang === 'kn' ? t('candidateNameKn') : t('candidateName')}
                </h3>
                <p className={styles.candidateSub}>
                  {t('candidateRole')}
                </p>
                <p className={styles.candidateDistrictsList}>
                  {t('bulletinDistricts')}
                </p>
              </div>

              {/* Leadership Ribbon Banner */}
              <div className={styles.leadershipMiniBanner}>
                <img
                  src="/images/new_Images/Leadership Mini Ribbon1.png"
                  alt="BJP Karnataka & National Leadership"
                  className={styles.miniBannerImg}
                />
              </div>

              {/* Pledge Vote Button */}
              <button
                className={styles.pledgeActionBtn}
                onClick={onOpenPledgeModal}
                type="button"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>how_to_vote</span>
                <span>{t('btnPledgeVote')}</span>
              </button>
            </div>

            {/* Right Column: 4-Pillar Constituency Charter */}
            <div className={styles.manifestoContentCol}>
              <div className={styles.manifestoTag}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#ea580c' }}>flag</span>
                <span>{t('manifestoTag')}</span>
              </div>

              <h2 className={styles.manifestoHeading}>
                {t('manifestoTitle')}
              </h2>

              <div className={styles.manifestoQuoteBox}>
                <p>{t('manifestoQuote')}</p>
              </div>

              {/* 4 Pillars Grid */}
              <div className={styles.pillarsGrid}>
                <div className={styles.pillarCard}>
                  <div className={styles.pillarHeader}>
                    <span className={`material-symbols-outlined ${styles.pillarIcon}`}>work</span>
                    <h4 className={styles.pillarTitle}>{t('pillar1Title')}</h4>
                  </div>
                  <p className={styles.pillarDesc}>{t('pillar1Desc')}</p>
                </div>

                <div className={`${styles.pillarCard} ${styles.pillarCardGreen}`}>
                  <div className={styles.pillarHeader}>
                    <span className={`material-symbols-outlined ${styles.pillarIcon} ${styles.pillarIconGreen}`}>school</span>
                    <h4 className={styles.pillarTitle}>{t('pillar2Title')}</h4>
                  </div>
                  <p className={styles.pillarDesc}>{t('pillar2Desc')}</p>
                </div>

                <div className={`${styles.pillarCard} ${styles.pillarCardAmber}`}>
                  <div className={styles.pillarHeader}>
                    <span className={`material-symbols-outlined ${styles.pillarIcon} ${styles.pillarIconAmber}`}>psychology</span>
                    <h4 className={styles.pillarTitle}>{t('pillar3Title')}</h4>
                  </div>
                  <p className={styles.pillarDesc}>{t('pillar3Desc')}</p>
                </div>

                <div className={styles.pillarCard}>
                  <div className={styles.pillarHeader}>
                    <span className={`material-symbols-outlined ${styles.pillarIcon}`}>support_agent</span>
                    <h4 className={styles.pillarTitle}>{t('pillar4Title')}</h4>
                  </div>
                  <p className={styles.pillarDesc}>{t('pillar4Desc')}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={styles.pillarActions}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onOpenRegister) onOpenRegister();
                  }}
                  className={styles.pledgeActionBtn}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>school</span>
                  <span>{t('ctaCareerIntakeHero')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
