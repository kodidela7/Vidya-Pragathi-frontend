import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import styles from './LeadershipBanner.module.css';

export default function LeadershipBanner({ onOpenPledgeModal, onOpenRegister }) {
  const { t } = useLanguage();

  return (
    <div className={styles.bannerWrapper}>
      <div className="site-container">
        <div className={styles.bannerCard}>
          {/* Left Text & Mission */}
          <div className={styles.bannerContent}>
            <div className={styles.bannerTag}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#ea580c' }}>flag</span>
              <span>{t('leadershipTag')}</span>
            </div>

            <h2 className={styles.bannerTitle}>
              {t('leadershipTitle')}
            </h2>

            <p className={styles.bannerDesc}>
              {t('leadershipDesc')}
            </p>

            <div className={styles.bannerActions}>
              <button
                className={styles.pledgeActionBtn}
                onClick={onOpenPledgeModal}
                type="button"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>thumb_up</span>
                <span>{t('leadershipCtaPledge')}</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  if (onOpenRegister) onOpenRegister();
                }}
                className={styles.registerActionBtn}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#ea580c' }}>how_to_reg</span>
                <span>{t('leadershipCtaRegister')}</span>
              </button>
            </div>
          </div>

          {/* Right Campaign Poster Image */}
          <div className={styles.bannerMedia}>
            <img
              src="/images/WhatsApp Image 2026-10-09 at 20.51.26.jpeg"
              alt="Prime Minister Narendra Modi and BJP Karnataka Leadership endorsing K.M. Suresh for 2026 MLC"
              className={styles.bannerImg}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
