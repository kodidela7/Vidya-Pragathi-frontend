import React, { useState } from 'react';
import styles from './AdminLogin.module.css';

export default function AdminLogin({ onLoginSuccess, onBackToPublic }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [trustWorkstation, setTrustWorkstation] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password) {
      setErrorMessage('Please enter both Admin ID / Work Email and Access Password.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Invalid administrative credentials.');
      }

      // Store JWT token
      if (trustWorkstation) {
        localStorage.setItem('vp_admin_token', data.token);
        localStorage.setItem('vp_admin_user', JSON.stringify(data.admin));
      } else {
        sessionStorage.setItem('vp_admin_token', data.token);
        sessionStorage.setItem('vp_admin_user', JSON.stringify(data.admin));
      }

      if (onLoginSuccess) {
        onLoginSuccess(data.admin, data.token);
      }
    } catch (err) {
      console.error('Login Error:', err);
      setErrorMessage(err.message || 'Connection to administrative server failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        {/* Tricolor Ribbon at top */}
        <div className={styles.tricolorTopBar}></div>

        {/* Clean Header */}
        <div className={styles.headerArea}>
          <h1 className={styles.cardTitle}>
            K.M. Suresh <span className={styles.kannadaName}>(ಕೆ.ಎಂ. ಸುರೇಶ್)</span>
          </h1>
          <p className={styles.cardSubtitle}>
            Vidya Pragathi • Campaign Operations & Constituency Control Room
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className={styles.errorAlert} role="alert">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Field 1: Admin ID / Work Email */}
          <div className={styles.formGroup}>
            <label className={styles.fieldLabel} htmlFor="admin-id">
              Official Admin ID / Work Email
            </label>
            <div className={styles.inputWrapper}>
              <span className={`material-symbols-outlined ${styles.inputIcon}`}>mail</span>
              <input
                id="admin-id"
                type="text"
                className={styles.textInput}
                placeholder="e.g. admin or suresh.warroom@bjpkarnataka.org"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          {/* Field 2: Access Password / Passcode */}
          <div className={styles.formGroup}>
            <div className={styles.fieldLabelRow}>
              <label className={styles.fieldLabel} htmlFor="access-password" style={{ margin: 0 }}>
                Access Password / Passcode
              </label>
            </div>
            <div className={styles.inputWrapper}>
              <span className={`material-symbols-outlined ${styles.inputIcon}`}>lock</span>
              <input
                id="access-password"
                type={showPassword ? 'text' : 'password'}
                className={styles.textInput}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className={styles.toggleEyeBtn}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Field 3: Trust Workstation Checkbox */}
          <div className={styles.trustWorkstationRow}>
            <input
              type="checkbox"
              id="trust-ws"
              className={styles.trustCheckbox}
              checked={trustWorkstation}
              onChange={(e) => setTrustWorkstation(e.target.checked)}
            />
            <label htmlFor="trust-ws" className={styles.trustLabel}>
              Authorize and trust this workstation for 12 hours
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className={styles.spinner}></div>
                <span>Verifying Security Access...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>shield</span>
                <span>Sign In to Operations Desk</span>
              </>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
          <button
            type="button"
            className={styles.backPublicBtn}
            onClick={onBackToPublic}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>arrow_back</span>
            <span>Return to Public Candidate Portal</span>
          </button>
        </div>
      </div>
    </div>
  );
}
