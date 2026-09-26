import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Laptop, 
  Download, 
  FileSpreadsheet, 
  Trash2, 
  RotateCcw,
  Sparkles,
  Cloud,
  HardDrive,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHabits } from '../context/HabitContext';
import { exportService } from '../services/exportService';
import { useToast } from '../components/common/Toast';
import { DeleteConfirmModal } from '../components/habits/DeleteConfirmModal';

export const SettingsPage: React.FC = () => {
  const { user, isFirebaseMode, logout, deleteAccount } = useAuth();
  const { habits, completions, loadSampleData, clearAllData } = useHabits();
  const toast = useToast();

  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem('habitflow_theme') as any) || 'system';
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    localStorage.setItem('habitflow_theme', newTheme);

    if (newTheme === 'system') {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', isSystemDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', newTheme);
    }
    toast.success(`Theme updated to ${newTheme} mode`);
  };

  const handleExportJSON = () => {
    exportService.exportToJSON(habits, completions, user?.displayName || 'User');
    toast.success('Habit data exported to JSON!');
  };

  const handleExportCSV = () => {
    exportService.exportToCSV(habits, completions);
    toast.success('Completion history exported to CSV!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
      <div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Preferences & Settings
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Manage your account profile, visual appearance, and data exports.
        </p>
      </div>

      {/* Account Profile Card */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Account Profile</h2>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              padding: '4px 10px',
              borderRadius: '999px',
              backgroundColor: isFirebaseMode ? 'var(--success-bg)' : 'var(--bg-secondary)',
              color: isFirebaseMode ? 'var(--success-text)' : 'var(--text-muted)',
              fontWeight: 700,
            }}
          >
            {isFirebaseMode ? <Cloud size={14} /> : <HardDrive size={14} />}
            <span>{isFirebaseMode ? 'Firebase Cloud Connected' : 'Local Demo Mode'}</span>
          </span>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img
                src={user?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.displayName || 'User')}`}
                alt="Avatar"
                style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2px solid var(--border-subtle)' }}
              />
              <div>
                <p style={{ fontSize: '1.1rem', fontWeight: 800 }}>{user?.displayName || 'Habit Explorer'}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user?.email || 'Guest Explorer'}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Account Mode: {user?.isGuest ? 'Demo Account' : 'Authenticated Google Account'}
                </p>
              </div>
            </div>

            <button
              onClick={() => logout()}
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem' }}
            >
              <LogOut size={15} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Theme Appearance Card */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Theme & Appearance</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Choose your aesthetic</span>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <button
              type="button"
              onClick={() => handleThemeChange('light')}
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                border: theme === 'light' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                backgroundColor: theme === 'light' ? 'var(--primary-light)' : 'var(--bg-surface)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <Sun size={24} color={theme === 'light' ? 'var(--primary)' : 'var(--text-muted)'} />
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: theme === 'light' ? 'var(--primary)' : 'inherit' }}>
                Light
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleThemeChange('dark')}
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                border: theme === 'dark' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                backgroundColor: theme === 'dark' ? 'var(--primary-light)' : 'var(--bg-surface)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <Moon size={24} color={theme === 'dark' ? 'var(--primary)' : 'var(--text-muted)'} />
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: theme === 'dark' ? 'var(--primary)' : 'inherit' }}>
                Dark
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleThemeChange('system')}
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                border: theme === 'system' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                backgroundColor: theme === 'system' ? 'var(--primary-light)' : 'var(--bg-surface)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <Laptop size={24} color={theme === 'system' ? 'var(--primary)' : 'var(--text-muted)'} />
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: theme === 'system' ? 'var(--primary)' : 'inherit' }}>
                System
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Data Export & Backup */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Data Backup & Export</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Keep your data safe</span>
        </div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Export your complete habit library and check-in history directly to your device for offline spreadsheet analysis or archiving.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <button onClick={handleExportCSV} className="btn btn-secondary">
              <FileSpreadsheet size={16} />
              <span>Export CSV (Spreadsheet Format)</span>
            </button>
            <button onClick={handleExportJSON} className="btn btn-secondary">
              <Download size={16} />
              <span>Export JSON (Raw Data)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Development & Reference Data Card */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Demo & Reference Data</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Reset or Reload</span>
        </div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Quickly reload the exact 9 habits and completion records from the reference spreadsheet screenshots (September 2026).
          </p>
          <div>
            <button onClick={loadSampleData} className="btn btn-primary" style={{ fontSize: '0.875rem' }}>
              <Sparkles size={16} />
              <span>Load Reference Data (Sep 2026)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone Card */}
      <div className="card" style={{ borderColor: 'rgba(244, 63, 94, 0.3)' }}>
        <div className="card-header" style={{ color: 'var(--accent-rose)' }}>
          <h2 className="card-title">Danger Zone</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-rose)' }}>Irreversible actions</span>
        </div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>Reset All Habit Data</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Remove all habits and daily logs for this user</p>
            </div>
            <button onClick={() => setIsResetModalOpen(true)} className="btn btn-danger" style={{ fontSize: '0.85rem' }}>
              <RotateCcw size={15} />
              <span>Reset Data</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>Delete Account</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Permanently erase your account and session data</p>
            </div>
            <button onClick={() => setIsDeleteModalOpen(true)} className="btn btn-danger" style={{ fontSize: '0.85rem' }}>
              <Trash2 size={15} />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <DeleteConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset All Data"
        message="Are you sure you want to reset all your habits and check-in history? This will give you a clean slate."
        onConfirm={async () => {
          await clearAllData();
        }}
      />

      {/* Delete Account Dialog */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Account"
        message="Are you sure you want to delete your entire account and all associated habit tracking history? You will be logged out immediately."
        onConfirm={async () => {
          await deleteAccount();
        }}
      />
    </div>
  );
};
