import React, { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import styles from './PledgeToast.module.css';

export default function PledgeToast({ isOpen, onClose }) {
  const { lang } = useLanguage();

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.toastOverlay} role="alert" aria-live="polite">
      <div className={styles.toastCard}>
        <div className={styles.iconCircle}>
          <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>
            check_circle
          </span>
        </div>

        <div className={styles.textCol}>
          <h4 className={styles.toastTitle}>
            <span>
              {lang === 'kn'
                ? 'ನಮ್ಮ ಮೇಲೆ ನಂಬಿಕೆ ಇಟ್ಟಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು!'
                : 'Thanks for trusting us!'}
            </span>
          </h4>
          <p className={styles.toastMsg}>
            {lang === 'kn'
              ? '2026ರ ವಿಧಾನ ಪರಿಷತ್ ಚುನಾವಣೆಯಲ್ಲಿ ಕೆ.ಎಂ. ಸುರೇಶ್ ಹಾಗೂ ಎನ್‌ಡಿಎಗೆ ನಿಮ್ಮ ಮತ ಬೆಂಬಲ ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಾಗಿದೆ.'
              : 'Your pledge of support for K. M. Suresh & NDA in the 2026 South-East Graduates\' Constituency has been recorded.'}
          </p>
        </div>

        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close notification"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            close
          </span>
        </button>
      </div>
    </div>
  );
}
