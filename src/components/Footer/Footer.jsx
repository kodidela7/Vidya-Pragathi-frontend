import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Footer.module.css';

export default function Footer({ onOpenAdmin, onOpenJobs, onOpenRegister }) {
  const { t } = useLanguage();

  return (
    <footer className={styles.footer} aria-label="Site Footer">
      <div className="site-container">
        <div className={styles.footerGrid}>
          {/* Col 1: Identity & Vision */}
          <div className={styles.colIdentity}>
            <div className={styles.brandRow}>
              <div className={styles.brandIcon}>
                <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>spa</span>
              </div>
              <span className={styles.brandTitle}>{t('brandTitle')}</span>
            </div>

            <p className={styles.footerBio}>
              {t('footerDesc')}
            </p>

            <div className={styles.verifiedElectorDesk}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>verified</span>
              <span>Vidhana Parishat Election 2026</span>
            </div>
          </div>

          {/* Col 2: Constituency Secretariats */}
          <div>
            <h4 className={styles.colHeading}>{t('footerSecretariats')}</h4>
            <ul className={styles.linksList}>
              <li><strong>Tumakuru:</strong> Someshwara Extension, Tumakuru HQ</li>
              <li><strong>Kolar:</strong> Graduate Resource Cell, MB Road</li>
              <li><strong>Chikkaballapur:</strong> Taskforce Wing, Sidlaghatta Rd</li>
              <li><strong>Chitradurga:</strong> Kelagote Secretarial Desk</li>
              <li><strong>Davanagere:</strong> Vidyanagara Ring Road Campus</li>
            </ul>
          </div>

          {/* Col 3: Public Services */}
          <div>
            <h4 className={styles.colHeading}>{t('footerServices')}</h4>
            <ul className={styles.linksList}>
              <li><a href="#jobs" onClick={(e) => { if (onOpenJobs) { e.preventDefault(); onOpenJobs(); } }}>District Opportunity Pipelines</a></li>
              <li><a href="#register" onClick={(e) => { if (onOpenRegister) { e.preventDefault(); onOpenRegister(); } }}>Graduate Registration</a></li>
              <li><a href="#matrix">KDEM & Emerging AI Skilling</a></li>
              <li><a href="#matrix">Free Taluk KPSC Coaching</a></li>
              <li><a href="#events">Mega Campus Job Melas 2026</a></li>
              <li><a href="#helpdesk">Constituency Grievance Redressal</a></li>
            </ul>
          </div>

          {/* Col 4: Helpline & Contact */}
          <div>
            <h4 className={styles.colHeading}>{t('footerContact')}</h4>
            <div className={styles.contactBox}>
              <div className={styles.phoneRow}>
                <span className={`material-symbols-outlined ${styles.phoneIcon}`}>call</span>
                <span className={styles.phoneNumber}>{t('footerPhone')}</span>
              </div>
              <p className={styles.contactText}>{t('footerHours')}</p>
              <span className={styles.contactEmail}>{t('footerEmail')}</span>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className={styles.bottomRow}>
          <p>{t('footerCopyright')}</p>
          <div className={styles.legalLinks}>
            <a href="#helpdesk">Grievance SLA</a>
            <a href="#volunteer">Volunteer Privacy</a>
            <a href="#candidate">Candidate Profile</a>
            <button
              type="button"
              onClick={onOpenAdmin}
              style={{
                background: 'none',
                border: 'none',
                color: '#cbd5e1',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '0.78rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0 0.25rem',
                transition: 'color 0.15s ease'
              }}
              title="Chief Admin Console"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#ea580c' }}>admin_panel_settings</span>
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
