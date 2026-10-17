import React, { useState, useEffect, useRef } from 'react';
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
  LogOut,
  Upload,
  Shield,
  ShieldCheck,
  Lock,
  EyeOff,
  Users,
  Globe,
  Camera,
  Check,
  Save
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHabits } from '../context/HabitContext';
import { exportService } from '../services/exportService';
import { useToast } from '../components/common/Toast';
import { UserAvatar } from '../components/common/UserAvatar';
import { DeleteConfirmModal } from '../components/habits/DeleteConfirmModal';
import { compressImageFile, AVATAR_PRESETS } from '../utils/imageUtils';
import type { ProfileVisibility, UserPrivacySettings } from '../types/habit';
import { DEFAULT_PRIVACY_SETTINGS } from '../types/habit';

export const SettingsPage: React.FC = () => {
  const { user, isFirebaseMode, logout, deleteAccount, updateUserProfile } = useAuth();
  const { habits, completions, loadSampleData, clearAllData } = useHabits();
  const toast = useToast();

  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem('habitflow_theme') as any) || 'system';
  });

  // Profile Customization State
  const [displayNameInput, setDisplayNameInput] = useState<string>('');
  const [isSavingName, setIsSavingName] = useState<boolean>(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);
  const [showPresetPicker, setShowPresetPicker] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Privacy Settings State (initialized from user.privacy or default private)
  const [privacyDraft, setPrivacyDraft] = useState<UserPrivacySettings>(() => ({
    ...DEFAULT_PRIVACY_SETTINGS,
    ...(user?.privacy || {}),
  }));
  const [isSavingPrivacy, setIsSavingPrivacy] = useState<boolean>(false);

  // Sync user values on initial load or user change
  useEffect(() => {
    if (user) {
      setDisplayNameInput(user.displayName || '');
      setPrivacyDraft({
        ...DEFAULT_PRIVACY_SETTINGS,
        ...(user.privacy || {}),
      });
    }
  }, [user]);

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

  // Profile Handlers
  const handleSaveDisplayName = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = displayNameInput.trim();
    if (!trimmed) {
      toast.error('Display name cannot be empty.');
      return;
    }
    if (trimmed.length > 40) {
      toast.error('Display name must be 40 characters or fewer.');
      return;
    }

    try {
      setIsSavingName(true);
      await updateUserProfile({ displayName: trimmed });
      toast.success('Display name updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update display name.');
    } finally {
      setIsSavingName(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    try {
      setIsUploadingPhoto(true);
      const compressedDataUrl = await compressImageFile(file);
      await updateUserProfile({ customPhotoURL: compressedDataUrl });
      toast.success('Custom profile picture updated!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to process image file.');
    } finally {
      setIsUploadingPhoto(false);
      // Reset input value so user can re-select the same file if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSelectPreset = async (presetUrl: string) => {
    try {
      setIsUploadingPhoto(true);
      await updateUserProfile({ customPhotoURL: presetUrl });
      toast.success('Preset avatar selected!');
      setShowPresetPicker(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to set avatar preset.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleRemoveCustomPhoto = async () => {
    try {
      setIsUploadingPhoto(true);
      await updateUserProfile({ customPhotoURL: null });
      if (user?.googlePhotoURL) {
        toast.success('Custom photo removed. Restored Google profile photo.');
      } else {
        toast.success('Custom photo removed. Restored default avatar.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove custom photo.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Privacy Handlers
  const handleUpdatePrivacyVisibility = (visibility: ProfileVisibility) => {
    setPrivacyDraft((prev) => ({
      ...prev,
      profileVisibility: visibility,
    }));
  };

  const handleTogglePrivacySetting = (key: keyof Omit<UserPrivacySettings, 'profileVisibility'>) => {
    setPrivacyDraft((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSavePrivacySettings = async () => {
    try {
      setIsSavingPrivacy(true);
      await updateUserProfile({ privacy: privacyDraft });
      toast.success('Privacy settings saved successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save privacy settings.');
    } finally {
      setIsSavingPrivacy(false);
    }
  };

  // Determine current avatar source for badge indicator
  const hasCustomPhoto = Boolean(user?.customPhotoURL);
  const hasGooglePhoto = Boolean(!hasCustomPhoto && user?.googlePhotoURL);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '840px' }}>
      <div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Preferences & Settings
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Manage your personal profile, privacy visibility, visual appearance, and data exports.
        </p>
      </div>

      {/* FEATURE 1 — Account Profile & Customization Card */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Profile Customization</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Customize your public persona, display name, and avatar
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
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

            <button
              type="button"
              onClick={() => logout()}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '6px 12px', gap: '6px' }}
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Top Section: Avatar Preview & Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '20px',
              flexWrap: 'wrap',
              paddingBottom: '20px',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ position: 'relative' }}>
              <UserAvatar
                photoURL={user?.photoURL}
                displayName={user?.displayName}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  border: '3px solid var(--primary-light)',
                  boxShadow: 'var(--shadow-md)',
                  objectFit: 'cover',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  backgroundColor: 'var(--bg-surface)',
                  padding: '4px',
                  borderRadius: '50%',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  color: 'var(--primary)',
                }}
                title="Profile Photo"
              >
                <Camera size={14} />
              </span>
            </div>

            <div style={{ flex: 1, minWidth: '240px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{user?.displayName || 'Habit Explorer'}</h3>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      backgroundColor: hasCustomPhoto
                        ? 'var(--primary-light)'
                        : hasGooglePhoto
                        ? 'rgba(59, 130, 246, 0.15)'
                        : 'var(--bg-secondary)',
                      color: hasCustomPhoto
                        ? 'var(--primary)'
                        : hasGooglePhoto
                        ? 'var(--accent-cyan)'
                        : 'var(--text-muted)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {hasCustomPhoto ? 'Custom Picture' : hasGooglePhoto ? 'Google Account Photo' : 'Default Initials'}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Upload a custom photo, pick an avatar preset, or keep your linked Google account photo.
                </p>
              </div>

              {/* Avatar Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  style={{ display: 'none' }}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingPhoto}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '7px 12px', gap: '6px' }}
                >
                  <Upload size={14} />
                  <span>{isUploadingPhoto ? 'Processing...' : 'Upload Photo'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPresetPicker(!showPresetPicker)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '7px 12px', gap: '6px' }}
                >
                  <Sparkles size={14} />
                  <span>{showPresetPicker ? 'Close Presets' : 'Choose Preset'}</span>
                </button>

                {hasCustomPhoto && (
                  <button
                    type="button"
                    onClick={handleRemoveCustomPhoto}
                    disabled={isUploadingPhoto}
                    className="btn btn-ghost"
                    style={{ fontSize: '0.8rem', padding: '7px 12px', gap: '6px', color: 'var(--accent-rose)' }}
                    title="Remove custom photo and revert to Google profile photo"
                  >
                    <RotateCcw size={14} />
                    <span>Remove Custom Photo</span>
                  </button>
                )}
              </div>

              {/* Curated Presets Drawer */}
              {showPresetPicker && (
                <div
                  style={{
                    marginTop: '8px',
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '10px' }}>
                    Select a Preset Avatar:
                  </p>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {AVATAR_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(preset.url)}
                        title={preset.name}
                        style={{
                          background: 'none',
                          border: user?.customPhotoURL === preset.url ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                          borderRadius: '50%',
                          padding: '2px',
                          cursor: 'pointer',
                          transition: 'transform 0.15s ease',
                          display: 'flex',
                          backgroundColor: 'var(--bg-surface)',
                        }}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          style={{ width: '42px', height: '42px', borderRadius: '50%' }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Section: Form for Display Name & Read-only Google Email */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
            {/* Display Name Input */}
            <form onSubmit={handleSaveDisplayName} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="user-display-name" className="form-label">
                Display Name
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  id="user-display-name"
                  type="text"
                  className="form-input"
                  value={displayNameInput}
                  onChange={(e) => setDisplayNameInput(e.target.value)}
                  placeholder="Enter your display name"
                  maxLength={40}
                  style={{ flex: 1 }}
                />
                <button
                  type="submit"
                  disabled={isSavingName || displayNameInput.trim() === (user?.displayName || '')}
                  className="btn btn-primary"
                  style={{ fontSize: '0.85rem', padding: '0 16px', gap: '6px' }}
                >
                  <Save size={14} />
                  <span>{isSavingName ? 'Saving...' : 'Save'}</span>
                </button>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Visible to friends and on leaderboard if enabled. Maximum 40 characters.
              </span>
            </form>

            {/* Read-only Google Account Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label htmlFor="user-email-readonly" className="form-label">
                  Account Email
                </label>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  <Lock size={12} />
                  <span>Read-only</span>
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="user-email-readonly"
                  type="email"
                  className="form-input"
                  value={user?.email || 'guest@habitflow.app'}
                  readOnly
                  disabled
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--bg-secondary)',
                    opacity: 0.8,
                    cursor: 'not-allowed',
                    paddingRight: '36px',
                  }}
                />
                <Lock
                  size={15}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {user?.isGuest
                  ? 'Local guest account email cannot be changed.'
                  : 'Authenticated with Google. Email changes must be made via Google Account.'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE 2 — Privacy & Social Settings Card */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--accent-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2 className="card-title">Privacy & Social Settings</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Control your visibility, social discovery, and leaderboard participation
              </span>
            </div>
          </div>

          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '999px',
              backgroundColor:
                privacyDraft.profileVisibility === 'private'
                  ? 'rgba(16, 185, 129, 0.15)'
                  : privacyDraft.profileVisibility === 'friends'
                  ? 'var(--primary-light)'
                  : 'rgba(59, 130, 246, 0.15)',
              color:
                privacyDraft.profileVisibility === 'private'
                  ? 'var(--accent-emerald)'
                  : privacyDraft.profileVisibility === 'friends'
                  ? 'var(--primary)'
                  : 'var(--accent-cyan)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {privacyDraft.profileVisibility === 'private'
              ? 'Private Account (Active)'
              : privacyDraft.profileVisibility === 'friends'
              ? 'Friends Only (Active)'
              : 'Public Profile (Active)'}
          </span>
        </div>

        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Privacy Guarantee Reassurance Banner */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(79, 70, 229, 0.08)',
              border: '1px solid var(--primary-light)',
            }}
          >
            <Shield size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Privacy by Default Guarantee
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.45 }}>
                New accounts in HabitFlow remain strictly <strong>Private</strong> by default. When your profile is Private,
                you are completely hidden from member searches, cannot be found for friend requests, and are excluded from all leaderboards.
              </p>
            </div>
          </div>

          {/* Section: Profile Visibility Selection */}
          <div>
            <div style={{ marginBottom: '12px' }}>
              <label className="form-label" style={{ fontSize: '0.95rem' }}>
                Profile Visibility
              </label>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Choose who can view your profile information and habit activity.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              {/* Private Option */}
              <button
                type="button"
                onClick={() => handleUpdatePrivacyVisibility('private')}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  border: privacyDraft.profileVisibility === 'private'
                    ? '2px solid var(--accent-emerald)'
                    : '1px solid var(--border-subtle)',
                  backgroundColor: privacyDraft.profileVisibility === 'private'
                    ? 'var(--success-bg)'
                    : 'var(--bg-surface)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '8px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <EyeOff size={18} color="var(--accent-emerald)" />
                    <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>Private</span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '999px',
                      backgroundColor: 'rgba(16, 185, 129, 0.2)',
                      color: 'var(--accent-emerald)',
                    }}
                  >
                    Recommended
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  Completely hidden. You will never appear in friend discovery, search results, or community leaderboards.
                </p>
                {privacyDraft.profileVisibility === 'private' && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-emerald)', marginTop: '4px' }}>
                    <Check size={14} /> Selected
                  </span>
                )}
              </button>

              {/* Friends Option */}
              <button
                type="button"
                onClick={() => handleUpdatePrivacyVisibility('friends')}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  border: privacyDraft.profileVisibility === 'friends'
                    ? '2px solid var(--primary)'
                    : '1px solid var(--border-subtle)',
                  backgroundColor: privacyDraft.profileVisibility === 'friends'
                    ? 'var(--primary-light)'
                    : 'var(--bg-surface)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '8px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={18} color="var(--primary)" />
                  <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>Friends</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  Only approved friends can view your profile, see your streak milestones, and follow your journey.
                </p>
                {privacyDraft.profileVisibility === 'friends' && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', marginTop: '4px' }}>
                    <Check size={14} /> Selected
                  </span>
                )}
              </button>

              {/* Public Option */}
              <button
                type="button"
                onClick={() => handleUpdatePrivacyVisibility('public')}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  border: privacyDraft.profileVisibility === 'public'
                    ? '2px solid var(--accent-cyan)'
                    : '1px solid var(--border-subtle)',
                  backgroundColor: privacyDraft.profileVisibility === 'public'
                    ? 'rgba(2, 132, 199, 0.12)'
                    : 'var(--bg-surface)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '8px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Globe size={18} color="var(--accent-cyan)" />
                  <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>Public</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  Visible across the HabitFlow community. Other members can find you in search and send friend requests.
                </p>
                {privacyDraft.profileVisibility === 'public' && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-cyan)', marginTop: '4px' }}>
                    <Check size={14} /> Selected
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Section: Social Participation & Progress Toggles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label className="form-label" style={{ fontSize: '0.95rem' }}>
              Social Participation & Progress
            </label>

            {/* Toggle 1: Allow Friend Requests */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ flex: 1, minWidth: '220px' }}>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  Allow Friend Requests
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Permit other members to send you friend requests.
                  {privacyDraft.profileVisibility === 'private' && (
                    <span style={{ color: 'var(--accent-amber)', display: 'block', marginTop: '2px', fontWeight: 600 }}>
                      * Currently blocked: Profile is set to Private.
                    </span>
                  )}
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={privacyDraft.allowFriendRequests}
                onClick={() => handleTogglePrivacySetting('allowFriendRequests')}
                style={{
                  width: '46px',
                  height: '26px',
                  borderRadius: '999px',
                  backgroundColor: privacyDraft.allowFriendRequests ? 'var(--primary)' : 'var(--border-subtle)',
                  position: 'relative',
                  cursor: 'pointer',
                  border: 'none',
                  outline: 'none',
                  transition: 'background-color 0.2s ease',
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                    position: 'absolute',
                    top: '3px',
                    left: privacyDraft.allowFriendRequests ? '23px' : '3px',
                    transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }}
                />
              </button>
            </div>

            {/* Toggle 2: Participate in Leaderboard */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ flex: 1, minWidth: '220px' }}>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  Participate in Leaderboard
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Show your habit consistency streaks on community or friends leaderboards.
                  {privacyDraft.profileVisibility === 'private' && (
                    <span style={{ color: 'var(--accent-amber)', display: 'block', marginTop: '2px', fontWeight: 600 }}>
                      * Currently excluded: Private accounts are never shown on leaderboards.
                    </span>
                  )}
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={privacyDraft.participateInLeaderboard}
                onClick={() => handleTogglePrivacySetting('participateInLeaderboard')}
                style={{
                  width: '46px',
                  height: '26px',
                  borderRadius: '999px',
                  backgroundColor: privacyDraft.participateInLeaderboard ? 'var(--primary)' : 'var(--border-subtle)',
                  position: 'relative',
                  cursor: 'pointer',
                  border: 'none',
                  outline: 'none',
                  transition: 'background-color 0.2s ease',
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                    position: 'absolute',
                    top: '3px',
                    left: privacyDraft.participateInLeaderboard ? '23px' : '3px',
                    transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }}
                />
              </button>
            </div>

            {/* Toggle 3: Allow friends to see my progress */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ flex: 1, minWidth: '220px' }}>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  Allow friends to see my progress
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Enable approved friends to view your daily habit completions and monthly streaks.
                  {privacyDraft.profileVisibility === 'private' && (
                    <span style={{ color: 'var(--accent-amber)', display: 'block', marginTop: '2px', fontWeight: 600 }}>
                      * Currently hidden: Set visibility to Friends or Public to share progress.
                    </span>
                  )}
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={privacyDraft.allowFriendsToSeeProgress}
                onClick={() => handleTogglePrivacySetting('allowFriendsToSeeProgress')}
                style={{
                  width: '46px',
                  height: '26px',
                  borderRadius: '999px',
                  backgroundColor: privacyDraft.allowFriendsToSeeProgress ? 'var(--primary)' : 'var(--border-subtle)',
                  position: 'relative',
                  cursor: 'pointer',
                  border: 'none',
                  outline: 'none',
                  transition: 'background-color 0.2s ease',
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                    position: 'absolute',
                    top: '3px',
                    left: privacyDraft.allowFriendsToSeeProgress ? '23px' : '3px',
                    transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }}
                />
              </button>
            </div>
          </div>

          {/* Privacy Save Action */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              onClick={handleSavePrivacySettings}
              disabled={isSavingPrivacy}
              className="btn btn-primary"
              style={{ fontSize: '0.875rem', padding: '10px 20px', gap: '8px' }}
            >
              <Save size={15} />
              <span>{isSavingPrivacy ? 'Saving Privacy Settings...' : 'Save Privacy Settings'}</span>
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
