import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { eventsData } from '../../data/eventsData';
import styles from './EventsSection.module.css';

export default function EventsSection({ onSelectEvent }) {
  const { lang, t } = useLanguage();

  const featuredMela = {
    title: t('eventBannerTitle'),
    venue: t('eventBannerVenue')
  };

  return (
    <section className={styles.eventsSection} id="events" aria-label="Constituency Events Calendar">
      <div className="site-container">
        {/* Events Header */}
        <div className={styles.eventsHeader}>
          <div className={styles.headerText}>
            <div className={styles.tagsRow}>
              <span className={styles.eventsTag}>{t('eventsTag')}</span>
              <span className={styles.eventsSubTag}>{t('eventsSubTag')}</span>
            </div>
            <h2 className={styles.eventsHeading}>
              {t('eventsTitle')}
            </h2>
            <p className={styles.eventsDesc}>
              {t('eventsDesc')}
            </p>
          </div>
        </div>

        {/* Featured Job Mela Hero Banner */}
        <div className={styles.featuredMelaCard}>
          <img
            src="/images/candidate-graduates-meet.jpeg"
            alt="South-East Karnataka Mega Campus Job Mela"
            className={styles.melaBgImg}
            loading="lazy"
          />
          <div className={styles.melaOverlay}>
            <span className={styles.melaTagBadge}>
              {t('eventBannerTag')}
            </span>
            <h3 className={styles.melaTitle}>
              {t('eventBannerTitle')}
            </h3>
            <p className={styles.melaDesc}>
              {t('eventBannerDesc')}
            </p>
            <div className={styles.melaFooterRow}>
              <button
                className={styles.melaRegisterBtn}
                onClick={() => onSelectEvent(featuredMela)}
                type="button"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>confirmation_number</span>
                <span>{t('btnRegisterPass')}</span>
              </button>
              <span className={styles.melaVenue}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>location_on</span>
                {t('eventBannerVenue')}
              </span>
            </div>
          </div>
        </div>

        {/* 3 Scheduled District Event Cards */}
        <div className={styles.eventsGrid}>
          {eventsData.map(ev => (
            <div key={ev.id} className={styles.eventCard}>
              <div className={styles.eventCardTop}>
                <div className={styles.eventHeaderMeta}>
                  <span className={styles.districtPill}>
                    {lang === 'kn' ? ev.districtKn : ev.districtEn}
                  </span>
                  <span className={styles.daysLeftBadge}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>timer</span>
                    {lang === 'kn' ? ev.daysLeftKn : ev.daysLeftEn}
                  </span>
                </div>

                <div className={styles.dateRow}>
                  <span className={styles.dateBig}>{ev.dateEn.split(',')[0]}</span>
                  <span className={styles.timeMuted}>2026 • {ev.timeEn}</span>
                </div>

                <h4 className={styles.eventCardTitle}>
                  {lang === 'kn' ? ev.titleKn : ev.titleEn}
                </h4>

                <p className={styles.eventCardDesc}>
                  <strong>{lang === 'kn' ? ev.venueKn : ev.venueEn}</strong> — {lang === 'kn' ? ev.descriptionKn : ev.descriptionEn}
                </p>

                <div className={styles.eventSpecsBox}>
                  <div>
                    <span className={styles.specLabel}>Eligibility</span>
                    <span className={styles.specValue}>{lang === 'kn' ? ev.eligibilityKn : ev.eligibilityEn}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={styles.specLabel}>Entry Pass</span>
                    <span className={styles.specValueGreen}>{lang === 'kn' ? ev.entryKn : ev.entryEn}</span>
                  </div>
                </div>
              </div>

              <button
                className={styles.passBtn}
                onClick={() => onSelectEvent({ title: lang === 'kn' ? ev.titleKn : ev.titleEn, venue: lang === 'kn' ? ev.venueKn : ev.venueEn })}
                type="button"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>confirmation_number</span>
                <span>{t('btnRegisterPass')}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
