import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { opportunitiesData } from '../../data/opportunitiesData';
import styles from './JobsPortal.module.css';

export default function JobsPortal({ onBackToHome, onOpenAdmin }) {
  const { lang, toggleLang, t } = useLanguage();

  // Multi-section filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedJobType, setSelectedJobType] = useState('all');
  const [selectedExperience, setSelectedExperience] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Data fetching state (10 per page)
  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Naukri-style Selected Job for Right Pane View
  const [selectedJob, setSelectedJob] = useState(null);
  const [isMobileDetailView, setIsMobileDetailView] = useState(false);

  // Debounce search input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Reset page to 1 when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDistrict, selectedCategory, selectedJobType, selectedExperience, sortBy]);

  // Fetch jobs from backend API (limit 10 per page)
  useEffect(() => {
    let isCancelled = false;

    const fetchJobs = async () => {
      try {
        setIsLoading(true);

        let url = `/api/jobs?page=${currentPage}&limit=10`;

        if (debouncedSearch.trim()) {
          url += `&search=${encodeURIComponent(debouncedSearch.trim())}`;
        }
        if (selectedDistrict && selectedDistrict !== 'all') {
          url += `&district=${encodeURIComponent(selectedDistrict)}`;
        }
        if (selectedCategory && selectedCategory !== 'all') {
          url += `&category=${encodeURIComponent(selectedCategory)}`;
        }
        if (selectedJobType && selectedJobType !== 'all') {
          url += `&jobType=${encodeURIComponent(selectedJobType)}`;
        }
        if (selectedExperience && selectedExperience !== 'all') {
          url += `&experience=${encodeURIComponent(selectedExperience)}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        if (!isCancelled && res.ok && data.success) {
          let loadedJobs = data.data || [];

          if (sortBy === 'deadline') {
            loadedJobs.sort((a, b) => new Date(a.deadline || '2099-01-01') - new Date(b.deadline || '2099-01-01'));
          }

          setJobs(loadedJobs);
          setTotalJobs(data.total || 0);
          setTotalPages(data.totalPages || 1);

          // Default select first job like Naukri
          if (loadedJobs.length > 0) {
            setSelectedJob((prev) => {
              if (!prev) return loadedJobs[0];
              const match = loadedJobs.find(j => j.id === prev.id);
              return match || loadedJobs[0];
            });
          } else {
            setSelectedJob(null);
          }
        } else if (!isCancelled) {
          fallbackToStatic();
        }
      } catch (err) {
        console.warn('Jobs API error, falling back to static fixtures:', err);
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
      const filtered = opportunitiesData.filter(opp => {
        const matchesDistrict = selectedDistrict === 'all' || (opp.districtIds && opp.districtIds.includes(selectedDistrict));
        const matchesCategory = selectedCategory === 'all' || opp.category === selectedCategory;
        const matchesSearch = !debouncedSearch.trim() ||
          opp.titleEn.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          opp.descriptionEn.toLowerCase().includes(debouncedSearch.toLowerCase());
        return matchesDistrict && matchesCategory && matchesSearch;
      });

      setTotalJobs(filtered.length);
      const pages = Math.ceil(filtered.length / 10) || 1;
      setTotalPages(pages);
      const start = (currentPage - 1) * 10;
      const sliced = filtered.slice(start, start + 10);
      setJobs(sliced);

      if (sliced.length > 0) {
        setSelectedJob(sliced[0]);
      } else {
        setSelectedJob(null);
      }
    };

    fetchJobs();

    return () => {
      isCancelled = true;
    };
  }, [currentPage, debouncedSearch, selectedDistrict, selectedCategory, selectedJobType, selectedExperience, sortBy]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 140, behavior: 'smooth' });
    }
  };

  const hasActiveFilters = 
    searchTerm.trim() !== '' || 
    selectedDistrict !== 'all' || 
    selectedCategory !== 'all' || 
    selectedJobType !== 'all' || 
    selectedExperience !== 'all';

  const resetAllFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setSelectedDistrict('all');
    setSelectedCategory('all');
    setSelectedJobType('all');
    setSelectedExperience('all');
    setCurrentPage(1);
  };

  const getCompanyInitials = (name) => {
    if (!name) return 'KC';
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className={styles.jobsPortalLayout}>
      {/* 1. Sticky Navigation Bar */}
      <nav className={styles.portalNavbar}>
        <div className={`site-container ${styles.navInner}`}>
          <div className={styles.navLeft}>
            <button
              type="button"
              className={styles.backHomeBtn}
              onClick={onBackToHome}
              title="Return to Main Portal"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
              <span>Back to Home</span>
            </button>

            <div className={styles.portalBrand}>
              <div className={styles.brandLogoBox}>
                <span className="material-symbols-outlined">school</span>
              </div>
              <div className={styles.brandTitles}>
                <span className={styles.brandTitle}>Vidya Pragati</span>
                <span className={styles.brandSub}>Karnataka Career Desk</span>
              </div>
            </div>
          </div>

          <div className={styles.navRight}>
            <div className={styles.langToggle}>
              <button
                type="button"
                className={`${styles.langBtn} ${lang === 'en' ? styles.langBtnActive : ''}`}
                onClick={() => toggleLang('en')}
              >
                EN
              </button>
              <button
                type="button"
                className={`${styles.langBtn} ${lang === 'kn' ? styles.langBtnActive : ''}`}
                onClick={() => toggleLang('kn')}
              >
                ಕನ್ನಡ
              </button>
            </div>

            <button
              type="button"
              className={styles.adminBtn}
              onClick={onOpenAdmin}
              title="Admin Portal Access"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>lock</span>
              <span>Admin</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Header Banner: Karnataka Career Consultancy */}
      <header className={styles.portalHero}>
        <div className={`site-container ${styles.heroContent}`}>
          <h1 className={styles.heroTitle}>
            Karnataka Career Consultancy
          </h1>
          <p className={styles.heroSubtitle}>
            Vidya Pragati • Comprehensive Opportunities & Employment Portal
          </p>
        </div>
      </header>

      {/* 3. Multi-Section Filter Panel */}
      <section className={styles.filterPanelSection} aria-label="Search and Filter Controls">
        <div className="site-container">
          <div className={styles.filterPanelCard}>
            {/* Primary Search Input */}
            <div className={styles.searchPrimaryRow}>
              <div className={styles.mainSearchBox}>
                <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
                <input
                  type="text"
                  className={styles.mainSearchInput}
                  placeholder="Search by job title, company name, required skills (e.g., Python, CAD, GET, Testing, KPSC)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search opportunities"
                />
                {searchTerm && (
                  <button
                    type="button"
                    className={styles.clearSearchBtn}
                    onClick={() => setSearchTerm('')}
                    title="Clear search"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
                  </button>
                )}
              </div>
            </div>

            {/* Multi-Section Dropdown Filters Grid */}
            <div className={styles.filterSectionsGrid}>
              {/* District */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>
                  <span className="material-symbols-outlined" style={{ fontSize: '13px', color: '#ea580c' }}>location_on</span>
                  Constituency District
                </label>
                <select
                  className={styles.filterSelect}
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                >
                  <option value="all">All 5 Districts & Statewide</option>
                  <option value="Tumakuru">Tumakuru</option>
                  <option value="Kolar">Kolar</option>
                  <option value="Chikkaballapur">Chikkaballapur</option>
                  <option value="Chitradurga">Chitradurga</option>
                  <option value="Davanagere">Davanagere</option>
                  <option value="All Districts / Karnataka-Wide">Karnataka-Wide</option>
                </select>
              </div>

              {/* Sector / Domain */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>
                  <span className="material-symbols-outlined" style={{ fontSize: '13px', color: '#2563eb' }}>category</span>
                  Domain & Sector
                </label>
                <select
                  className={styles.filterSelect}
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Sectors & Domains</option>
                  <option value="Engineering & Tech">Engineering & Tech</option>
                  <option value="Commerce & Banking">Commerce & Banking</option>
                  <option value="Government / KPSC Exams">Government / KPSC Exams</option>
                  <option value="Emerging AI & Digital Skills">Emerging AI & Digital Skills</option>
                  <option value="Healthcare & Allied">Healthcare & Allied</option>
                  <option value="Apprenticeship">Skill Apprenticeship</option>
                </select>
              </div>

              {/* Work Model */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>
                  <span className="material-symbols-outlined" style={{ fontSize: '13px', color: '#16a34a' }}>work_outline</span>
                  Employment Model
                </label>
                <select
                  className={styles.filterSelect}
                  value={selectedJobType}
                  onChange={(e) => setSelectedJobType(e.target.value)}
                >
                  <option value="all">All Work Models</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Internship / Apprenticeship">Internship / Apprenticeship</option>
                  <option value="Contractual">Contractual</option>
                  <option value="Government Notice">Government Notice</option>
                </select>
              </div>

              {/* Experience */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>
                  <span className="material-symbols-outlined" style={{ fontSize: '13px', color: '#9333ea' }}>school</span>
                  Experience Level
                </label>
                <select
                  className={styles.filterSelect}
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value)}
                >
                  <option value="all">All Experience Levels</option>
                  <option value="Freshers (0-1 yr)">Freshers (0-1 yr)</option>
                  <option value="Freshers">Freshers</option>
                  <option value="1-3 yrs">1-3 yrs</option>
                  <option value="Experienced (3+ yrs)">Experienced (3+ yrs)</option>
                </select>
              </div>
            </div>

            {/* Quick Filter Tags / Pills Row */}
            <div className={styles.quickFiltersRow}>
              <div className={styles.quickPillsLeft}>
                <span className={styles.quickPillLabel}>Quick Filters:</span>
                <button
                  type="button"
                  className={`${styles.quickPillBtn} ${selectedExperience === 'Freshers (0-1 yr)' ? styles.quickPillActive : ''}`}
                  onClick={() => setSelectedExperience(selectedExperience === 'Freshers (0-1 yr)' ? 'all' : 'Freshers (0-1 yr)')}
                >
                  Freshers (0-1 yr)
                </button>
                <button
                  type="button"
                  className={`${styles.quickPillBtn} ${selectedCategory === 'Engineering & Tech' ? styles.quickPillActive : ''}`}
                  onClick={() => setSelectedCategory(selectedCategory === 'Engineering & Tech' ? 'all' : 'Engineering & Tech')}
                >
                  Engineering & Tech
                </button>
                <button
                  type="button"
                  className={`${styles.quickPillBtn} ${selectedCategory === 'Government / KPSC Exams' ? styles.quickPillActive : ''}`}
                  onClick={() => setSelectedCategory(selectedCategory === 'Government / KPSC Exams' ? 'all' : 'Government / KPSC Exams')}
                >
                  KPSC & Govt
                </button>
                <button
                  type="button"
                  className={`${styles.quickPillBtn} ${selectedDistrict === 'Tumakuru' ? styles.quickPillActive : ''}`}
                  onClick={() => setSelectedDistrict(selectedDistrict === 'Tumakuru' ? 'all' : 'Tumakuru')}
                >
                  Tumakuru
                </button>
                <button
                  type="button"
                  className={`${styles.quickPillBtn} ${selectedDistrict === 'Kolar' ? styles.quickPillActive : ''}`}
                  onClick={() => setSelectedDistrict(selectedDistrict === 'Kolar' ? 'all' : 'Kolar')}
                >
                  Kolar
                </button>
                <button
                  type="button"
                  className={`${styles.quickPillBtn} ${selectedJobType === 'Internship / Apprenticeship' ? styles.quickPillActive : ''}`}
                  onClick={() => setSelectedJobType(selectedJobType === 'Internship / Apprenticeship' ? 'all' : 'Internship / Apprenticeship')}
                >
                  Internships
                </button>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  className={styles.resetFiltersBtn}
                  onClick={resetAllFilters}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>refresh</span>
                  <span>Clear All Filters</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Results Bar & Naukri-Style Split View */}
      <main className="site-container" style={{ flex: 1, paddingTop: '0.4rem' }}>
        <div className={styles.resultsMetaToolbar}>
          <div className={styles.resultsCountText}>
            <span>Showing</span>
            <span className={styles.totalBadge}>
              {jobs.length > 0 ? `${(currentPage - 1) * 10 + 1}–${Math.min(currentPage * 10, totalJobs)}` : 0} of {totalJobs}
            </span>
            <span>Opportunities across Karnataka</span>
          </div>

          <div className={styles.sortGroup}>
            <span className={styles.sortLabel}>Sort By:</span>
            <select
              className={styles.sortSelect}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="deadline">Application Deadline</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className={styles.loadingContainer}>
            <span className="material-symbols-outlined" style={{ fontSize: '28px', animation: 'spin 1s linear infinite' }}>sync</span>
            <p>Loading opportunities...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className={styles.emptyStateCard}>
            <span className={`material-symbols-outlined ${styles.emptyIcon}`}>search_off</span>
            <h3 className={styles.emptyTitle}>No matching opportunities found</h3>
            <p className={styles.emptyText}>
              We couldn't find any opportunities matching your combination of filters. Please try another keyword or district.
            </p>
            <button
              type="button"
              className={styles.resetAllBtn}
              onClick={resetAllFilters}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          /* Naukri-Style Two-Column Split Layout */
          <div className={styles.naukriSplitLayout}>
            {/* Left Column: 10 Job Cards List + Pagination */}
            <div className={`${styles.jobsListColumn} ${isMobileDetailView ? styles.hideOnMobile : ''}`}>
              {jobs.map((job) => {
                const isLive = !!job.company;
                const title = isLive ? job.title : (lang === 'kn' ? job.titleKn : job.titleEn);
                const company = isLive ? job.company : (lang === 'kn' ? job.titleEn : job.titleKn);
                const district = isLive ? job.district : (job.districtIds ? job.districtIds.join(', ') : 'Statewide');
                const taluk = isLive ? job.taluk : '';
                const category = isLive ? job.category : job.category;
                const salary = isLive ? (job.salary || 'Govt / Norms') : (job.stat2ValEn || 'Norms');
                const deadline = isLive ? (job.deadline ? job.deadline.split('T')[0] : 'Open') : (job.stat3ValEn || 'Open');
                const qualification = isLive ? job.qualification : (lang === 'kn' ? job.eligibilityKn : job.eligibilityEn);
                const description = isLive ? job.description : (lang === 'kn' ? job.descriptionKn : job.descriptionEn);
                const isSelected = selectedJob && selectedJob.id === job.id;

                return (
                  <article
                    key={job.id}
                    className={`${styles.jobCard} ${isSelected ? styles.selectedJobCard : ''}`}
                    onClick={() => {
                      setSelectedJob(job);
                      setIsMobileDetailView(true);
                    }}
                  >
                    {/* Card Header: Avatar, Title, Employer */}
                    <div className={styles.jobCardHeader}>
                      <div className={styles.companyAvatarAndTitle}>
                        <div className={styles.companyAvatar}>
                          {getCompanyInitials(company)}
                        </div>
                        <div className={styles.titleArea}>
                          <h2 className={styles.jobTitle}>{title}</h2>
                          <div className={styles.companyRow}>
                            <span className={styles.companyName}>{company}</span>
                            <span className={styles.verifiedEmployerBadge}>
                              <span className="material-symbols-outlined" style={{ fontSize: '11px' }}>verified</span>
                              Verified
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className={styles.cardTopBadges}>
                        <span className={styles.locationBadge}>
                          <span className="material-symbols-outlined" style={{ fontSize: '13px', color: '#ea580c' }}>location_on</span>
                          {district}
                        </span>
                        <span className={styles.categoryBadge}>
                          {category}
                        </span>
                      </div>
                    </div>

                    {/* Key Metrics Ribbon: Salary, Qualification, Deadline */}
                    <div className={styles.metricsRibbon}>
                      <div className={styles.metricItem}>
                        <span className={`material-symbols-outlined ${styles.metricIcon}`}>payments</span>
                        <span>Pay: <strong className={styles.metricSalary}>{salary}</strong></span>
                      </div>

                      <div className={styles.metricItem}>
                        <span className={`material-symbols-outlined ${styles.metricIcon}`}>school</span>
                        <span>Eligibility: <strong>{qualification}</strong></span>
                      </div>

                      <div className={styles.metricItem}>
                        <span className={`material-symbols-outlined ${styles.metricIcon}`}>calendar_month</span>
                        <span>Deadline: <strong className={styles.metricDeadline}>{deadline}</strong></span>
                      </div>
                    </div>

                    {/* Card Bottom Footer: Verification Note & Action Buttons */}
                    <div className={styles.jobCardFooter}>
                      <div className={styles.sourceVerification}>
                        <span className={`material-symbols-outlined ${styles.sourceIcon}`}>verified_user</span>
                        <span>{isLive && job.source_note ? job.source_note : 'Karnataka Career Desk Verified'}</span>
                      </div>

                      <div className={styles.actionButtonsGroup}>
                        <button
                          type="button"
                          className={styles.viewDetailsBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedJob(job);
                            setIsMobileDetailView(true);
                          }}
                        >
                          <span>View Details</span>
                          <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>chevron_right</span>
                        </button>

                        <a
                          href={job.apply_url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.applyJobBtn}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>Apply Now</span>
                          <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>arrow_outward</span>
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}

              {/* Left Column Pagination Bar */}
              {totalPages > 1 && (
                <div className={styles.leftPaginationSection}>
                  <div className={styles.leftPaginationSummary}>
                    Page {currentPage} of {totalPages}
                  </div>

                  <div className={styles.paginationButtonsGroup}>
                    <button
                      type="button"
                      className={styles.pageNavBtn}
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_back</span>
                      <span>Prev</span>
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        className={`${styles.pageNumberBtn} ${currentPage === pageNum ? styles.pageNumberActive : ''}`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      type="button"
                      className={styles.pageNavBtn}
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                    >
                      <span>Next</span>
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Sticky Job Details Pane (Naukri Style) */}
            {selectedJob && (
              <aside className={`${styles.jobDetailsColumn} ${!isMobileDetailView ? styles.hideOnMobile : ''}`}>
                {/* Mobile Navigation Header */}
                <div className={styles.mobileBackBar}>
                  <button
                    type="button"
                    className={styles.mobileBackBtn}
                    onClick={() => {
                      setIsMobileDetailView(false);
                      window.scrollTo({ top: 120, behavior: 'smooth' });
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
                    <span>Back to All Job Listings</span>
                  </button>
                </div>

                {/* Sticky Header */}
                <div className={styles.detailsHeader}>
                  <div className={styles.detailsHeaderLeft}>
                    <h2 className={styles.detailsRoleTitle}>
                      {selectedJob.title || (lang === 'kn' ? selectedJob.titleKn : selectedJob.titleEn)}
                    </h2>
                    <div className={styles.detailsCompanyMeta}>
                      <span>{selectedJob.company || (lang === 'kn' ? selectedJob.titleEn : selectedJob.titleKn)}</span>
                      <span>•</span>
                      <span>{selectedJob.district || 'Karnataka'} {selectedJob.taluk ? `(${selectedJob.taluk})` : ''}</span>
                      <span className={styles.verifiedEmployerBadge}>
                        <span className="material-symbols-outlined" style={{ fontSize: '11px' }}>verified</span>
                        Verified Employer
                      </span>
                    </div>
                  </div>

                  <div className={styles.detailsHeaderRight}>
                    <a
                      href={selectedJob.apply_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.detailsApplyBtn}
                    >
                      <span>Apply Now</span>
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_outward</span>
                    </a>
                  </div>
                </div>

                {/* Body */}
                <div className={styles.detailsBody}>
                  {/* Highlights Grid */}
                  <div className={styles.detailsHighlightsGrid}>
                    <div className={styles.highlightItem}>
                      <span className={styles.highlightLabel}>Pay Scale / Stipend</span>
                      <span className={styles.highlightVal} style={{ color: '#15803d' }}>
                        {selectedJob.salary || 'Govt / Norms'}
                      </span>
                    </div>
                    <div className={styles.highlightItem}>
                      <span className={styles.highlightLabel}>Eligibility</span>
                      <span className={styles.highlightVal}>
                        {selectedJob.qualification || (lang === 'kn' ? selectedJob.eligibilityKn : selectedJob.eligibilityEn)}
                      </span>
                    </div>
                    <div className={styles.highlightItem}>
                      <span className={styles.highlightLabel}>Experience</span>
                      <span className={styles.highlightVal}>{selectedJob.experience || 'Freshers / Any'}</span>
                    </div>
                    <div className={styles.highlightItem}>
                      <span className={styles.highlightLabel}>Domain / Sector</span>
                      <span className={styles.highlightVal}>{selectedJob.category}</span>
                    </div>
                    <div className={styles.highlightItem}>
                      <span className={styles.highlightLabel}>Employment Model</span>
                      <span className={styles.highlightVal}>{selectedJob.job_type || 'Full Time'}</span>
                    </div>
                    <div className={styles.highlightItem}>
                      <span className={styles.highlightLabel}>Deadline</span>
                      <span className={styles.highlightVal} style={{ color: '#c2410c' }}>
                        {selectedJob.deadline ? selectedJob.deadline.split('T')[0] : 'Open'}
                      </span>
                    </div>
                  </div>

                  {/* Role Overview */}
                  <div className={styles.detailsSection}>
                    <h3 className={styles.detailsSectionTitle}>Role Overview & Responsibilities</h3>
                    <p className={styles.detailsSectionContent}>
                      {selectedJob.description || (lang === 'kn' ? selectedJob.descriptionKn : selectedJob.descriptionEn)}
                    </p>
                  </div>

                  {/* Skills */}
                  {selectedJob.skills && (
                    <div className={styles.detailsSection}>
                      <h3 className={styles.detailsSectionTitle}>Key Required Skills</h3>
                      <div className={styles.skillsChipsWrap}>
                        {selectedJob.skills.split(',').map((skill, idx) => (
                          <span key={idx} className={styles.detailSkillChip}>{skill.trim()}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Location & Venue */}
                  <div className={styles.detailsSection}>
                    <h3 className={styles.detailsSectionTitle}>Constituency District & Venue</h3>
                    <p className={styles.detailsSectionContent}>
                      {selectedJob.district} {selectedJob.taluk ? `— Taluk / Venue: ${selectedJob.taluk}` : ''}.
                      Verified directly by Karnataka Career Consultancy.
                    </p>
                  </div>
                </div>

                {/* Details Footer */}
                <div className={styles.detailsFooter}>
                  <div className={styles.detailsVerifiedNote}>
                    <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#16a34a' }}>verified_user</span>
                    <span>{selectedJob.source_note || 'Karnataka Career Consultancy Verified'}</span>
                  </div>
                </div>
              </aside>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
