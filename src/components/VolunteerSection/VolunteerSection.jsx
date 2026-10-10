import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import styles from './VolunteerSection.module.css';

export default function VolunteerSection({ onOpenPledgeModal }) {
  const { t } = useLanguage();

  return (
    <section className={styles.volunteerSection} id="volunteer" aria-label="Campaign Support and Volunteer Section">
      <div className="site-container">
        <div className={styles.volunteerBannerCard}>
          {/* Left Call to Vote Column */}
          <div className={styles.contentCol}>
            <div className={styles.volunteerTag}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>group_add</span>
              <span>{t('volunteerTag')}</span>
            </div>

            <h2 className={styles.volunteerHeading}>
              {t('volunteerTitle')}
            </h2>

            <p className={styles.volunteerDesc}>
              {t('volunteerDesc')}
            </p>

            <div className={styles.actionsRow}>
              <button
                className={styles.votePledgeBtn}
                onClick={onOpenPledgeModal}
                type="button"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>how_to_vote</span>
                <span>{t('btnVolunteerPledge')}</span>
              </button>

              <button
                className={styles.volunteerJoinBtn}
                onClick={onOpenPledgeModal}
                type="button"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>person_add</span>
                <span>{t('btnVolunteerJoin')}</span>
              </button>
            </div>
          </div>

          {/* Right Campaign Poster */}
          <div className={styles.mediaCol}>
            <img
              src="/images/WhatsApp Image 2026-10-09 at 20.51.21.jpeg"
              alt="BJP Karnataka Election Campaign 2026 - K.M. Suresh"
              className={styles.posterImg}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
