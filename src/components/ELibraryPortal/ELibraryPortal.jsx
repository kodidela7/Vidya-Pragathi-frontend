import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  competitiveExamsCovered,
  elibraryFacilities,
  constituencyStudyDistricts,
  elibraryFaqs
} from '../../data/elibraryData';
import styles from './ELibraryPortal.module.css';

export default function ELibraryPortal({ onOpenRegister, onOpenJobs }) {
  const { lang, t } = useLanguage();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Scroll to top on page mount
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const toggleFaq = (index) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const handleRegisterClick = (e) => {
    if (e) e.preventDefault();
    if (onOpenRegister) {
      onOpenRegister();
    }
  };

  return (
    <div className={styles.libraryContainer}>
      {/* 1. Hero Section */}
      <section className={styles.heroSection}>
        <div className={`site-container ${styles.heroContent}`}>
          <div className={styles.heroBadge}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>local_library</span>
            <span>{t('libraryPortalTag')}</span>
          </div>

          <h1 className={styles.heroTitle}>
            {t('libraryPortalTitlePrefix')}{' '}
            <span className={styles.heroHighlight}>
              {t('libraryPortalTitleHighlight')}
            </span>
          </h1>

          <p className={styles.heroSubtitle}>
            {t('libraryPortalSubtitle')}
          </p>

          {/* Supported Examinations Quick Badges */}
          <div className={styles.examsRow}>
            {competitiveExamsCovered.map((exam) => {
              const examName = lang === 'kn' ? exam.nameKn : exam.nameEn;
              return (
                <div key={exam.code} className={styles.examBadge}>
                  <span className={`material-symbols-outlined ${styles.examBadgeIcon}`}>
                    {exam.icon}
                  </span>
                  <span>{examName}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Main Content Area */}
      <div className={`site-container ${styles.mainContent}`}>
        {/* Objective Box Sourced from E Libary.docx */}
        <div className={styles.objectiveCard}>
          <div className={styles.objectiveTop}>
            <span className={styles.objectiveTag}>{t('libraryObjectiveBadge')}</span>
            <h2 className={styles.objectiveTitle}>{t('libraryObjectiveTitle')}</h2>
          </div>
          <p className={styles.objectiveDesc}>
            {t('libraryObjectiveDesc')}
          </p>
        </div>

        {/* 3. 6 Key Facilities Section */}
        <section className={styles.facilitiesSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>
              {lang === 'kn' ? 'ಸಂಪನ್ಮೂಲಗಳು & ಸೌಲಭ್ಯಗಳು' : 'Comprehensive Infrastructure'}
            </span>
            <h2 className={styles.sectionTitle}>{t('libraryFacilitiesHeading')}</h2>
            <p className={styles.sectionSubtitle}>{t('libraryFacilitiesSub')}</p>
          </div>

          <div className={styles.facilitiesGrid}>
            {elibraryFacilities.map((fac) => {
              const title = lang === 'kn' ? fac.titleKn : fac.titleEn;
              const badge = lang === 'kn' ? fac.badgeKn : fac.badgeEn;
              const desc = lang === 'kn' ? fac.descKn : fac.descEn;
              const features = lang === 'kn' ? fac.featuresKn : fac.featuresEn;

              return (
                <div key={fac.id} className={styles.facilityCard}>
                  <div className={styles.facilityCardHeader}>
                    <div className={styles.facilityIconWrapper}>
                      <span className="material-symbols-outlined">{fac.icon}</span>
                    </div>
                    <div className={styles.facilityHeaderMeta}>
                      <span className={styles.facilityBadge}>{badge}</span>
                      <h3 className={styles.facilityTitle}>{title}</h3>
                    </div>
                  </div>

                  <div className={styles.facilityCardBody}>
                    <p className={styles.facilityDescription}>{desc}</p>

                    <div className={styles.featuresSection}>
                      <ul className={styles.featuresList}>
                        {features.map((feat, idx) => (
                          <li key={idx} className={styles.featureItem}>
                            <span className={`material-symbols-outlined ${styles.checkIcon}`}>check_circle</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. "A Word to Aspirants" (ಆಕಾಂಕ್ಷಿಗಳಿಗೆ ಕಿವಿಮಾತು) Spotlight Banner */}
        <div className={styles.aspirantsBanner}>
          <div className={styles.aspirantsBannerInner}>
            <div className={styles.aspirantsTextCol}>
              <div className={styles.aspirantsTag}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>tips_and_updates</span>
                <span>{t('libraryAspirantWordTag')}</span>
              </div>
              <h2 className={styles.aspirantsTitle}>{t('libraryAspirantWordTitle')}</h2>
              <blockquote className={styles.aspirantsQuote}>
                {t('libraryAspirantWordDesc')}
              </blockquote>
            </div>

            <button
              type="button"
              className={styles.aspirantsBtn}
              onClick={handleRegisterClick}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>app_registration</span>
              <span>{t('libraryBtnRegisterInterest')}</span>
            </button>
          </div>
        </div>

        {/* 5. 5 Constituency District Hubs */}
        <section className={styles.districtsSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>
              {lang === 'kn' ? 'ಜಿಲ್ಲಾ ಕೇಂದ್ರಗಳು' : 'Constituency Study Centers'}
            </span>
            <h2 className={styles.sectionTitle}>{t('libraryDistrictsHeading')}</h2>
            <p className={styles.sectionSubtitle}>{t('libraryDistrictsSub')}</p>
          </div>

          <div className={styles.districtsGrid}>
            {constituencyStudyDistricts.map((dst, idx) => {
              const districtName = lang === 'kn' ? dst.districtKn : dst.districtEn;
              const location = lang === 'kn' ? dst.locationKn : dst.locationEn;
              const features = lang === 'kn' ? dst.featuresKn : dst.featuresEn;

              return (
                <div key={idx} className={styles.districtCard}>
                  <div className={styles.districtHeader}>
                    <h3 className={styles.districtName}>
                      <span className="material-symbols-outlined" style={{ color: '#ea580c', fontSize: '20px' }}>location_on</span>
                      <span>{districtName}</span>
                    </h3>
                    <span className={styles.districtBadge}>
                      {lang === 'kn' ? 'ಜಿಲ್ಲಾ ಕೇಂದ್ರ' : 'District Hub'}
                    </span>
                  </div>

                  <div className={styles.districtLocation}>
                    <span className="material-symbols-outlined">pin_drop</span>
                    <span>{location}</span>
                  </div>

                  <div className={styles.districtFeatures}>
                    {features}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. FAQ Accordion */}
        <section className={styles.faqSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>
              {lang === 'kn' ? 'ಸ್ಪಷ್ಟ ಮಾಹಿತಿ' : 'Common Questions'}
            </span>
            <h2 className={styles.sectionTitle}>{t('libraryFaqHeading')}</h2>
          </div>

          <div className={styles.faqList}>
            {elibraryFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              const question = lang === 'kn' ? faq.qKn : faq.qEn;
              const answer = lang === 'kn' ? faq.aKn : faq.aEn;

              return (
                <div
                  key={idx}
                  className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ''}`}
                >
                  <button
                    type="button"
                    className={styles.faqQuestion}
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                  >
                    <span>{question}</span>
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                      {isOpen ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className={styles.faqAnswer}>
                      <p style={{ margin: 0 }}>{answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
