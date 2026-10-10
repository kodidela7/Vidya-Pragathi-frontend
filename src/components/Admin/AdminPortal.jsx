import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

export default function AdminPortal({ onBackToPublic }) {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('vp_admin_token') || sessionStorage.getItem('vp_admin_token') || null;
  });

  const [adminUser, setAdminUser] = useState(() => {
    try {
      const stored = localStorage.getItem('vp_admin_user') || sessionStorage.getItem('vp_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isVerifying, setIsVerifying] = useState(false);

  // Verify token on mount if present
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) return;
      try {
        setIsVerifying(true);
        const res = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setAdminUser(data.admin);
        } else {
          // Token expired or invalid
          handleLogout();
        }
      } catch (err) {
        console.warn('Token verify failed:', err);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleLoginSuccess = (user, jwtToken) => {
    setToken(jwtToken);
    setAdminUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('vp_admin_token');
    localStorage.removeItem('vp_admin_user');
    sessionStorage.removeItem('vp_admin_token');
    sessionStorage.removeItem('vp_admin_user');
    setToken(null);
    setAdminUser(null);
  };

  if (isVerifying) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#090d16',
        color: '#f8fafc',
        gap: '1rem',
        fontFamily: 'inherit'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          border: '3px solid rgba(234, 88, 12, 0.3)',
          borderTopColor: '#ea580c',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Verifying Administrative JWT Session...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (token && adminUser) {
    return (
      <AdminDashboard
        adminUser={adminUser}
        token={token}
        onLogout={handleLogout}
        onBackToPublic={onBackToPublic}
      />
    );
  }

  return (
    <AdminLogin
      onLoginSuccess={handleLoginSuccess}
      onBackToPublic={onBackToPublic}
    />
  );
}
