import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { opportunitiesData } from '../../data/opportunitiesData';
import styles from './OpportunityMatrix.module.css';

export default function OpportunityMatrix({ activeDistrict = 'all', onOpenJobs, onOpenSkills, onOpenLibrary }) {
  const { lang, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Live state from API (Default 4 on homepage)
  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isUsingLiveApi, setIsUsingLiveApi] = useState(false);

  // Debounce search input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch opportunities from backend API (Default 4 items on homepage)
  useEffect(() => {
    let isCancelled = false;

    const fetchJobs = async () => {
      try {
        setIsLoading(true);

        // Limit to 4 items on homepage
        let url = `/api/jobs?page=1&limit=4`;

        if (debouncedSearch.trim()) {
          url += `&search=${encodeURIComponent(debouncedSearch.trim())}`;
        }

        if (activeDistrict && activeDistrict !== 'all') {
          url += `&district=${encodeURIComponent(activeDistrict)}`;
        }

        if (activeCategory && activeCategory !== 'all') {
          let catQuery = activeCategory;
          if (activeCategory === 'jobs') catQuery = 'Engineering & Tech';
          else if (activeCategory === 'exams') catQuery = 'Government / KPSC Exams';
          else if (activeCategory === 'ai') catQuery = 'Emerging AI & Digital Skills';
          else if (activeCategory === 'grants') catQuery = 'Commerce & Banking';
          url += `&category=${encodeURIComponent(catQuery)}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        if (!isCancelled && res.ok && data.success) {
          setJobs(data.data || []);
          setTotalJobs(data.total || 0);
          setIsUsingLiveApi(true);
        } else if (!isCancelled) {
          fallbackToStatic();
        }
      } catch (err) {
        console.warn('Live opportunities API fallback:', err);
        if (!isCancelled) {
          fallbackToStatic();
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    const fallbackToStatic = () => {
      setIsUsingLiveApi(false);
      const filtered = opportunitiesData.filter(opp => {
        const matchesCategory = activeCategory === 'all' || opp.category === activeCategory;
        const matchesDistrict = activeDistrict === 'all' || opp.districtIds.includes(activeDistrict);
        const matchesSearch = !debouncedSearch.trim() || 
          opp.titleEn.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          opp.descriptionEn.toLowerCase().includes(debouncedSearch.toLowerCase());
        return matchesCategory && matchesDistrict && matchesSearch;
      });

      setTotalJobs(filtered.length);
      setJobs(filtered.slice(0, 4));
    };

    fetchJobs();

    return () => {
      isCancelled = true;
    };
  }, [debouncedSearch, activeDistrict, activeCategory]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      const el = document.getElementById('opportunities');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getPillStyle = (cat) => {
    const c = (cat || '').toLowerCase();
    if (c.includes('engineer') || c.includes('tech') || c === 'jobs') return styles.categoryPillJob;
    if (c.includes('exam') || c.includes('kpsc') || c === 'exams') return styles.categoryPillExam;
    if (c.includes('ai') || c.includes('digital') || c === 'ai') return styles.categoryPillAI;
    if (c.includes('commerce') || c.includes('bank') || c === 'grants') return styles.categoryPillGrant;
    return styles.categoryPillJob;
  };

  const getCategoryIcon = (cat) => {
    const c = (cat || '').toLowerCase();
    if (c.includes('engineer') || c.includes('tech') || c === 'jobs') return 'precision_manufacturing';
    if (c.includes('exam') || c.includes('kpsc') || c === 'exams') return 'menu_book';
    if (c.includes('ai') || c.includes('digital') || c === 'ai') return 'smart_toy';
    if (c.includes('commerce') || c.includes('bank') || c === 'grants') return 'payments';
    return 'work';
  };

  return (
    <section className={styles.matrixSection} id="opportunities" aria-label="Curated Opportunities">
      <div className="site-container">
        {/* Matrix Header */}
        <div className={styles.matrixHeader}>
          <div className={styles.headerText}>
            <div className={styles.tagsRow}>
              <span className={styles.matrixTag}>{t('matrixTag')}</span>
              <span className={styles.matrixSubTag}>{t('matrixSubTag')}</span>
            </div>
            <h2 className={styles.matrixHeading}>
              {t('matrixTitle')}
            </h2>
            <p className={styles.matrixDesc}>
              {t('matrixDesc')}
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className={styles.categoryTabs}>
            <button
              className={`${styles.tabBtn} ${activeCategory === 'all' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveCategory('all')}
              type="button"
            >
              {t('matrixFilterAll')}
            </button>
            <button
              className={`${styles.tabBtn} ${activeCategory === 'jobs' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveCategory('jobs')}
              type="button"
            >
              {t('matrixFilterJobs')}
            </button>
            <button
              className={`${styles.tabBtn} ${activeCategory === 'exams' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveCategory('exams')}
              type="button"
            >
              {t('matrixFilterExams')}
            </button>
            <button
              className={`${styles.tabBtn} ${activeCategory === 'ai' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveCategory('ai')}
              type="button"
            >
              {t('matrixFilterAI')}
            </button>
            <button
              className={`${styles.tabBtn} ${activeCategory === 'grants' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveCategory('grants')}
              type="button"
            >
              {t('matrixFilterGrants')}
            </button>
          </div>
        </div>

        {/* Live Search & Meta Toolbar */}
        <div className={styles.searchToolbar}>
          <div className={styles.searchBox}>
            <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search by job title, company, skills, or degree eligibility..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search opportunities"
            />
            {searchTerm && (
              <button
                type="button"
                className={styles.clearSearchBtn}
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
              </button>
            )}
          </div>

          <div className={styles.resultsMeta}>
            <span className={styles.liveDot}></span>
            <span>
              {isLoading
                ? 'Searching opportunities...'
                : `Displaying 4 Featured Opportunities (${totalJobs} Total Available)`}
            </span>
          </div>
        </div>

        {/* Opportunity Cards List (4 cards on homepage) */}
        {jobs.length > 0 ? (
          <div className={styles.cardsGrid}>
            {jobs.map((item) => {
              // Normalize fields whether from live MySQL API or local fixture
              const isLive = !!item.company;
              const title = isLive ? item.title : (lang === 'kn' ? item.titleKn : item.titleEn);
              const companyOrSub = isLive ? item.company : (lang === 'kn' ? item.titleEn : item.titleKn);
              const description = isLive ? item.description : (lang === 'kn' ? item.descriptionKn : item.descriptionEn);
              const category = isLive ? item.category : item.category;
              const districtLabel = isLive ? `${item.district}${item.taluk ? ' • ' + item.taluk : ''}` : (lang === 'kn' ? item.districtsLabelKn : item.districtsLabelEn);
              const eligibility = isLive ? item.qualification : (lang === 'kn' ? item.eligibilityKn : item.eligibilityEn);
              const salaryOrStat = isLive ? (item.salary || 'Govt / Norms') : item.stat2ValEn;
              const openingsOrStat = isLive ? (item.openings || 'Active Drive') : item.stat1ValEn;
              const deadlineOrStat = isLive ? (item.deadline ? item.deadline.split('T')[0] : 'Open') : item.stat3ValEn;

              return (
                <div key={item.id} className={styles.oppCard}>
                  <div className={styles.cardTop}>
                    <div className={styles.cardMetaRow}>
                      <span className={`${styles.categoryPill} ${getPillStyle(category)}`}>
                        <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                          {getCategoryIcon(category)}
                        </span>
                        {category}
                      </span>
                      <span className={styles.districtBadge}>
                        {districtLabel}
                      </span>
                    </div>

                    <div>
                      <h3 className={styles.cardTitle}>{title}</h3>
                      <p className={styles.cardTitleKn}>{companyOrSub}</p>
                    </div>

                    <p className={styles.cardDesc}>{description}</p>

                    <div className={styles.statsGrid}>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>{isLive ? 'Vacancies' : 'Intake'}</span>
                        <span className={styles.statVal}>{openingsOrStat}</span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>{isLive ? 'Pay Scale' : 'Stipend'}</span>
                        <span className={`${styles.statVal} ${styles.statValGreen}`}>{salaryOrStat}</span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>{isLive ? 'Last Date' : 'Deadline'}</span>
                        <span className={`${styles.statVal} ${styles.statValOrange}`}>{deadlineOrStat}</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.eligibilitySnippet} title={eligibility}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#16a34a' }}>school</span>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '240px' }}>
                        {eligibility}
                      </span>
                    </div>

                    {(() => {
                      const rawUrl = item.apply_url || item.sourceUrl || '';
                      const hasValidUrl = rawUrl && rawUrl !== '#' && rawUrl.trim() !== '';
                      const targetUrl = hasValidUrl
                        ? (/^https?:\/\//i.test(rawUrl.trim()) ? rawUrl.trim() : `https://${rawUrl.trim()}`)
                        : null;

                      if (targetUrl) {
                        return (
                          <a
                            href={targetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.applyBtn}
                            aria-label={`Apply for ${title}`}
                          >
                            <span>{t('btnApply')}</span>
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                          </a>
                        );
                      }

                      return (
                        <button
                          type="button"
                          className={styles.applyBtn}
                          onClick={
                            item.category === 'ai' && onOpenSkills
                              ? onOpenSkills
                              : (item.category === 'exams' || item.category === 'kpsc') && onOpenLibrary
                              ? onOpenLibrary
                              : onOpenJobs
                          }
                          aria-label={`View opportunities for ${title}`}
                        >
                          <span>{t('btnApply')}</span>
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                        </button>
                      );
                    })()}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyNotice}>
            {isLoading
              ? 'Loading opportunities from the database...'
              : 'No opportunities currently match your search query or filters. Please try another keyword or district.'}
          </div>
        )}

        {/* Show More CTA Button redirecting to dedicated Job Portal page */}
        <div className={styles.showMoreContainer}>
          <button
            type="button"
            className={styles.showMoreBtn}
            onClick={onOpenJobs}
            aria-label={lang === 'kn' ? 'ಎಲ್ಲಾ ಉದ್ಯೋಗಾವಕಾಶಗಳು ಮತ್ತು ಹುದ್ದೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ' : 'Explore All Opportunities & Jobs'}
          >
            <span>
              {lang === 'kn' ? 'ಎಲ್ಲಾ ಉದ್ಯೋಗಾವಕಾಶಗಳನ್ನು ವೀಕ್ಷಿಸಿ' : 'Explore All Opportunities & Jobs'}
            </span>
            <span className={styles.showMoreBadge}>
              {totalJobs > 4
                ? `${totalJobs}+ ${lang === 'kn' ? 'ಖಚಿತ ಉದ್ಯೋಗಗಳು' : 'Verified Openings'}`
                : (lang === 'kn' ? 'ಸಂಪೂರ್ಣ ಪೋರ್ಟಲ್' : 'Full Portal')}
            </span>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
          </button>
        </div>
      </div>
    </section>
  );
}
