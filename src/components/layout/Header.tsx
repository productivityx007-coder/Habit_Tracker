import React, { useState, useEffect } from 'react';
import { Menu, Plus, Sun, Moon, Cloud, HardDrive } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatFriendlyDate, getTodayString } from '../../utils/dateUtils';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenAddHabit: () => void;
  isSidebarCollapsed?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onToggleSidebar, 
  onOpenAddHabit,
  isSidebarCollapsed = false
}) => {
  const { user, isFirebaseMode } = useAuth();
  const [isDark, setIsDark] = useState<boolean>(() => {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  });

  const todayStr = getTodayString();
  const friendlyToday = formatFriendlyDate(todayStr);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const toggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('habitflow_theme', nextTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('habitflow_theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
      setIsDark(savedTheme === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
      setIsDark(true);
    }
  }, []);

  return (
    <header className="app-header">
      <div className="header-left">
        <button 
          onClick={onToggleSidebar}
          className="header-hamburger-btn"
          title={isSidebarCollapsed ? 'Expand navigation' : 'Toggle navigation'}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>
        <div className="header-title-group">
          <h1>
            {getGreeting()}, {user?.displayName?.split(' ')[0] || 'Friend'} 👋
          </h1>
          <p className="header-subtitle">{friendlyToday}</p>
        </div>
      </div>

      <div className="header-right">
        {/* Sync Mode Badge */}
        <span 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.75rem',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: isFirebaseMode ? 'var(--success-bg)' : 'var(--bg-secondary)',
            color: isFirebaseMode ? 'var(--success-text)' : 'var(--text-muted)',
            fontWeight: 600,
          }}
          title={isFirebaseMode ? 'Syncing to Firebase Cloud' : 'Running in Local Storage Mode'}
        >
          {isFirebaseMode ? <Cloud size={14} /> : <HardDrive size={14} />}
          <span className="hide-on-mobile">{isFirebaseMode ? 'Cloud Synced' : 'Local Mode'}</span>
        </span>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="btn-ghost"
          style={{ padding: '8px', borderRadius: '50%' }}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Color Theme"
        >
          {isDark ? <Sun size={20} color="#fbbf24" /> : <Moon size={20} />}
        </button>

        {/* Quick Add Habit Button */}
        <button 
          onClick={onOpenAddHabit}
          className="btn btn-primary"
          style={{ padding: '8px 16px', fontSize: '0.875rem' }}
        >
          <Plus size={18} />
          <span>New Habit</span>
        </button>
      </div>
    </header>
  );
};
