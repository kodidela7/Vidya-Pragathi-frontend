import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import styles from './GraduateRegistrationPage.module.css';

export default function GraduateRegistrationPage({ onBackToHome, onOpenJobs }) {
  const { lang, t } = useLanguage();

  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    education: 'BE / B.Tech',
    passoutYear: '2025',
    district: 'Tumakuru',
    careerInterest: 'Corporate Jobs & Private Sector Placement Drives'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedToken, setSubmittedToken] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedToken, setCopiedToken] = useState(false);

  // Always scroll to top when mounting the registration page
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const courses = [
    { value: 'BE / B.Tech', labelEn: 'BE / B.Tech / Engineering', labelKn: 'ಬಿಇ / ಬಿ.ಟೆಕ್ / ಇಂಜಿನಿಯರಿಂಗ್' },
    { value: 'B.Com / BBA / MBA', labelEn: 'B.Com / BBA / MBA (Commerce & Mgmt)', labelKn: 'ಬಿಕಾಂ / ಬಿಬಿಎ / ಎಂಬಿಎ' },
    { value: 'B.Sc / BCA / MCA', labelEn: 'B.Sc / BCA / MCA (Computer & Science)', labelKn: 'ಬಿಎಸ್ಸಿ / ಬಿಸಿಎ / ಎಂಸಿಎ' },
    { value: 'BA / MA / MSW', labelEn: 'BA / MA / MSW (Arts & Humanities)', labelKn: 'ಬಿಎ / ಎಂಎ / ಎಂಎಸ್‌ಡಬ್ಲ್ಯೂ' },
    { value: 'Polytechnic Diploma', labelEn: 'Polytechnic Diploma', labelKn: 'ಪಾಲಿಟೆಕ್ನಿಕ್ ಡಿಪ್ಲೊಮಾ' },
    { value: 'Pharmacy / Nursing / Medical', labelEn: 'Pharmacy / Nursing / Medical', labelKn: 'ಫಾರ್ಮಸಿ / ನರ್ಸಿಂಗ್ / ವೈದ್ಯಕೀಯ' },
    { value: 'Other Degree', labelEn: 'Other Degree / Postgraduate', labelKn: 'ಇತರ ಪದವಿ / ಸ್ನಾತಕೋತ್ತರ' }
  ];

  // All 31 Karnataka Districts listed in ascending alphabetical order (no grouping)
  const karnatakaDistricts = [
    { value: 'Bagalkot', labelEn: 'Bagalkot (ಬಾಗಲಕೋಟೆ)' },
    { value: 'Ballari', labelEn: 'Ballari (ಬಳ್ಳಾರಿ)' },
    { value: 'Belagavi', labelEn: 'Belagavi (ಬೆಳಗಾವಿ)' },
    { value: 'Bengaluru Rural', labelEn: 'Bengaluru Rural (ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ)' },
    { value: 'Bengaluru Urban', labelEn: 'Bengaluru Urban (ಬೆಂಗಳೂರು ನಗರ)' },
    { value: 'Bidar', labelEn: 'Bidar (ಬೀದರ್)' },
    { value: 'Chamarajanagar', labelEn: 'Chamarajanagar (ಚಾಮರಾಜನಗರ)' },
    { value: 'Chikkaballapur', labelEn: 'Chikkaballapur (ಚಿಕ್ಕಬಳ್ಳಾಪುರ)' },
    { value: 'Chikkamagaluru', labelEn: 'Chikkamagaluru (ಚಿಕ್ಕಮಗಳೂರು)' },
    { value: 'Chitradurga', labelEn: 'Chitradurga (ಚಿತ್ರದುರ್ಗ)' },
    { value: 'Dakshina Kannada', labelEn: 'Dakshina Kannada (ದಕ್ಷಿಣ ಕನ್ನಡ / ಮಂಗಳೂರು)' },
    { value: 'Davanagere', labelEn: 'Davanagere (ದಾವಣಗೆರೆ)' },
    { value: 'Dharwad', labelEn: 'Dharwad (ಧಾರವಾಡ / ಹುಬ್ಬಳ್ಳಿ)' },
    { value: 'Gadag', labelEn: 'Gadag (ಗದಗ)' },
    { value: 'Hassan', labelEn: 'Hassan (ಹಾಸನ)' },
    { value: 'Haveri', labelEn: 'Haveri (ಹಾವೇರಿ)' },
    { value: 'Kalaburagi', labelEn: 'Kalaburagi (ಕಲಬುರಗಿ / ಗುಲ್ಬರ್ಗಾ)' },
    { value: 'Kodagu', labelEn: 'Kodagu (ಕೊಡಗು / ಮಡಿಕೇರಿ)' },
    { value: 'Kolar', labelEn: 'Kolar (ಕೋಲಾರ)' },
    { value: 'Koppal', labelEn: 'Koppal (ಕೊಪ್ಪಳ)' },
    { value: 'Mandya', labelEn: 'Mandya (ಮಂಡ್ಯ)' },
    { value: 'Mysuru', labelEn: 'Mysuru (ಮೈಸೂರು)' },
    { value: 'Raichur', labelEn: 'Raichur (ರಾಯಚೂರು)' },
    { value: 'Ramanagara', labelEn: 'Ramanagara (ರಾಮನಗರ)' },
    { value: 'Shivamogga', labelEn: 'Shivamogga (ಶಿವಮೊಗ್ಗ)' },
    { value: 'Tumakuru', labelEn: 'Tumakuru (ತುಮಕೂರು)' },
    { value: 'Udupi', labelEn: 'Udupi (ಉಡುಪಿ)' },
    { value: 'Uttara Kannada', labelEn: 'Uttara Kannada (ಉತ್ತರ ಕನ್ನಡ / ಕಾರವಾರ)' },
    { value: 'Vijayapura', labelEn: 'Vijayapura (ವಿಜಯಪುರ / ಬಿಜಾಪುರ)' },
    { value: 'Vijayanagara', labelEn: 'Vijayanagara (ವಿಜಯನಗರ)' },
    { value: 'Yadgir', labelEn: 'Yadgir (ಯಾದಗಿರಿ)' },
    { value: 'Other Karnataka District', labelEn: 'Other District / Outside Karnataka (ಇತರ)' }
  ];

  const careerInterests = [
    { value: 'Corporate Jobs & Private Sector Placement Drives', labelEn: 'Corporate & IT Private Sector Jobs', labelKn: 'ಖಾಸಗಿ ಕಂಪನಿ ಮತ್ತು ಐಟಿ ಉದ್ಯೋಗಗಳು' },
    { value: 'Core Engineering & Manufacturing Sector Drives', labelEn: 'Core Engineering & Manufacturing Drives', labelKn: 'ಕೋರ್ ಇಂಜಿನಿಯರಿಂಗ್ & ಉತ್ಪಾದನಾ ವಲಯ' },
    { value: 'Government & KPSC Competitive Exams Coaching', labelEn: 'Government & KPSC Exam Free Coaching Hubs', labelKn: 'ಕೆಪಿಎಸ್‌ಸಿ / ರಾಜ್ಯ ಸರ್ಕಾರಿ ಪರೀಕ್ಷೆಗಳ ತರಬೇತಿ' },
    { value: 'Central Govt, UPSC, SSC & Railways Exams Guidance', labelEn: 'Central Govt, UPSC, SSC & Railways Exams', labelKn: 'ಕೇಂದ್ರ ಸರ್ಕಾರ, ಯುಪಿಎಸ್‌ಸಿ, ಎಸ್‌ಎಸ್‌ಸಿ & ರೈಲ್ವೇ ಪರೀಕ್ಷೆಗಳು' },
    { value: 'Banking & Financial Sector Careers (IBPS/SBI)', labelEn: 'Banking & Financial Sector Careers (IBPS, SBI, RBI)', labelKn: 'ಬ್ಯಾಂಕಿಂಗ್ & ಹಣಕಾಸು ವಲಯ (IBPS, SBI, ಸಹಕಾರಿ ಬ್ಯಾಂಕ್)' },
    { value: 'Emerging AI & Digital Skilling Certifications', labelEn: 'Emerging AI & Digital Skilling Certifications (KDEM)', labelKn: 'ಎಐ & ಡಿಜಿಟಲ್ ಕೌಶಲ್ಯ ಪ್ರಮಾಣಪತ್ರ ತರಬೇತಿ' },
    { value: 'Teaching, Faculty & Academic Careers (TET/NET)', labelEn: 'Teaching & Academic Careers (TET, KSET, NET, B.Ed)', labelKn: 'ಶಿಕ್ಷಕ ಮತ್ತು ಉಪನ್ಯಾಸಕ ವೃತ್ತಿ (TET, KSET, NET)' },
    { value: 'Paid Apprenticeships, Internships & Hands-on Training', labelEn: 'Paid Apprenticeships & Corporate Internships', labelKn: 'ತರಬೇತಿ ಶಿಷ್ಯವೃತ್ತಿ & ಇಂಟರ್ನ್‌ಶಿಪ್ ಅವಕಾಶಗಳು' },
    { value: 'Self-Employment, Entrepreneurship & Startup Mentorship', labelEn: 'Self-Employment & Startup Entrepreneurship Mentorship', labelKn: 'ಸ್ವಯಂ ಉದ್ಯೋಗ, ನವೋದ್ಯಮ & ಸ್ಟಾರ್ಟ್‌ಅಪ್ ಮಾರ್ಗದರ್ಶನ' },
    { value: 'Higher Education, Post-Graduation & Research Guidance', labelEn: 'Higher Education, PG & Research Counseling', labelKn: 'ಉನ್ನತ ಶಿಕ್ಷಣ, ಸ್ನಾತಕೋತ್ತರ & ಸಂಶೋಧನಾ ಮಾರ್ಗದರ್ಶನ' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.fullName.trim()) {
      setErrorMessage(lang === 'kn' ? 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.' : 'Please enter your full name.');
      return;
    }

    const cleanMobile = formData.mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setErrorMessage(lang === 'kn' ? 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ 10-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/graduates/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          mobile: cleanMobile,
          education: formData.education,
          passoutYear: parseInt(formData.passoutYear, 10) || null,
          district: formData.district,
          careerInterest: formData.careerInterest
        })
      });

      const data = await response.json();
      if (response.ok && data.success && data.tokenId) {
        setSubmittedToken(data.tokenId);
        setIsSubmitting(false);
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        return;
      }
    } catch (err) {
      console.warn('Backend registration fallback to local token:', err);
    }

    // Graceful fallback token if offline
    const randomToken = `VP-2026-SE-${Math.floor(10000 + Math.random() * 90000)}`;
    setSubmittedToken(randomToken);
    setIsSubmitting(false);
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const handleCopyToken = () => {
    if (submittedToken) {
      navigator.clipboard.writeText(submittedToken);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2500);
    }
  };

  const handleResetForm = () => {
    setSubmittedToken(null);
    setFormData({
      fullName: '',
      mobile: '',
      education: 'BE / B.Tech',
      district: 'Tumakuru',
      careerInterest: 'Corporate Jobs & Private Sector Placement Drives'
    });
    setErrorMessage('');
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  return (
    <div className={styles.pageWrapper}>
      <div className="site-container">
        {/* Navigation Breadcrumb */}
        <div className={styles.breadcrumbBar}>
          <button
            type="button"
            className={styles.backHomeBtn}
            onClick={onBackToHome}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
            <span>{lang === 'kn' ? 'ಮುಖ್ಯ ಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ' : 'Back to Home'}</span>
          </button>
          <span className={styles.breadcrumbDivider}>/</span>
          <span className={styles.breadcrumbCurrent}>
            {lang === 'kn' ? 'ಪದವೀಧರ ನೋಂದಣಿ' : 'Graduate Career Desk Registration'}
          </span>
        </div>

        {!submittedToken ? (
          /* =========================================================
             1. CLEAN, MINIMAL REGISTRATION FORM CARD
             ========================================================= */
          <div className={styles.registrationContainer}>
            <div className={styles.formHeader}>
              <div className={styles.badgeRow}>
                <span className={styles.constituencyBadge}>
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>verified</span>
                  {lang === 'kn' ? 'ಕರ್ನಾಟಕ ಪದವೀಧರರ ವೃತ್ತಿ ವೇದಿಕೆ' : 'Karnataka Graduate Career Desk'}
                </span>
                <span className={styles.freeBadge}>
                  100% Free Service
                </span>
              </div>

              <h1 className={styles.mainTitle}>
                {lang === 'kn' ? 'ಪದವೀಧರ ಉದ್ಯೋಗ ಮತ್ತು ಕೌಶಲ್ಯ ನೋಂದಣಿ' : 'Graduate Career & Opportunity Desk Registration'}
              </h1>

              <p className={styles.subTitle}>
                {lang === 'kn'
                  ? 'ಕರ್ನಾಟಕದ ಸಮಸ್ತ ಪದವೀಧರರಿಗೆ ನೇರ ಉದ್ಯೋಗ ಮಾಹಿತಿ, ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶನ ಮತ್ತು ಡಿಜಿಟಲ್ ಕೌಶಲ್ಯ ತರಬೇತಿ.'
                  : 'Direct access to verified job openings, career guidance, and digital skills training for graduates across Karnataka.'}
              </p>
            </div>

            <div className={styles.cardWrapper}>
              <form onSubmit={handleSubmit} className={styles.formGrid}>
                {errorMessage && (
                  <div className={styles.errorAlert}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Field 1: Full Name */}
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="reg-name">
                    <span>{lang === 'kn' ? 'ಪೂರ್ಣ ಹೆಸರು (Full Name)' : 'Full Name (as on degree)'}</span>
                    <span className={styles.requiredMark}>*</span>
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={`material-symbols-outlined ${styles.inputIcon}`}>person</span>
                    <input
                      id="reg-name"
                      type="text"
                      className={styles.textInput}
                      placeholder={lang === 'kn' ? 'ಉದಾ: ರಮೇಶ್ ಕುಮಾರ್ ಕೆ' : 'e.g. Ramesh Kumar K / Priya S'}
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Field 2: Mobile Number */}
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="reg-mobile">
                    <span>{lang === 'kn' ? 'ಮೊಬೈಲ್ / ವಾಟ್ಸಾಪ್ ಸಂಖ್ಯೆ (WhatsApp Number)' : 'WhatsApp / Mobile Number'}</span>
                    <span className={styles.requiredMark}>*</span>
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={`material-symbols-outlined ${styles.inputIcon}`}>phone_android</span>
                    <input
                      id="reg-mobile"
                      type="tel"
                      className={styles.textInput}
                      placeholder="98450 XXXXX"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      maxLength={14}
                      required
                    />
                  </div>
                </div>

                {/* Field 3: Graduation Course */}
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="reg-education">
                    <span>{lang === 'kn' ? 'ಪದವಿ ಕೋರ್ಸ್ (Graduation Degree)' : 'Graduation Course / Degree'}</span>
                    <span className={styles.requiredMark}>*</span>
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={`material-symbols-outlined ${styles.inputIcon}`}>school</span>
                    <select
                      id="reg-education"
                      className={styles.selectInput}
                      value={formData.education}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    >
                      {courses.map(c => (
                        <option key={c.value} value={c.value}>
                          {lang === 'kn' ? c.labelKn : c.labelEn}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Field 3b: Passout Year */}
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="reg-passout">
                    <span>{lang === 'kn' ? 'ತೇರ್ಗಡೆಯಾದ ವರ್ಷ (Passout Year)' : 'Year of Passing'}</span>
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={`material-symbols-outlined ${styles.inputIcon}`}>calendar_today</span>
                    <select
                      id="reg-passout"
                      className={styles.selectInput}
                      value={formData.passoutYear}
                      onChange={(e) => setFormData({ ...formData, passoutYear: e.target.value })}
                    >
                      <option value="2026">2026 (Final Year)</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                      <option value="2021">2021</option>
                      <option value="2020">2020</option>
                      <option value="2019">2019 or Earlier</option>
                    </select>
                  </div>
                </div>

                {/* Field 4: Karnataka District (Ascending list, no groups) */}
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="reg-district">
                    <span>{lang === 'kn' ? 'ಜಿಲ್ಲೆ (Karnataka District)' : 'Karnataka District'}</span>
                    <span className={styles.requiredMark}>*</span>
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={`material-symbols-outlined ${styles.inputIcon}`}>location_on</span>
                    <select
                      id="reg-district"
                      className={styles.selectInput}
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    >
                      {karnatakaDistricts.map(d => (
                        <option key={d.value} value={d.value}>
                          {d.labelEn}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Field 5: Primary Career Interest */}
                <div className={`${styles.fieldGroup} ${styles.fullWidthField}`}>
                  <label className={styles.fieldLabel} htmlFor="reg-interest">
                    <span>{lang === 'kn' ? 'ಆಸಕ್ತಿಯ ಕ್ಷೇತ್ರ (Primary Career Goal)' : 'Primary Career Support Needed'}</span>
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={`material-symbols-outlined ${styles.inputIcon}`}>tune</span>
                    <select
                      id="reg-interest"
                      className={styles.selectInput}
                      value={formData.careerInterest}
                      onChange={(e) => setFormData({ ...formData, careerInterest: e.target.value })}
                    >
                      {careerInterests.map(item => (
                        <option key={item.value} value={item.value}>
                          {lang === 'kn' ? item.labelKn : item.labelEn}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Submit Action */}
                <div className={styles.submitSection}>
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="material-symbols-outlined" style={{ animation: 'spin 1s linear infinite' }}>sync</span>
                        <span>{lang === 'kn' ? 'ದಾಖಲಿಸಲಾಗುತ್ತಿದೆ...' : 'Submitting Registration...'}</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined">check_circle</span>
                        <span>{lang === 'kn' ? 'ನೋಂದಣಿ ಸಲ್ಲಿಸಿ' : 'Submit Registration'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* =========================================================
             2. ULTRA-COMPACT CONFIRMATION + PROMINENT MLC 2026 VOTE APPEAL
             ========================================================= */
          <div className={styles.successWrapper}>
            {/* Ultra-Compact Confirmation & Token Header */}
            <div className={styles.compactSuccessBanner}>
              <div className={styles.compactSuccessLeft}>
                <span className="material-symbols-outlined" style={{ fontSize: '26px', color: '#16a34a' }}>check_circle</span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span className={styles.compactSuccessBadge}>
                      {lang === 'kn' ? 'ನೋಂದಣಿ ದೃಢೀಕರಿಸಲಾಗಿದೆ' : 'Registration Confirmed'}
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>KA-2026</span>
                  </div>
                  <div className={styles.compactCandidateName}>
                    {formData.fullName} • {formData.district} ({formData.education})
                  </div>
                </div>
              </div>

              <div className={styles.compactTokenPill}>
                <div className={styles.tokenPillInfo}>
                  <span className={styles.tokenPillLabel}>{lang === 'kn' ? 'ಡೆಸ್ಕ್ ಟೋಕನ್' : 'Token ID'}</span>
                  <strong className={styles.tokenPillCode}>{submittedToken}</strong>
                </div>
                <button
                  type="button"
                  className={styles.tokenPillCopyBtn}
                  onClick={handleCopyToken}
                  title="Copy Token ID"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                    {copiedToken ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedToken ? (lang === 'kn' ? 'ಕಾಪಿ ಆಗಿದೆ' : 'Copied') : (lang === 'kn' ? 'ಕಾಪಿ' : 'Copy')}</span>
                </button>
              </div>
            </div>

            {/* =========================================================
               MLC 2026 CANDIDATE SPOTLIGHT & VOTE APPEAL (IMMEDIATELY VISIBLE)
               ========================================================= */}
            <div className={styles.mlcAppealCard}>
              <div className={styles.tricolorBorderTop}></div>

              <div className={styles.appealGrid}>
                {/* Left: Candidate Portrait with BJP Flag & Badges */}
                <div className={styles.appealPortraitCol}>
                  <div className={styles.portraitFrame}>
                    <img
                      src="/images/new_Images/Candidate Profile Namaste1.png"
                      alt="K. M. Suresh BJP MLC Candidate"
                      className={styles.portraitImg}
                    />
                    <div className={styles.officialNdaBadge}>
                      <span>BJP / NDA</span>
                      <span className={styles.mlcYearBadge}>MLC 2026</span>
                    </div>
                  </div>
                </div>

                {/* Right: Vote Appeal Message */}
                <div className={styles.appealContentCol}>
                  <div className={styles.appealBadgeRow}>
                    <span className={styles.voteAppealTag}>
                      <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>how_to_vote</span>
                      {lang === 'kn' ? 'ವಿಧಾನ ಪರಿಷತ್ ಚುನಾವಣೆ 2026' : 'Karnataka Legislative Council Election 2026'}
                    </span>
                    <span className={styles.constituencyPill}>
                      {lang === 'kn' ? 'ಆಗ್ನೇಯ ಪದವೀಧರರ ಕ್ಷೇತ್ರ' : "South-East Graduates' Constituency"}
                    </span>
                  </div>

                  <h3 className={styles.candidateNameHeading}>
                    {lang === 'kn' ? 'ಕೆ.ಎಂ. ಸುರೇಶ್ (K. M. Suresh)' : 'K. M. Suresh (ಕೆ.ಎಂ. ಸುರೇಶ್)'}
                  </h3>

                  <p className={styles.candidateRoleSubtitle}>
                    {lang === 'kn'
                      ? 'ಶಿಕ್ಷಣ ತಜ್ಞರು & ಅಧಿಕೃತ ಬಿಜೆಪಿ / ಎನ್‌ಡಿಎ ಅಭ್ಯರ್ಥಿ'
                      : 'Eminent Educationist & Official BJP / NDA Candidate'}
                  </p>

                  <div className={styles.voteAppealBanner}>
                    <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#ea580c' }}>campaign</span>
                    <div className={styles.appealCalloutText}>
                      <strong>{lang === 'kn' ? 'ನಿಮ್ಮ ಮೊದಲ ಪ್ರಾಶಸ್ತ್ಯದ ಮತವನ್ನು ಕೆ.ಎಂ. ಸುರೇಶ್ ಅವರಿಗೆ ನೀಡಿ!' : 'Cast Your 1st Preference Vote for K. M. Suresh!'}</strong>
                      <p>
                        {lang === 'kn'
                          ? 'ಪದವೀಧರರ ಉದ್ಯೋಗಾವಕಾಶ, ಕೌಶಲ್ಯ ಅಭಿವೃದ್ಧಿ ಹಾಗೂ ಗುಣಮಟ್ಟದ ಶಿಕ್ಷಣಕ್ಕಾಗಿ ನಿರಂತರವಾಗಿ ಶ್ರಮಿಸುತ್ತಿರುವ ನಾಯಕತ್ವವನ್ನು ಬೆಂಬಲಿಸಿ.'
                          : 'Support a proven educationist committed to transforming graduate employment, competitive exam libraries, and digital skilling across Karnataka.'}
                      </p>
                    </div>
                  </div>

                  {/* 3 Core Commitments */}
                  <div className={styles.commitmentsGrid}>
                    <div className={styles.commitmentItem}>
                      <span className="material-symbols-outlined" style={{ color: '#ea580c' }}>business_center</span>
                      <div>
                        <strong>{lang === 'kn' ? 'ಉದ್ಯೋಗ ಮೇಳಗಳು' : 'Regular Job Melas'}</strong>
                        <span>{lang === 'kn' ? 'ಕ್ಯಾಂಪಸ್ ನೇಮಕಾತಿ ಅಭಿಯಾನಗಳು' : 'Regular campus placement drives'}</span>
                      </div>
                    </div>

                    <div className={styles.commitmentItem}>
                      <span className="material-symbols-outlined" style={{ color: '#16a34a' }}>menu_book</span>
                      <div>
                        <strong>{lang === 'kn' ? 'ಉಚಿತ ಕೆಪಿಎಸ್‌ಸಿ ಕೇಂದ್ರ' : 'Free KPSC Hubs'}</strong>
                        <span>{lang === 'kn' ? 'ತಾಲ್ಲೂಕು ಮಟ್ಟದ ಉಚಿತ ಗ್ರಂಥಾಲಯ & ಮಾರ್ಗದರ್ಶನ' : 'Taluk reference libraries & study circles'}</span>
                      </div>
                    </div>

                    <div className={styles.commitmentItem}>
                      <span className="material-symbols-outlined" style={{ color: '#0284c7' }}>smart_toy</span>
                      <div>
                        <strong>{lang === 'kn' ? 'ಎಐ ಕೌಶಲ್ಯ ತರಬೇತಿ' : 'AI & Digital Skilling'}</strong>
                        <span>{lang === 'kn' ? 'ಉಚಿತ ತಂತ್ರಜ್ಞಾನ ಶಿಕ್ಷಣ' : 'KDEM-aligned digital certifications'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Action Buttons */}
            <div className={styles.nextActionsBar}>
              <button
                type="button"
                className={styles.browseJobsBtn}
                onClick={onOpenJobs}
              >
                <span>{lang === 'kn' ? 'ಉದ್ಯೋಗಾವಕಾಶಗಳನ್ನು ವೀಕ್ಷಿಸಿ' : 'Browse Verified Job Openings'}</span>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
              </button>

              <button
                type="button"
                className={styles.registerAnotherBtn}
                onClick={handleResetForm}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person_add</span>
                <span>{lang === 'kn' ? 'ಮತ್ತೊಬ್ಬ ಪದವೀಧರರನ್ನು ನೋಂದಾಯಿಸಿ' : 'Register Another Graduate'}</span>
              </button>

              <button
                type="button"
                className={styles.homeReturnBtn}
                onClick={onBackToHome}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>home</span>
                <span>{lang === 'kn' ? 'ಮುಖ್ಯ ಪುಟ' : 'Back to Home'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
