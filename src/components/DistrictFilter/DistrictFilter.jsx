import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { districtsData } from '../../data/districtsData';
import styles from './DistrictFilter.module.css';

export default function DistrictFilter({ activeDistrict, onSelectDistrict }) {
  const { lang, t } = useLanguage();

  return (
    <section className={styles.filterSection} aria-label="District Filter">
      <div className="site-container">
        {/* District Selector Box */}
        <div className={styles.districtBox}>
          <div className={styles.districtHeader}>
            <div className={styles.districtTitleRow}>
              <span className={`material-symbols-outlined ${styles.titleIcon}`}>location_on</span>
              <span className={styles.districtTitle}>{t('districtFilterTitle')}</span>
              <span className={styles.districtSubtext}>{t('districtFilterSubtitle')}</span>
            </div>
            <span className={styles.constituencyScopeBadge}>
              5 Districts • 31 Taluks • 185 Hoblis
            </span>
          </div>

          {/* District Buttons Grid */}
          <div className={styles.districtGrid}>
            {districtsData.map(dist => {
              const isActive = activeDistrict === dist.id;
              return (
                <button
                  key={dist.id}
                  className={`${styles.districtBtn} ${isActive ? styles.districtBtnActive : ''}`}
                  onClick={() => onSelectDistrict(dist.id)}
                  type="button"
                >
                  <span className={styles.districtNameEn}>{dist.nameEn}</span>
                  <span className={styles.districtNameKn}>{dist.nameKn}</span>
                  <span className={styles.districtSubTag}>
                    {dist.id === 'all' ? 'Constituency-Wide' : dist.tag.split('&')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 Verified Metric / Feature Cards */}
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>work</span>
            </div>
            <div className={styles.metricInfo}>
              <span className={styles.metricTitle}>{t('metricJobsTitle')}</span>
              <span className={styles.metricSub}>{t('metricJobsSub')}</span>
              <span className={styles.metricDesc}>ಖಾಸಗಿ & ಸರ್ಕಾರಿ ನೇಮಕಾತಿ</span>
            </div>
          </div>

          <div className={`${styles.metricCard} ${styles.metricCardAmber}`}>
            <div className={`${styles.metricIcon} ${styles.metricIconAmber}`}>
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>psychology</span>
            </div>
            <div className={styles.metricInfo}>
              <span className={styles.metricTitle}>{t('metricSkillsTitle')}</span>
              <span className={`${styles.metricSub} ${styles.metricSubAmber}`}>{t('metricSkillsSub')}</span>
              <span className={styles.metricDesc}>ಉಚಿತ ಪ್ರಮಾಣಪತ್ರ ಶಿಕ್ಷಣ</span>
            </div>
          </div>

          <div className={`${styles.metricCard} ${styles.metricCardGreen}`}>
            <div className={`${styles.metricIcon} ${styles.metricIconGreen}`}>
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>currency_rupee</span>
            </div>
            <div className={styles.metricInfo}>
              <span className={styles.metricTitle}>{t('metricGrantsTitle')}</span>
              <span className={`${styles.metricSub} ${styles.metricSubGreen}`}>{t('metricGrantsSub')}</span>
              <span className={styles.metricDesc}>ನೇರ ಡಿಬಿಟಿ ವಿದ್ಯಾರ್ಥಿವೇತನ</span>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>support_agent</span>
            </div>
            <div className={styles.metricInfo}>
              <span className={styles.metricTitle}>{t('metricHelpdeskTitle')}</span>
              <span className={styles.metricSub}>{t('metricHelpdeskSub')}</span>
              <span className={styles.metricDesc}>ಪದವೀಧರ ಪರಿಹಾರ ಕೋಶ</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
