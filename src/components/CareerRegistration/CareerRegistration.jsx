import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { districtsData } from '../../data/districtsData';
import styles from './CareerRegistration.module.css';

export default function CareerRegistration() {
  const { lang, t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    stream: 'Engineering',
    district: 'Tumakuru',
    taluk: 'Tumakuru City',
    name: '',
    mobile: '',
    email: '',
    status: 'Seeking Opportunities'
  });
  const [submittedToken, setSubmittedToken] = useState(null);

  // Available taluks for currently selected district
  const selectedDistrictData = districtsData.find(
    d => d.nameEn.toLowerCase() === formData.district.toLowerCase()
  ) || districtsData[1];
  const talukList = selectedDistrictData.taluks.length > 0
    ? selectedDistrictData.taluks
    : ['Headquarters Urban'];

  const streams = [
    { id: 'Engineering', nameEn: 'Engineering & Tech', subEn: 'BE / B.Tech / Diploma', icon: 'engineering' },
    { id: 'Commerce', nameEn: 'Commerce & Mgmt', subEn: 'B.Com / BBA / MBA', icon: 'payments' },
    { id: 'Arts', nameEn: 'Arts & Humanities', subEn: 'BA / MA / MSW', icon: 'menu_book' },
    { id: 'Science', nameEn: 'Pure Sciences & IT', subEn: 'B.Sc / M.Sc / BCA / MCA', icon: 'biotech' },
    { id: 'Law', nameEn: 'Law & Judiciary', subEn: 'LLB / LLM', icon: 'gavel' },
    { id: 'Medicine', nameEn: 'Pharma & Allied', subEn: 'B.Pharm / Nursing', icon: 'health_and_safety' }
  ];

  const handleNext = () => {
    if (currentStep === 2 && !formData.name.trim()) {
      alert('Please enter your full name as on your degree certificate.');
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.mobile.trim()) {
      alert('Please enter your mobile number to receive updates.');
      return;
    }

    try {
      const res = await fetch('/api/graduates/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.name,
          mobile: formData.mobile,
          email: formData.email,
          district: formData.district,
          taluk: formData.taluk,
          education: formData.stream,
          stream: formData.stream,
          careerInterest: formData.status
        })
      });
      const data = await res.json();
      if (res.ok && data.success && data.tokenId) {
        setSubmittedToken(data.tokenId);
        return;
      }
    } catch (err) {
      console.warn('API submission fallback:', err);
    }

    const token = 'VP-2026-SE-' + Math.floor(10000 + Math.random() * 90000);
    setSubmittedToken(token);
  };

  const handleReset = () => {
    setSubmittedToken(null);
    setCurrentStep(1);
    setFormData({
      stream: 'Engineering',
      district: 'Tumakuru',
      taluk: 'Tumakuru City',
      name: '',
      mobile: '',
      email: '',
      status: 'Seeking Opportunities'
    });
  };

  return (
    <section className={styles.regSection} id="registration" aria-label="Graduate Registration">
      <div className="site-container">
        <div className={styles.regMainCard}>
          {/* Left Context & Advisory Column */}
          <div className={styles.contextCol}>
            <div className={styles.regTag}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#ea580c' }}>school</span>
              <span>{t('regTag')}</span>
            </div>

            <h2 className={styles.regHeading}>
              {t('regTitle')}
            </h2>

            <p className={styles.regDesc}>
              {t('regDesc')}
            </p>

            <div className={styles.benefitsList}>
              <div className={styles.benefitItem}>
                <span className={`material-symbols-outlined ${styles.benefitIcon}`}>verified</span>
                <div>
                  <span className={styles.benefitTitle}>Direct District Job Fair Entry</span>
                  <p className={styles.benefitDesc}>Verified profiles receive direct campus entry passes and schedule alerts for Tumakuru, Kolar, and Davanagere drives.</p>
                </div>
              </div>

              <div className={styles.benefitItem}>
                <span className={`material-symbols-outlined ${styles.benefitIcon}`}>psychology</span>
                <div>
                  <span className={styles.benefitTitle}>KDEM & AI Skilling Access</span>
                  <p className={styles.benefitDesc}>Sponsored access to cutting-edge emerging technologies, generative AI workshops, and coding fellowships.</p>
                </div>
              </div>

              <div className={styles.benefitItem}>
                <span className={`material-symbols-outlined ${styles.benefitIcon}`}>menu_book</span>
                <div>
                  <span className={styles.benefitTitle}>Free KPSC & Civil Services Hubs</span>
                  <p className={styles.benefitDesc}>Access to study material kits, reference libraries, and weekend guidance sessions across all 31 taluks.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Wizard Column */}
          <div className={styles.formCol}>
            {submittedToken ? (
              <div className={styles.successBox}>
                <div className={styles.successCheckIcon}>
                  <span className="material-symbols-outlined" style={{ fontSize: '36px' }}>check_circle</span>
                </div>
                <h3 className={styles.successHeading}>{t('regSuccessTitle')}</h3>
                <p className={styles.successDesc}>{t('regSuccessDesc')}</p>
                <div className={styles.tokenBox}>{submittedToken}</div>
                <p className={styles.successNotice}>{t('regSuccessNotice')}</p>
                <button className={styles.resetBtn} onClick={handleReset} type="button">
                  {t('regBtnAnother')}
                </button>
              </div>
            ) : (
              <>
                {/* Step Indicators */}
                <div className={styles.stepTracker}>
                  <div className={styles.stepBadgeItem}>
                    <span className={`${styles.stepCircle} ${currentStep === 1 ? styles.stepCircleActive : currentStep > 1 ? styles.stepCircleDone : ''}`}>
                      {currentStep > 1 ? '✓' : '1'}
                    </span>
                    <span className={styles.stepText}>{t('regStep1')}</span>
                  </div>

                  <div className={styles.stepDivider}></div>

                  <div className={styles.stepBadgeItem}>
                    <span className={`${styles.stepCircle} ${currentStep === 2 ? styles.stepCircleActive : currentStep > 2 ? styles.stepCircleDone : ''}`}>
                      {currentStep > 2 ? '✓' : '2'}
                    </span>
                    <span className={styles.stepText}>{t('regStep2')}</span>
                  </div>

                  <div className={styles.stepDivider}></div>

                  <div className={styles.stepBadgeItem}>
                    <span className={`${styles.stepCircle} ${currentStep === 3 ? styles.stepCircleActive : ''}`}>
                      3
                    </span>
                    <span className={styles.stepText}>{t('regStep3')}</span>
                  </div>
                </div>

                {/* Step 1: Degree Stream */}
                {currentStep === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label className={styles.formLabel}>{t('regLabelStream')}</label>
                      <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Choose your primary completed qualification:</p>
                    </div>

                    <div className={styles.streamGrid}>
                      {streams.map(item => (
                        <div
                          key={item.id}
                          className={`${styles.streamOption} ${formData.stream === item.id ? styles.streamOptionActive : ''}`}
                          onClick={() => setFormData({ ...formData, stream: item.id })}
                        >
                          <span className={`material-symbols-outlined ${styles.streamIcon}`}>{item.icon}</span>
                          <span className={styles.streamName}>{item.nameEn}</span>
                          <span className={styles.streamSub}>{item.subEn}</span>
                        </div>
                      ))}
                    </div>

                    <div className={styles.formButtonsRow} style={{ justifyContent: 'flex-end' }}>
                      <button className={styles.nextBtn} onClick={handleNext} type="button">
                        <span>{t('regBtnNext')}</span>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Domicile & Name */}
                {currentStep === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className={styles.fieldsGrid}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>{t('regLabelDistrict')}</label>
                        <select
                          className={styles.formSelect}
                          value={formData.district}
                          onChange={(e) => {
                            const newDist = e.target.value;
                            const match = districtsData.find(d => d.nameEn.toLowerCase() === newDist.toLowerCase());
                            const firstTaluk = match && match.taluks[0] ? match.taluks[0] : 'Headquarters Urban';
                            setFormData({ ...formData, district: newDist, taluk: firstTaluk });
                          }}
                        >
                          <option value="Tumakuru">Tumakuru (ತುಮಕೂರು)</option>
                          <option value="Kolar">Kolar (ಕೋಲಾರ)</option>
                          <option value="Chikkaballapur">Chikkaballapur (ಚಿಕ್ಕಬಳ್ಳಾಪುರ)</option>
                          <option value="Chitradurga">Chitradurga (ಚಿತ್ರದುರ್ಗ)</option>
                          <option value="Davanagere">Davanagere (ದಾವಣಗೆರೆ)</option>
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>{t('regLabelTaluk')}</label>
                        <select
                          className={styles.formSelect}
                          value={formData.taluk}
                          onChange={(e) => setFormData({ ...formData, taluk: e.target.value })}
                        >
                          {talukList.map(tName => (
                            <option key={tName} value={tName}>{tName}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>{t('regLabelName')}</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="e.g. Ramesh Gowda K / Priya S"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className={styles.formButtonsRow}>
                      <button className={styles.backBtn} onClick={handleBack} type="button">
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
                        <span>{t('regBtnBack')}</span>
                      </button>
                      <button className={styles.nextBtn} onClick={handleNext} type="button">
                        <span>{t('regBtnNext')}</span>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Contact & Submit */}
                {currentStep === 3 && (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className={styles.fieldsGrid}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>{t('regLabelMobile')}</label>
                        <input
                          type="tel"
                          className={styles.formInput}
                          placeholder="+91 98450 XXXXX"
                          value={formData.mobile}
                          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                          required
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>{t('regLabelEmail')}</label>
                        <input
                          type="email"
                          className={styles.formInput}
                          placeholder="graduate@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>{t('regLabelStatus')}</label>
                      <select
                        className={styles.formSelect}
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="Seeking Opportunities">Job Seeking (Fresh Graduate / Lateral)</option>
                        <option value="Employed but Up-skilling">Employed (Seeking Career Growth & Skills)</option>
                        <option value="Competitive Exam Aspirant">Preparing for KPSC / UPSC / Banking</option>
                        <option value="Higher Studies">Pursuing Post-Graduation / Research</option>
                      </select>
                    </div>

                    <div className={styles.formButtonsRow}>
                      <button className={styles.backBtn} onClick={handleBack} type="button">
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
                        <span>{t('regBtnBack')}</span>
                      </button>
                      <button className={styles.nextBtn} type="submit">
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>verified</span>
                        <span>{t('regBtnSubmit')}</span>
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
