import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import styles from './EventPassModal.module.css';

export default function EventPassModal({ eventData, onClose }) {
  const { lang } = useLanguage();
  const [step, setStep] = useState('form'); // 'form' | 'pass'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [passData, setPassData] = useState(null);
  const [copiedToken, setCopiedToken] = useState(false);

  // Lock background body scroll ONLY when modal is actively open
  useEffect(() => {
    if (!eventData) {
      document.body.style.overflow = '';
      return;
    }
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow || '';
    };
  }, [eventData]);

  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    education: 'BE / B.Tech',
    stream: 'Computer Science',
    passoutYear: '2025',
    district: eventData?.district || 'Tumakuru',
    employmentStatus: 'Fresher / Seeking Job'
  });

  if (!eventData) {
    if (typeof document !== 'undefined' && document.body) {
      document.body.style.overflow = '';
    }
    return null;
  }

  const karnatakaDistricts = [
    'Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban',
    'Bidar', 'Chamarajanagar', 'Chikkaballapur', 'Chikkamagaluru', 'Chitradurga',
    'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Gadag', 'Hassan',
    'Haveri', 'Kalaburagi', 'Kodagu', 'Kolar', 'Koppal',
    'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga',
    'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayapura', 'Vijayanagara', 'Yadgir'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.fullName.trim() || !formData.mobile.trim()) {
      setErrorMessage(lang === 'kn' ? 'ದಯವಿಟ್ಟು ಹೆಸರು ಮತ್ತು ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.' : 'Please enter your full name and mobile number.');
      return;
    }

    const cleanMobile = formData.mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setErrorMessage(lang === 'kn' ? 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ 10-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/events/${eventData.id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          mobile: cleanMobile,
          email: formData.email.trim() || null,
          education: formData.education,
          stream: formData.stream.trim() || 'General',
          passoutYear: formData.passoutYear,
          district: formData.district,
          employmentStatus: formData.employmentStatus
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to generate event pass.');
      }

      setPassData(data);
      setStep('pass');
    } catch (err) {
      console.error('Registration failed:', err);
      setErrorMessage(err.message || 'Could not connect to registration server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyToken = () => {
    const token = passData?.passToken || passData?.registration?.pass_token;
    if (token) {
      navigator.clipboard?.writeText(token);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2500);
    }
  };

  const handlePrintPass = () => {
    let iframe = document.getElementById('pass-print-frame');
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'pass-print-frame';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.style.visibility = 'hidden';
      document.body.appendChild(iframe);
    }

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${eventData.title || 'Job Mela'} - Pass #${tokenToDisplay}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm 10mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #ffffff;
      color: #0f172a;
      padding: 0;
      margin: 0;
      font-size: 11.5px;
      line-height: 1.4;
    }
    .ticket-outer {
      max-width: 650px;
      margin: 0 auto;
      border: 2px dashed #ea580c;
      border-radius: 12px;
      background: #ffffff;
      overflow: hidden;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .ticket-top {
      background: #fff7ed;
      border-bottom: 2px solid #fed7aa;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand-title {
      font-size: 13px;
      font-weight: 900;
      color: #c2410c;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }
    .brand-sub {
      font-size: 9.5px;
      font-weight: 700;
      color: #64748b;
    }
    .free-pill {
      background: #16a34a;
      color: #ffffff;
      font-size: 10px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 12px;
      text-transform: uppercase;
    }
    .ticket-body {
      padding: 14px 16px;
    }
    .event-title {
      font-size: 14px;
      font-weight: 900;
      color: #0f172a;
      margin-bottom: 8px;
    }
    .token-box {
      background: #fff7ed;
      border: 1.5px solid #fed7aa;
      border-radius: 8px;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .token-label {
      font-size: 9px;
      font-weight: 800;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .token-value {
      font-family: monospace, Courier, monospace;
      font-size: 17px;
      font-weight: 900;
      color: #ea580c;
      letter-spacing: 0.05em;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 14px;
      padding: 8px 0;
      border-top: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
      margin-bottom: 10px;
    }
    .item-label {
      font-size: 8.5px;
      color: #64748b;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .item-val {
      font-size: 11.5px;
      color: #0f172a;
      font-weight: 800;
    }
    .instructions {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 8px 10px;
      margin-bottom: 10px;
      font-size: 10.5px;
      color: #334155;
      line-height: 1.45;
    }
    .instructions strong {
      color: #0f172a;
    }
    .appeal-card {
      background: #ffffff;
      border: 1.5px solid #fed7aa;
      border-radius: 8px;
      padding: 8px 10px;
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }
    .appeal-img {
      width: 52px;
      height: 62px;
      border-radius: 6px;
      object-fit: cover;
      border: 1px solid #fed7aa;
      flex-shrink: 0;
    }
    .appeal-pill {
      display: inline-block;
      background: #ffedd5;
      color: #c2410c;
      font-size: 8.5px;
      font-weight: 800;
      padding: 1px 5px;
      border-radius: 3px;
      text-transform: uppercase;
    }
    .appeal-name {
      font-size: 12px;
      font-weight: 900;
      color: #0f172a;
      margin-top: 2px;
    }
    .appeal-msg {
      font-size: 10.5px;
      font-weight: 700;
      color: #ea580c;
      margin-top: 1px;
    }
    .appeal-sub {
      font-size: 9.5px;
      color: #64748b;
      margin-top: 1px;
    }
    .ticket-ft {
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      padding: 6px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 9.5px;
      color: #64748b;
    }
    .ticket-ft strong {
      color: #0f172a;
    }
  </style>
</head>
<body>
  <div class="ticket-outer">
    <div class="ticket-top">
      <div>
        <div class="brand-title">Graduate Career Desk — South-East Graduates</div>
        <div class="brand-sub">South-East Graduates' Career & Opportunity Portal</div>
      </div>
      <div class="free-pill">100% Free Candidate Pass</div>
    </div>

    <div class="ticket-body">
      <div class="event-title">${eventData.title}</div>

      <div class="token-box">
        <div>
          <div class="token-label">Official Candidate Entry Token</div>
          <div class="token-value">${tokenToDisplay}</div>
        </div>
        <div style="text-align: right;">
          <div class="token-label">Issued Status</div>
          <div style="font-size: 11px; font-weight: 800; color: #16a34a;">Confirmed Admission</div>
        </div>
      </div>

      <div class="grid">
        <div>
          <div class="item-label">Candidate Name</div>
          <div class="item-val">${formData.fullName}</div>
        </div>
        <div>
          <div class="item-label">WhatsApp Mobile</div>
          <div class="item-val">${formData.mobile}</div>
        </div>
        <div>
          <div class="item-label">Mela Date & Time</div>
          <div class="item-val">${formattedDate} • ${eventData.start_time || '9:30 AM'}</div>
        </div>
        <div>
          <div class="item-label">Venue Campus</div>
          <div class="item-val">${eventData.venue}</div>
        </div>
        <div>
          <div class="item-label">Education / Stream</div>
          <div class="item-val">${formData.education} (${formData.stream || 'General'}) • Passout: ${formData.passoutYear}</div>
        </div>
        <div>
          <div class="item-label">Home District</div>
          <div class="item-val">${formData.district}</div>
        </div>
      </div>

      <div class="instructions">
        <strong>📋 Important Instructions for Candidate Entry:</strong>
        <div style="margin-top: 3px;">• Carry <strong>5 physical copies of your updated resume / CV</strong> for attending company interview counters.</div>
        <div>• Carry a valid <strong>Photo ID card</strong> (Aadhaar Card, Voter ID, Driving Licence, or College ID).</div>
        <div>• Present this digital token <strong>${tokenToDisplay}</strong> at the entrance badge verification desk.</div>
        <div>• Entry is strictly 100% free with no registration or placement charges.</div>
      </div>

      <div class="appeal-card">
        <img src="/images/new_Images/Candidate Profile Namaste1.png" alt="K. M. Suresh" class="appeal-img" />
        <div>
          <div class="appeal-pill">NDA • MLC 2026</div>
          <div class="appeal-name">${lang === 'kn' ? 'ಕೆ. ಎಂ. ಸುರೇಶ್ (K. M. Suresh)' : 'K. M. Suresh'}</div>
          <div class="appeal-msg">${lang === 'kn' ? 'ಕರ್ನಾಟಕ ಆಗ್ನೇಯ ಪದವೀಧರ ಕ್ಷೇತ್ರಕ್ಕೆ ನಿಮ್ಮ 1ನೇ ಪ್ರಾಶಸ್ತ್ಯದ ಮತ ನೀಡಿ ಆಶೀರ್ವದಿಸಿ!' : "Cast your 1st Preference Vote for K. M. Suresh — South-East Graduates' MLC!"}</div>
          <div class="appeal-sub">Dedicated to youth employability, corporate job melas & free competitive exam guidance across Karnataka.</div>
        </div>
      </div>
    </div>

    <div class="ticket-ft">
      <div>Official Helpdesk Email: <strong>graduatehelpdesk@gmail.com</strong></div>
      <div>Verified Candidate Admission • South-East Graduates Desk</div>
    </div>
  </div>
</body>
</html>`);
    doc.close();

    setTimeout(() => {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch (e) {
        console.error('Iframe print failed, falling back to window.print', e);
        window.print();
      }
    }, 250);
  };

  const formattedDate = eventData.event_date
    ? new Date(eventData.event_date).toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : '2026';

  const tokenToDisplay = passData?.passToken || passData?.registration?.pass_token || `#PASS-${eventData.id}-2026`;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerTitleRow}>
            <span className={`material-symbols-outlined ${styles.headerIcon}`}>
              {step === 'form' ? 'confirmation_number' : 'verified'}
            </span>
            <div>
              <h3 className={styles.modalTitle}>
                {step === 'form'
                  ? (lang === 'kn' ? 'ಉಚಿತ ಪ್ರವೇಶ ಪಾಸ್ ನೋಂದಣಿ' : 'Reserve Free Entry E-Pass')
                  : (lang === 'kn' ? 'ಅಧಿಕೃತ ಪ್ರವೇಶ ಇ-ಪಾಸ್ ದೃಢೀಕರಿಸಲಾಗಿದೆ' : 'Official Entry Pass Confirmed')}
              </h3>
              <p className={styles.modalSubtitle}>
                {step === 'form'
                  ? (lang === 'kn' ? '100% ಉಚಿತ ಜನಪರ ಸೇವೆ • ಯಾವುದೇ ಶುಲ್ಕವಿಲ್ಲ' : '100% Free Public Initiative • Spot Interview Pass')
                  : (lang === 'kn' ? 'ಸ್ಥಳದಲ್ಲಿ ಪ್ರವೇಶಕ್ಕಾಗಿ ಈ ಪಾಸ್ ಅನ್ನು ಪ್ರದರ್ಶಿಸಿ' : 'Present this pass at the gate desk upon arrival')}
              </p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} type="button" aria-label="Close modal">
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>close</span>
          </button>
        </div>

        <div className={styles.modalBody}>
          {step === 'form' ? (
            /* =========================================================
               STEP 1: QUICK 30-SEC REGISTRATION FORM
               ========================================================= */
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {/* Event Context Banner */}
              <div className={styles.eventContextBanner}>
                <div className={styles.eventContextTop}>
                  <span className={styles.eventTypePill}>{eventData.event_type || 'Mega Job Mela'}</span>
                  <span className={styles.eventDateBadge}>
                    <span className="material-symbols-outlined" style={{ fontSize: '13px', verticalAlign: 'middle', marginRight: '3px' }}>calendar_month</span>
                    {formattedDate} • {eventData.start_time || '9:30 AM'}
                  </span>
                </div>
                <div className={styles.eventContextTitle}>{eventData.title}</div>
                <div className={styles.eventContextVenue}>
                  <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#ea580c', flexShrink: 0 }}>location_on</span>
                  <span>{eventData.venue} ({eventData.district})</span>
                </div>
              </div>

              {errorMessage && (
                <div className={styles.errorBanner}>
                  <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>error</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className={styles.formGrid}>
                {/* Full Name */}
                <div className={styles.formGroup}>
                  <label className={styles.fieldLabel}>
                    <span>{lang === 'kn' ? 'ಪೂರ್ಣ ಹೆಸರು' : 'Full Name'}</span>
                    <span className={styles.requiredMark}>*</span>
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={`material-symbols-outlined ${styles.inputIcon}`}>person</span>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder={lang === 'kn' ? 'ಉದಾ: ರಮೇಶ್ ಕುಮಾರ್' : 'e.g. Ramesh Kumar / Priya S'}
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div className={styles.formGroup}>
                  <label className={styles.fieldLabel}>
                    <span>{lang === 'kn' ? 'ವಾಟ್ಸಾಪ್ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ' : 'WhatsApp Mobile Number'}</span>
                    <span className={styles.requiredMark}>*</span>
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={`material-symbols-outlined ${styles.inputIcon}`}>phone_android</span>
                    <input
                      type="tel"
                      className={styles.formInput}
                      placeholder="99800 XXXXX"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Education / Qualification */}
                <div className={styles.formGroup}>
                  <label className={styles.fieldLabel}>
                    <span>{lang === 'kn' ? 'ಪದವಿ / ವಿದ್ಯಾರ್ಹತೆ' : 'Degree / Qualification'}</span>
                    <span className={styles.requiredMark}>*</span>
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={`material-symbols-outlined ${styles.inputIcon}`}>school</span>
                    <select
                      className={styles.formSelect}
                      value={formData.education}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    >
                      <option value="BE / B.Tech">BE / B.Tech (Engineering)</option>
                      <option value="Diploma">Diploma (Polytechnic)</option>
                      <option value="B.Sc / BCA">B.Sc / BCA / BCS</option>
                      <option value="B.Com / BBA">B.Com / BBA / BBM</option>
                      <option value="BA / BSW">BA / BSW / Humanities</option>
                      <option value="MCA / M.Sc">MCA / M.Sc / M.Tech</option>
                      <option value="MBA / M.Com">MBA / M.Com / PG</option>
                      <option value="ITI / Vocational">ITI / Vocational</option>
                      <option value="Other Degree">Other Degree / PG</option>
                    </select>
                  </div>
                </div>

                {/* Year of Passing */}
                <div className={styles.formGroup}>
                  <label className={styles.fieldLabel}>
                    <span>{lang === 'kn' ? 'ಪಾಸಾದ ವರ್ಷ' : 'Year of Passing'}</span>
                    <span className={styles.requiredMark}>*</span>
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={`material-symbols-outlined ${styles.inputIcon}`}>event</span>
                    <select
                      className={styles.formSelect}
                      value={formData.passoutYear}
                      onChange={(e) => setFormData({ ...formData, passoutYear: e.target.value })}
                    >
                      <option value="2026">2026 (Final Year)</option>
                      <option value="2025">2025 Passout</option>
                      <option value="2024">2024 Passout</option>
                      <option value="2023">2023 Passout</option>
                      <option value="2022">2022 Passout</option>
                      <option value="2021">2021 Passout</option>
                      <option value="2020 or earlier">2020 or earlier</option>
                    </select>
                  </div>
                </div>

                {/* District */}
                <div className={styles.formGroup}>
                  <label className={styles.fieldLabel}>
                    <span>{lang === 'kn' ? 'ನಿಮ್ಮ ಜಿಲ್ಲೆ' : 'Home District'}</span>
                    <span className={styles.requiredMark}>*</span>
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={`material-symbols-outlined ${styles.inputIcon}`}>map</span>
                    <select
                      className={styles.formSelect}
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    >
                      {karnatakaDistricts.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Current Employment Status */}
                <div className={styles.formGroup}>
                  <label className={styles.fieldLabel}>
                    <span>{lang === 'kn' ? 'ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ' : 'Current Status'}</span>
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={`material-symbols-outlined ${styles.inputIcon}`}>work</span>
                    <select
                      className={styles.formSelect}
                      value={formData.employmentStatus}
                      onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}
                    >
                      <option value="Fresher / Seeking Job">Fresher / Seeking Job</option>
                      <option value="Student / Final Year">Student / Final Year</option>
                      <option value="Employed / Looking to Switch">Employed / Looking to Switch</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined" style={{ animation: 'spin 1s linear infinite' }}>sync</span>
                    <span>{lang === 'kn' ? 'ಪಾಸ್ ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ...' : 'Issuing Free Entry Pass...'}</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">confirmation_number</span>
                    <span>{lang === 'kn' ? 'ಉಚಿತ ಪ್ರವೇಶ ಪಾಸ್ ಪಡೆಯಿರಿ' : 'Generate Free Entry Pass'}</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* =========================================================
               STEP 2: OFFICIAL DIGITAL ENTRY PASS + VOTE APPEAL
               ========================================================= */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className={styles.passCard} id="printable-event-pass">
                <div className={styles.passCardBorderTop}></div>

                <div className={styles.passSuccessNotice}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>check_circle</span>
                  <span>
                    {passData?.isExisting
                      ? (lang === 'kn' ? 'ನಿಮ್ಮ ಪ್ರವೇಶ ಪಾಸ್ ವಿವರಗಳು' : 'Your Official Entry Pass')
                      : (lang === 'kn' ? 'ಪ್ರವೇಶ ಇ-ಪಾಸ್ ಯಶಸ್ವಿಯಾಗಿ ರಚನೆಯಾಗಿದೆ!' : 'Free Entry Pass Successfully Issued!')}
                  </span>
                </div>

                {/* Pass Token Display */}
                <div className={styles.passTokenBox}>
                  <div>
                    <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700, display: 'block' }}>
                      {lang === 'kn' ? 'ಪ್ರವೇಶ ಪಾಸ್ ಟೋಕನ್' : 'ENTRY PASS TOKEN'}
                    </span>
                    <span className={styles.passTokenCode}>{tokenToDisplay}</span>
                  </div>
                  <button type="button" className={styles.copyTokenBtn} onClick={handleCopyToken}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                      {copiedToken ? 'done' : 'content_copy'}
                    </span>
                    <span>{copiedToken ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                {/* Event & Attendee Details */}
                <div className={styles.passMetaGrid}>
                  <div className={styles.passMetaItem}>
                    <span className={styles.passMetaLabel}>Attendee Name</span>
                    <span className={styles.passMetaValue}>{formData.fullName}</span>
                  </div>
                  <div className={styles.passMetaItem}>
                    <span className={styles.passMetaLabel}>WhatsApp Mobile</span>
                    <span className={styles.passMetaValue}>{formData.mobile}</span>
                  </div>
                  <div className={styles.passMetaItem}>
                    <span className={styles.passMetaLabel}>Event Date & Time</span>
                    <span className={styles.passMetaValue}>{formattedDate} • {eventData.start_time || '9:30 AM'}</span>
                  </div>
                  <div className={styles.passMetaItem}>
                    <span className={styles.passMetaLabel}>Venue Campus</span>
                    <span className={styles.passMetaValue} style={{ fontSize: '11px', color: '#0f172a' }}>
                      {eventData.venue}
                    </span>
                  </div>
                  <div className={styles.passMetaItem}>
                    <span className={styles.passMetaLabel}>Qualification</span>
                    <span className={styles.passMetaValue}>{formData.education} ({formData.passoutYear})</span>
                  </div>
                  <div className={styles.passMetaItem}>
                    <span className={styles.passMetaLabel}>Entry Category</span>
                    <span className={styles.passMetaValue} style={{ color: '#16a34a' }}>100% Free Candidate Pass</span>
                  </div>
                </div>

                {/* Checklist Instructions */}
                <div className={styles.instructionsBox}>
                  <div className={styles.instructionsHeading}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#ea580c' }}>checklist</span>
                    <span>Important Instructions for the Job Mela Desk:</span>
                  </div>
                  <div>• Carry <strong>5 physical copies of your updated resume / CV</strong>.</div>
                  <div>• Carry a valid <strong>Photo ID card</strong> (Aadhaar / Voter ID / College ID).</div>
                  <div>• Present this digital token <strong>{tokenToDisplay}</strong> at the entrance badge desk.</div>
                  <div style={{ marginTop: '0.35rem', paddingTop: '0.35rem', borderTop: '1px dashed #cbd5e1', fontSize: '11px', color: '#64748b' }}>
                    Need Help / Queries? Email: <strong style={{ color: '#ea580c' }}>graduatehelpdesk@gmail.com</strong>
                  </div>
                </div>

                {/* MLC 2026 Candidate Vote Appeal Card */}
                <div className={styles.appealCard}>
                  <div className={styles.appealCardBody}>
                    <div className={styles.appealPortraitWrap}>
                      <img
                        src="/images/new_Images/Candidate Profile Namaste1.png"
                        alt="K. M. Suresh NDA MLC Candidate"
                        className={styles.appealPortraitImg}
                      />
                    </div>
                    <div className={styles.appealContent}>
                      <div className={styles.appealBadge}>
                        <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>how_to_vote</span>
                        <span>NDA • MLC 2026</span>
                      </div>
                      <div className={styles.appealCandidateName}>
                        {lang === 'kn' ? 'ಕೆ. ಎಂ. ಸುರೇಶ್' : 'K. M. Suresh'}
                      </div>
                      <div className={styles.appealVoteText}>
                        {lang === 'kn'
                          ? 'ಕರ್ನಾಟಕ ಆಗ್ನೇಯ ಪದವೀಧರ ಕ್ಷೇತ್ರಕ್ಕೆ ನಿಮ್ಮ 1ನೇ ಪ್ರಾಶಸ್ತ್ಯದ ಮತ ನೀಡಿ ಆಶೀರ್ವದಿಸಿ!'
                          : 'Cast your 1st Preference Vote for K. M. Suresh — South-East Graduates\' MLC!'}
                      </div>
                      <div style={{ fontSize: '10px', color: '#64748b', marginTop: '0.15rem' }}>
                        Dedicated to bringing verified corporate employment drives & digital skill training across Karnataka.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className={styles.passActionButtons}>
                  <a
                    href={`https://wa.me/91${formData.mobile.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello, my Free Entry E-Pass for "${eventData.title}" is confirmed! Token #${tokenToDisplay}. Venue: ${eventData.venue} on ${formattedDate}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.whatsappRemindBtn}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>chat</span>
                    <span>Save to WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    className={styles.printPassBtn}
                    onClick={handlePrintPass}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>print</span>
                    <span>Print / PDF Pass</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      background: '#0f172a',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      marginLeft: 'auto'
                    }}
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
