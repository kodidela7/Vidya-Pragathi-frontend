import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Modals.module.css';


/**
 * EventRsvpModal - For reserving a spot in Job Melas & Bootcamps
 */
export function EventRsvpModal({ eventData, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  if (!eventData) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Please enter your name and phone number.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.titleWithIcon}>
            <span className={`material-symbols-outlined ${styles.headerIcon}`}>confirmation_number</span>
            <h3 className={styles.modalTitle}>Reserve Free Event Pass</h3>
          </div>
          <button className={styles.closeBtn} onClick={onClose} type="button">
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>close</span>
          </button>
        </div>

        {submitted ? (
          <div className={styles.pledgeSuccessAlert}>
            <p>Free Entry E-Pass confirmed for <strong>{eventData.title}</strong>!</p>
            <p style={{ marginTop: '0.4rem', fontSize: '0.75rem' }}>E-Pass token dispatched to {phone}. Please present this digital confirmation at the registration desk upon arrival at {eventData.venue}.</p>
            <button className={styles.confirmBtn} style={{ marginTop: '0.85rem' }} onClick={onClose}>Close</button>
          </div>
        ) : (
          <form className={styles.formContent} onSubmit={handleSubmit}>
            <div className={styles.highlightBanner}>
              <strong>Event:</strong> {eventData.title}
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.15rem' }}>
                {eventData.venue}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Your Name</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>WhatsApp Mobile Number</label>
              <input
                type="tel"
                className={styles.formInput}
                placeholder="+91 99800 XXXXX"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
              />
            </div>

            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={onClose} type="button">Cancel</button>
              <button className={styles.confirmBtn} type="submit">Generate Free Pass</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/**
 * PledgeModal - To pledge vote for BJP / K.M. Suresh & join volunteer taskforce
 */
export function PledgeModal({ isOpen, onClose }) {
  const [pledgeDone, setPledgeDone] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Tumakuru');
  const [taluk, setTaluk] = useState('');
  const [joinVolunteer, setJoinVolunteer] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Please fill in your name and phone number.');
      return;
    }

    try {
      await fetch('/api/pledges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: name.trim(),
          mobile: phone.trim(),
          district,
          taluk: taluk.trim(),
          volunteerOptIn: joinVolunteer,
          supportNote: joinVolunteer ? 'Pledged support + Youth Taskforce' : 'Pledged vote for BJP 2026'
        })
      });
    } catch (err) {
      console.warn('API pledge fallback:', err);
    }

    setPledgeDone(true);
  };

  const handleClose = () => {
    setPledgeDone(false);
    setName('');
    setPhone('');
    onClose();
  };

  return (
    <div className={styles.backdrop} onClick={handleClose}>
      <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.titleWithIcon}>
            <span className={`material-symbols-outlined ${styles.headerIcon}`}>how_to_vote</span>
            <h3 className={styles.modalTitle}>Pledge Support for K. M. Suresh</h3>
          </div>
          <button className={styles.closeBtn} onClick={handleClose} type="button">
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>close</span>
          </button>
        </div>

        {pledgeDone ? (
          <div className={styles.pledgeSuccessAlert}>
            <span className="material-symbols-outlined" style={{ fontSize: '36px', color: '#16a34a', display: 'block', margin: '0 auto 0.5rem' }}>check_circle</span>
            <p>ಧನ್ಯವಾದಗಳು! Thank you for pledging your support for <strong>K. M. Suresh (ಕೆ.ಎಂ. ಸುರೇಶ್)</strong> and BJP Karnataka in the 2026 MLC Graduate Constituency Election.</p>
            <p style={{ marginTop: '0.4rem', fontSize: '0.75rem' }}>Your support has been recorded in the constituency youth registry. Our Taluk team will connect with you via WhatsApp.</p>
            <button className={styles.confirmBtn} style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }} onClick={handleClose}>Complete</button>
          </div>
        ) : (
          <form className={styles.formContent} onSubmit={handleSubmit}>
            <div className={styles.highlightBanner} style={{ background: '#fef3c7', borderColor: '#fde68a', color: '#78350f' }}>
              <strong>Karnataka Legislative Council Election 2026</strong>: South-East Graduates (Kolar, Tumakuru, Chitradurga, Chikkaballapur, Davanagere)
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Your Name</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="Graduate Voter Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>WhatsApp Mobile Number</label>
              <input
                type="tel"
                className={styles.formInput}
                placeholder="+91 98450 XXXXX"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>District</label>
              <select className={styles.formSelect} value={district} onChange={e => setDistrict(e.target.value)}>
                <option value="Tumakuru">Tumakuru (ತುಮಕೂರು)</option>
                <option value="Kolar">Kolar (ಕೋಲಾರ)</option>
                <option value="Chikkaballapur">Chikkaballapur (ಚಿಕ್ಕಬಳ್ಳಾಪುರ)</option>
                <option value="Chitradurga">Chitradurga (ಚಿತ್ರದುರ್ಗ)</option>
                <option value="Davanagere">Davanagere (ದಾವಣಗೆರೆ)</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Taluk / Town</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="e.g. Sira / Gubbi / Malur / Harihar"
                value={taluk}
                onChange={e => setTaluk(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', marginTop: '0.25rem' }}>
              <input
                type="checkbox"
                id="joinVol"
                checked={joinVolunteer}
                onChange={e => setJoinVolunteer(e.target.checked)}
                style={{ accentColor: '#ea580c', width: '1rem', height: '1rem' }}
              />
              <label htmlFor="joinVol" style={{ fontWeight: 600, color: '#0f172a' }}>
                I also want to join the Taluk Youth Volunteer Taskforce
              </label>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={handleClose} type="button">Cancel</button>
              <button className={styles.confirmBtn} type="submit">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>how_to_vote</span>
                <span>Confirm My Pledge</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
