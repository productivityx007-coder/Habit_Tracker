import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';

export const LandingPage: React.FC = () => {
  const { loginWithGoogle, loginAsGuest, user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  if (user) {
    navigate('/dashboard');
  }

  const handleGoogleLogin = async () => {
    try {
      setIsLoggingIn(true);
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Google sign-in could not be completed.');
      setIsLoggingIn(false);
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    toast.success('Welcome to HabitFlow Demo! Enjoy exploring.');
    navigate('/dashboard');
  };

  return (
    <div className="auth-page-root">
      {/* 
        ==================================================
        MOBILE LOGIN LAYOUT (< 768px)
        Dedicated, centered, full viewport, zero clutter
        ==================================================
      */}
      <div className="mobile-login-view">
        <div className="mobile-login-card">
          {/* Logo & Brand Header */}
          <div className="mobile-login-header">
            <div className="mobile-brand-icon-wrap">
              <Sparkles size={28} />
            </div>
            <h1 className="mobile-brand-title">HabitFlow</h1>
            <span className="mobile-brand-badge">PRECISION TRACKER</span>
          </div>

          {/* Subtitle & Welcome Heading */}
          <div className="mobile-login-tagline-wrap">
            <h2 className="mobile-welcome-heading">Welcome Back</h2>
            <p className="mobile-login-subtitle">
              Build better habits,<br />one day at a time.
            </p>
          </div>

          {/* Primary Action: Google Sign In Button */}
          <div className="mobile-login-actions">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="google-btn mobile-google-btn"
              aria-label="Continue with Google"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" className="google-svg">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>{isLoggingIn ? 'Signing in...' : 'Continue with Google'}</span>
            </button>

            {/* Instant Demo Option */}
            <button
              onClick={handleGuestLogin}
              className="demo-btn mobile-demo-btn"
            >
              <span>Explore Instant Demo Mode</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Legal / Policy Note */}
          <div className="mobile-login-legal">
            <p>
              By continuing, you agree to our{' '}
              <span className="legal-link">Terms of Service</span> and{' '}
              <span className="legal-link">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>

      {/* 
        ==================================================
        DESKTOP LOGIN LAYOUT (>= 768px)
        Polished 2-section layout:
        LEFT: Branding & visual preview
        RIGHT: Login card
        ==================================================
      */}
      <div className="desktop-login-view">
        {/* Top Minimal Nav */}
        <header className="desktop-login-header">
          <div className="desktop-brand-group">
            <div className="brand-icon-wrapper">
              <Sparkles size={20} />
            </div>
            <div>
              <span className="brand-title">HabitFlow</span>
              <span className="brand-badge" style={{ display: 'block' }}>PRECISION TRACKER</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button onClick={handleGuestLogin} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
              Instant Demo Mode
            </button>
          </div>
        </header>

        {/* 2-Column Split Main Area */}
        <div className="desktop-split-container">
          {/* Left Column: Product Value & Visual Preview */}
          <div className="desktop-split-left">
            <div className="hero-pill">
              <Sparkles size={15} />
              <span>Spreadsheet Precision • Modern SaaS Experience</span>
            </div>

            <h1 className="desktop-hero-title">
              Master your daily routines with <span className="highlight-text">visual precision</span>
            </h1>

            <p className="desktop-hero-desc">
              Inspired by high-performance habit spreadsheets. Track habits across weekly matrices, analyze monthly progress curves, and keep streaks alive with one-tap check-ins.
            </p>

            {/* Visual Habit Matrix Preview Card */}
            <div className="desktop-preview-box">
              <div className="preview-top-bar">
                <div className="mac-dots">
                  <span className="dot red" />
                  <span className="dot yellow" />
                  <span className="dot green" />
                </div>
                <span className="preview-bar-title">September 2026 Habit Matrix</span>
                <span className="preview-badge">Live Preview</span>
              </div>

              <div className="preview-content">
                <div className="preview-metrics-row">
                  <div className="preview-metric">
                    <span className="preview-metric-label">MONTHLY COMPLETION</span>
                    <span className="preview-metric-value">35.5%</span>
                  </div>
                  <div className="preview-metric">
                    <span className="preview-metric-label">TOP STREAK</span>
                    <span className="preview-metric-value highlight">23 Days 🔥</span>
                  </div>
                  <div className="preview-metric">
                    <span className="preview-metric-label">HABITS LOGGED</span>
                    <span className="preview-metric-value">9 Daily</span>
                  </div>
                </div>

                <div className="preview-habits-list">
                  {[
                    { icon: '⏰', name: 'Wake up at 6AM', pct: '77%', done: true, color: '#3b82f6' },
                    { icon: '💧', name: 'Drink 3L Water', pct: '57%', done: true, color: '#06b6d4' },
                    { icon: '🏋️‍♂️', name: 'Workout', pct: '56%', done: true, color: '#8b5cf6' },
                    { icon: '🧘', name: 'Meditation', pct: '40%', done: false, color: '#6366f1' },
                  ].map((h, i) => (
                    <div key={i} className="preview-habit-row">
                      <div className="preview-habit-info">
                        <span style={{ fontSize: '1.1rem' }}>{h.icon}</span>
                        <span className="preview-habit-name">{h.name}</span>
                      </div>
                      <div className="preview-habit-right">
                        <span className="preview-habit-pct">{h.pct}</span>
                        <div className={`preview-check ${h.done ? 'checked' : ''}`}>
                          {h.done && <Check size={13} strokeWidth={3} />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Centered Authentication Card */}
          <div className="desktop-split-right">
            <div className="desktop-auth-card">
              <div className="auth-card-header">
                <div className="brand-icon-wrapper" style={{ margin: '0 auto 16px', width: '48px', height: '48px' }}>
                  <Sparkles size={24} />
                </div>
                <h2 className="auth-card-title">Sign in to HabitFlow</h2>
                <p className="auth-card-subtitle">
                  Build consistency and gain deep insights into your routines
                </p>
              </div>

              <div className="auth-card-actions">
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoggingIn}
                  className="google-btn desktop-google-btn"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" className="google-svg">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <span>{isLoggingIn ? 'Connecting...' : 'Continue with Google'}</span>
                </button>

                <div className="auth-divider">
                  <span>or</span>
                </div>

                <button
                  onClick={handleGuestLogin}
                  className="btn btn-secondary desktop-demo-btn"
                >
                  <span>Launch Instant Demo Mode</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="auth-card-footer">
                <p>
                  By signing in, you agree to our{' '}
                  <span className="legal-link">Terms of Service</span> and{' '}
                  <span className="legal-link">Privacy Policy</span>.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '12px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  <ShieldCheck size={14} color="var(--accent-emerald)" />
                  <span>Secure Firebase Authentication & Private Isolation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
