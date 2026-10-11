import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { eventsData } from '../../data/eventsData';
import styles from './EventsSection.module.css';

export default function EventsSection({ onSelectEvent }) {
  const { lang, t } = useLanguage();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [visibleCount, setVisibleCount] = useState(3);

  const constituencyDistricts = [
    'All Districts',
    'Kolar',
    'Tumakuru',
    'Chitradurga',
    'Davanagere',
    'Chikkaballapur',
    'Bengaluru Rural'
  ];

  // Reset pagination to initial 3 whenever filter changes
  useEffect(() => {
    setVisibleCount(3);
  }, [selectedType, selectedDistrict]);

  useEffect(() => {
    let isMounted = true;

    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/events');
        if (!res.ok) throw new Error('Failed to load events');
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.data) && data.data.length > 0) {
          setEvents(data.data);
        } else if (isMounted) {
          // fallback to bundled eventsData if DB is empty
          setEvents(eventsData);
        }
      } catch (err) {
        console.warn('Events fetch notice, using bundled data:', err.message);
        if (isMounted) {
          setEvents(eventsData);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter events by selectedType and selectedDistrict
  const filteredEvents = events.filter((ev) => {
    // Type Filter
    const eventType = ev.event_type || 'Mega Job Mela';
    if (selectedType !== 'all') {
      if (selectedType === 'Mega Job Mela' && !eventType.toLowerCase().includes('mela')) return false;
      if (selectedType === 'Skill Bootcamp' && !eventType.toLowerCase().includes('bootcamp')) return false;
      if (selectedType === 'Career Masterclass' && !eventType.toLowerCase().includes('masterclass')) return false;
    }

    // District Filter
    if (selectedDistrict !== 'all' && selectedDistrict !== 'All Districts') {
      const dist = (ev.district || ev.districtEn || '').toLowerCase();
      if (!dist.includes(selectedDistrict.toLowerCase())) return false;
    }

    return true;
  });

  // Determine featured event: prefer is_featured = 1, else first mela, else fallback
  const featuredEvent = events.find((e) => e.is_featured === 1 || e.is_featured === true) || events[0] || null;

  // Check if featured event is relevant under current filter
  const isFeaturedBannerVisible = Boolean(
    featuredEvent &&
    filteredEvents.some((ev) => String(ev.id) === String(featuredEvent.id))
  );

  // Scheduled grid events: exclude featured banner event from cards grid to avoid duplicate display
  const gridEvents = isFeaturedBannerVisible
    ? filteredEvents.filter((ev) => String(ev.id) !== String(featuredEvent.id))
    : filteredEvents;

  // Incremental +3 slice for the cards grid
  const visibleEvents = gridEvents.slice(0, visibleCount);
  const remainingCount = gridEvents.length - visibleEvents.length;

  // Format date helper
  const formatEventDate = (dateStr) => {
    if (!dateStr) return 'Nov 18, 2026';
    if (typeof dateStr === 'string' && dateStr.includes(',')) return dateStr;
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Helper to calculate days remaining
  const getDaysRemaining = (dateStr, fallbackEn, fallbackKn) => {
    if (!dateStr) return lang === 'kn' ? (fallbackKn || 'ಶೀಘ್ರದಲ್ಲೇ') : (fallbackEn || 'Soon');
    try {
      const target = new Date(dateStr);
      const now = new Date();
      const diffTime = target - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        return lang === 'kn' ? `${diffDays} ದಿನ ಬಾಕಿ` : `${diffDays} Days Left`;
      } else if (diffDays === 0) {
        return lang === 'kn' ? 'ಇಂದೇ ನಡೆಯಲಿದೆ' : 'Happening Today';
      } else {
        return lang === 'kn' ? 'ಮುಕ್ತಾಯಗೊಂಡಿದೆ' : 'Completed';
      }
    } catch {
      return lang === 'kn' ? (fallbackKn || 'ಶೀಘ್ರದಲ್ಲೇ') : (fallbackEn || 'Soon');
    }
  };

  return (
    <section className={styles.eventsSection} id="events" aria-label="Constituency Events Calendar">
      <div className="site-container">
        {/* Events Header */}
        <div className={styles.eventsHeader}>
          <div className={styles.headerText}>
            <div className={styles.tagsRow}>
              <span className={styles.eventsTag}>
                {lang === 'kn' ? 'ನೇರ ಉದ್ಯೋಗ ಮೇಳಗಳು' : 'Direct Campus Drives'}
              </span>
              <span className={styles.eventsSubTag}>
                {lang === 'kn' ? '100% ಉಚಿತ ಪ್ರವೇಶ ಪಾಸ್' : '100% Free Candidate Pass'}
              </span>
            </div>
            <h2 className={styles.eventsHeading}>
              {lang === 'kn'
                ? 'ಮುಂಬರುವ ಬೃಹತ್ ಉದ್ಯೋಗ ಮೇಳಗಳು & ತರಬೇತಿ ಶಿಬಿರಗಳು'
                : 'Upcoming Mega Job Melas & Skill Bootcamps'}
            </h2>
            <p className={styles.eventsDesc}>
              {lang === 'kn'
                ? 'ಕರ್ನಾಟಕ ಆಗ್ನೇಯ ಪದವೀಧರ ಕ್ಷೇತ್ರದ ಜಿಲ್ಲೆಗಳಲ್ಲಿ ಆಯೋಜಿಸಲಾಗುವ ನೇರ ಸಂದರ್ಶನಗಳು ಹಾಗೂ ತಾಂತ್ರಿಕ ಕಾರ್ಯಾಗಾರಗಳು.'
                : 'Free entry passes, on-the-spot interviews, and high-impact skills bootcamps across Tumakuru, Kolar, Chitradurga & Davanagere.'}
            </p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className={styles.filterToolbar}>
          <div className={styles.typeTabsGroup}>
            <button
              type="button"
              className={`${styles.typeTab} ${selectedType === 'all' ? styles.typeTabActive : ''}`}
              onClick={() => setSelectedType('all')}
            >
              {lang === 'kn' ? 'ಎಲ್ಲಾ ಕಾರ್ಯಕ್ರಮಗಳು' : 'All Events'}
            </button>
            <button
              type="button"
              className={`${styles.typeTab} ${selectedType === 'Mega Job Mela' ? styles.typeTabActive : ''}`}
              onClick={() => setSelectedType('Mega Job Mela')}
            >
              {lang === 'kn' ? 'ಬೃಹತ್ ಉದ್ಯೋಗ ಮೇಳಗಳು' : 'Mega Job Melas'}
            </button>
            <button
              type="button"
              className={`${styles.typeTab} ${selectedType === 'Skill Bootcamp' ? styles.typeTabActive : ''}`}
              onClick={() => setSelectedType('Skill Bootcamp')}
            >
              {lang === 'kn' ? 'ಸ್ಕಿಲ್ ಬೂಟ್‌ಕ್ಯಾಂಪ್ಸ್' : 'Skill Bootcamps'}
            </button>
            <button
              type="button"
              className={`${styles.typeTab} ${selectedType === 'Career Masterclass' ? styles.typeTabActive : ''}`}
              onClick={() => setSelectedType('Career Masterclass')}
            >
              {lang === 'kn' ? 'ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶನ' : 'Civil Services Masterclass'}
            </button>
          </div>

          <div className={styles.districtFilterWrap}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#ea580c' }}>location_on</span>
            <select
              className={styles.districtSelect}
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              aria-label="Filter events by district"
            >
              {constituencyDistricts.map((d) => (
                <option key={d} value={d}>
                  {d === 'All Districts' ? (lang === 'kn' ? 'ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳು' : 'All Districts') : d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Featured Job Mela Hero Banner */}
        {isFeaturedBannerVisible && featuredEvent && (
          <div className={styles.featuredMelaCard}>
            <img
              src="/images/new_Images/Job Mela Campus Meet1.png"
              alt="South-East Karnataka Mega Campus Job Mela"
              className={styles.melaBgImg}
              loading="lazy"
            />
            <div className={styles.melaOverlay}>
              <span className={styles.melaTagBadge}>
                {lang === 'kn' ? 'ವಿಶೇಷ ಬೃಹತ್ ಉದ್ಯೋಗ ಮೇಳ • 2026' : 'FEATURED MEGA HIRING DRIVE • 2026'}
              </span>
              <h3 className={styles.melaTitle}>
                {lang === 'kn' && featuredEvent.title_kn ? featuredEvent.title_kn : featuredEvent.title || t('eventBannerTitle')}
              </h3>
              <p className={styles.melaDesc}>
                {lang === 'kn' && featuredEvent.description_kn
                  ? featuredEvent.description_kn
                  : featuredEvent.description || t('eventBannerDesc')}
              </p>

              {/* Dynamic Stats Row in Featured Banner */}
              <div className={styles.featuredMetaRow}>
                <div className={styles.featuredMetaItem}>
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>apartment</span>
                  <span>{featuredEvent.companies_count || 45}+ Top Recruiters</span>
                </div>
                <div className={styles.featuredMetaItem}>
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>work</span>
                  <span>{featuredEvent.vacancies_count || 1200}+ Openings</span>
                </div>
                <div className={styles.featuredMetaItem}>
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>groups</span>
                  <span>{featuredEvent.registrations_count || 320}+ Passes Issued</span>
                </div>
              </div>

              <div className={styles.melaFooterRow}>
                <button
                  className={styles.melaRegisterBtn}
                  onClick={() => onSelectEvent(featuredEvent)}
                  type="button"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>confirmation_number</span>
                  <span>{lang === 'kn' ? 'ಉಚಿತ ಪ್ರವೇಶ ಪಾಸ್ ಪಡೆಯಿರಿ' : 'Register for Free Entry Pass'}</span>
                </button>
                <span className={styles.melaVenue}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>location_on</span>
                  {featuredEvent.venue || t('eventBannerVenue')} ({featuredEvent.district || 'Karnataka'})
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Scheduled District Event Cards Grid */}
        <div className={styles.eventsGrid}>
          {visibleEvents.map((ev) => {
            const evTitle = lang === 'kn' && ev.title_kn ? ev.title_kn : (ev.title || ev.titleEn);
            const evDistrict = lang === 'kn' && ev.districtKn ? ev.districtKn : (ev.district || ev.districtEn);
            const evVenue = lang === 'kn' && ev.venue_kn ? ev.venue_kn : (ev.venue || ev.venueEn);
            const evDesc = lang === 'kn' && ev.description_kn ? ev.description_kn : (ev.description || ev.descriptionEn);
            const evEligibility = lang === 'kn' && ev.eligibility_kn ? ev.eligibility_kn : (ev.eligibility || ev.eligibilityEn || 'All Degree Graduates');
            const dateDisplay = formatEventDate(ev.event_date || ev.dateEn);
            const daysLeft = getDaysRemaining(ev.event_date, ev.daysLeftEn, ev.daysLeftKn);

            return (
              <div key={ev.id} className={styles.eventCard}>
                <div className={styles.eventCardTop}>
                  <div className={styles.eventHeaderMeta}>
                    <span className={styles.districtPill}>
                      {evDistrict}
                    </span>
                    <span className={styles.daysLeftBadge}>
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>timer</span>
                      {daysLeft}
                    </span>
                  </div>

                  <div className={styles.dateRow}>
                    <span className={styles.dateBig}>{dateDisplay.split(',')[0]}</span>
                    <span className={styles.timeMuted}>• {ev.start_time || ev.timeEn || '9:30 AM'}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span className={styles.eventTypeBadge}>{ev.event_type || 'Mega Job Mela'}</span>
                    {ev.companies_count && (
                      <span className={styles.highlightPill}>
                        <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>domain</span>
                        {ev.companies_count}+ Companies
                      </span>
                    )}
                    {ev.registrations_count > 0 && (
                      <span className={styles.regCountBadge}>
                        <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>check_circle</span>
                        {ev.registrations_count}+ Passes
                      </span>
                    )}
                  </div>

                  <h4 className={styles.eventCardTitle}>
                    {evTitle}
                  </h4>

                  <p className={styles.eventCardDesc}>
                    <strong>{evVenue}</strong> — {evDesc}
                  </p>

                  <div className={styles.eventSpecsBox}>
                    <div>
                      <span className={styles.specLabel}>{lang === 'kn' ? 'ಅರ್ಹತೆ' : 'Eligibility'}</span>
                      <span className={styles.specValue}>{evEligibility}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className={styles.specLabel}>{lang === 'kn' ? 'ಪ್ರವೇಶ ಶುಲ್ಕ' : 'Entry Fee'}</span>
                      <span className={styles.specValueGreen}>{lang === 'kn' ? 'ಉಚಿತ ಇ-ಪಾಸ್' : '100% Free Pass'}</span>
                    </div>
                  </div>
                </div>

                <button
                  className={styles.passBtn}
                  onClick={() => onSelectEvent(ev)}
                  type="button"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>confirmation_number</span>
                  <span>{lang === 'kn' ? 'ಉಚಿತ ಪ್ರವೇಶ ಪಾಸ್ ಪಡೆಯಿರಿ' : 'Register for Free Entry Pass'}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Incremental "+3" Show More Button */}
        {remainingCount > 0 && (
          <div className={styles.showMoreContainer}>
            <button
              type="button"
              className={styles.showMoreBtn}
              onClick={() => setVisibleCount((prev) => prev + 3)}
              aria-label={lang === 'kn' ? 'ಇನ್ನಷ್ಟು ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ವೀಕ್ಷಿಸಿ' : 'Show More Events'}
            >
              <span>{lang === 'kn' ? 'ಇನ್ನಷ್ಟು ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ವೀಕ್ಷಿಸಿ' : 'Show More Events'}</span>
              <span className={styles.showMoreBadge}>+{Math.min(3, remainingCount)}</span>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>expand_more</span>
            </button>
          </div>
        )}

        {gridEvents.length === 0 && !isFeaturedBannerVisible && !isLoading && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '36px', color: '#94a3b8' }}>event_busy</span>
            <p style={{ marginTop: '0.5rem', fontWeight: 600 }}>No events matching your selected filter.</p>
          </div>
        )}
      </div>
    </section>
  );
}
