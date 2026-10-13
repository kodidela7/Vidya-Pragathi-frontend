import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  skillsCategories,
  skillsTracks,
  skillsRoadmapSteps,
  skillsFaqs
} from '../../data/skillsData';
import styles from './SkillsPortal.module.css';

export default function SkillsPortal({ onBackToHome, onOpenRegister, onOpenJobs }) {
  const { lang, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Scroll to top on page mount
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const filteredTracks = activeCategory === 'all'
    ? skillsTracks
    : skillsTracks.filter((track) => track.category === activeCategory);

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
    <div className={styles.skillsContainer}>
      {/* Hero Section with Status Disclaimer */}
      <section className={styles.heroSection}>
        <div className={`site-container ${styles.heroContent}`}>
          <div className={styles.heroBadge}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>psychology</span>
            <span>{t('skillsPortalTag')}</span>
          </div>

          <h1 className={styles.heroTitle}>
            {lang === 'kn' ? (
              <>
                <span className={styles.heroHighlight}>ಎಐ & ಡಿಜಿಟಲ್ ಕೌಶಲ್ಯ</span> ಕಲಿಕಾ ಮಾರ್ಗಗಳು
              </>
            ) : (
              <>
                Future-Ready <span className={styles.heroHighlight}>AI & Digital Skills</span> Pathways
              </>
            )}
          </h1>

          <p className={styles.heroSubtitle}>
            {t('skillsPortalSubtitle')}
          </p>

          {/* Prominent Official Disclaimer Box */}
          <div className={styles.noticeBox} role="alert">
            <span className={`material-symbols-outlined ${styles.noticeIcon}`}>schedule</span>
            <div className={styles.noticeText}>
              <div className={styles.noticeTitle}>
                {t('skillsDisclaimerTitle')}
              </div>
              <p className={styles.noticeDesc}>
                {t('skillsDisclaimerDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Content: Category Filter & Track Cards */}
      <div className={`site-container ${styles.mainContent}`}>
        {/* Category Filter Chips */}
        <div className={styles.filterBar} role="tablist" aria-label="Filter skill tracks">
          {skillsCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const label = lang === 'kn' ? cat.labelKn : cat.labelEn;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`${styles.filterChip} ${isActive ? styles.filterChipActive : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  {cat.icon}
                </span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Tracks Grid */}
        <div className={styles.tracksGrid}>
          {filteredTracks.map((track) => {
            const title = lang === 'kn' ? track.titleKn : track.titleEn;
            const badge = lang === 'kn' ? track.badgeKn : track.badgeEn;
            const statusBadge = lang === 'kn' ? track.statusBadgeKn : track.statusBadgeEn;
            const desc = lang === 'kn' ? track.descriptionKn : track.descriptionEn;
            const audience = lang === 'kn' ? track.targetAudienceKn : track.targetAudienceEn;
            const districts = lang === 'kn' ? track.districtsKn : track.districtsEn;
            const plannedDuration = lang === 'kn' ? track.plannedDurationKn : track.plannedDurationEn;
            const fee = lang === 'kn' ? track.feeKn : track.feeEn;
            const topics = lang === 'kn' ? track.topicsKn : track.topics;

            return (
              <div key={track.id} className={styles.trackCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardBadgeRow}>
                    <span className={styles.trackAudienceBadge}>{badge}</span>
                    <span className={styles.statusAnnouncingBadge}>
                      <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>hourglass_top</span>
                      <span>{statusBadge}</span>
                    </span>
                  </div>
                  <h2 className={styles.cardTitle}>{title}</h2>
                </div>

                <div className={styles.cardBody}>
                  <p className={styles.cardDescription}>{desc}</p>

                  <div className={styles.metaList}>
                    <div className={styles.metaItem}>
                      <span className={`material-symbols-outlined ${styles.metaIcon}`}>school</span>
                      <div className={styles.metaText}>
                        <strong className={styles.metaLabel}>{t('skillsTargetAudience')}:</strong>
                        <span>{audience}</span>
                      </div>
                    </div>

                    <div className={styles.metaItem}>
                      <span className={`material-symbols-outlined ${styles.metaIcon}`}>location_on</span>
                      <div className={styles.metaText}>
                        <strong className={styles.metaLabel}>{t('skillsDistrictsCoverage')}:</strong>
                        <span>{districts}</span>
                      </div>
                    </div>

                    <div className={styles.metaItem}>
                      <span className={`material-symbols-outlined ${styles.metaIcon}`}>calendar_clock</span>
                      <div className={styles.metaText}>
                        <strong className={styles.metaLabel}>{t('skillsPlannedDuration')}:</strong>
                        <span className={styles.metaValHighlight}>{plannedDuration}</span>
                      </div>
                    </div>

                    <div className={styles.metaItem}>
                      <span className={`material-symbols-outlined ${styles.metaIcon}`}>verified</span>
                      <div className={styles.metaText}>
                        <strong className={styles.metaLabel}>{t('skillsProgramFee')}:</strong>
                        <span>{fee}</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.topicsSection}>
                    <div className={styles.topicsHeading}>{t('skillsCurriculumHighlights')}</div>
                    <div className={styles.topicsList}>
                      {topics.map((tp, idx) => (
                        <span key={idx} className={styles.topicTag}>{tp}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <button
                    type="button"
                    className={styles.registerInterestBtn}
                    onClick={handleRegisterClick}
                    aria-label={`Register interest for ${title}`}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>notifications_active</span>
                    <span>{t('skillsCardBtnRegisterInterest')}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. 3-Step Roadmap Section */}
        <section className={styles.roadmapSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTag}>{lang === 'kn' ? 'ಸ್ಪಷ್ಟ ಮಾರ್ಗಸೂಚಿ' : 'Transparent Roadmap'}</div>
            <h2 className={styles.sectionTitle}>{t('skillsRoadmapHeading')}</h2>
            <p className={styles.sectionSubtitle}>{t('skillsRoadmapSub')}</p>
          </div>

          <div className={styles.roadmapGrid}>
            {skillsRoadmapSteps.map((step, idx) => {
              const stepTitle = lang === 'kn' ? step.titleKn : step.titleEn;
              const stepDesc = lang === 'kn' ? step.descKn : step.descEn;
              return (
                <div key={idx} className={styles.roadmapCard}>
                  <div className={styles.stepNumber}>{step.stepNumber}</div>
                  <h3 className={styles.stepTitle}>{stepTitle}</h3>
                  <p className={styles.stepDesc}>{stepDesc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. Callout Banner: Register to be notified */}
        <div className={styles.ctaBanner}>
          <div className={styles.ctaBannerContent}>
            <h2 className={styles.ctaBannerTitle}>{t('skillsCtaBannerTitle')}</h2>
            <p className={styles.ctaBannerDesc}>{t('skillsCtaBannerDesc')}</p>
          </div>
          <button
            type="button"
            className={styles.ctaBannerBtn}
            onClick={handleRegisterClick}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>app_registration</span>
            <span>{t('heroRegisterBtnText')}</span>
          </button>
        </div>

        {/* 6. FAQ Accordion */}
        <section className={styles.faqSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTag}>{lang === 'kn' ? 'ಸ್ಪಷ್ಟ ಮಾಹಿತಿ' : 'Common Inquiries'}</div>
            <h2 className={styles.sectionTitle}>{t('skillsFaqHeading')}</h2>
          </div>

          <div className={styles.faqList}>
            {skillsFaqs.map((faq, idx) => {
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
