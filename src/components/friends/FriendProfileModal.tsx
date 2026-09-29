import React from 'react';
import { 
  X, 
  Shield, 
  Calendar, 
  Flame, 
  CheckCircle2, 
  Activity, 
  UserMinus, 
  Lock 
} from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar';
import type { FriendViewProfile } from '../../types/friend';

interface FriendProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: FriendViewProfile | null;
  onRemoveFriend?: (friendUid: string) => void;
}

export const FriendProfileModal: React.FC<FriendProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onRemoveFriend,
}) => {
  if (!isOpen || !profile) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Recently';
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        className="card animate-scale-up"
        style={{
          width: '100%',
          maxWidth: '460px',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="card-header"
          style={{
            borderBottom: '1px solid var(--border-subtle)',
            padding: '16px 20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Friend Profile</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost"
            style={{ padding: '6px', borderRadius: '50%' }}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="card-body" style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* User Info Card */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <UserAvatar
              photoURL={profile.photoURL}
              displayName={profile.displayName}
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                border: '3px solid var(--primary-light)',
                objectFit: 'cover',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{profile.displayName}</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                  }}
                >
                  Friend
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Calendar size={13} /> Joined {formatDate(profile.memberSince)}
                </span>
              </div>
            </div>
          </div>

          {/* Privacy & Progress Section */}
          {profile.allowFriendsToSeeProgress && profile.stats ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  High-Level Progress Overview
                </p>
                <span style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                  Sharing Allowed
                </span>
              </div>

              {/* 3 Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div
                  style={{
                    padding: '12px 10px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-secondary)',
                    textAlign: 'center',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <Activity size={18} color="var(--primary)" style={{ margin: '0 auto 4px' }} />
                  <p style={{ fontSize: '1.15rem', fontWeight: 800 }}>{profile.stats.activeHabitCount}</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Active Goals</p>
                </div>

                <div
                  style={{
                    padding: '12px 10px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-secondary)',
                    textAlign: 'center',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <Flame size={18} color="var(--accent-amber)" style={{ margin: '0 auto 4px' }} />
                  <p style={{ fontSize: '1.15rem', fontWeight: 800 }}>{profile.stats.bestStreak}d</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Best Streak</p>
                </div>

                <div
                  style={{
                    padding: '12px 10px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-secondary)',
                    textAlign: 'center',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <CheckCircle2 size={18} color="var(--accent-emerald)" style={{ margin: '0 auto 4px' }} />
                  <p style={{ fontSize: '1.15rem', fontWeight: 800 }}>{profile.stats.completionRate}%</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Completion</p>
                </div>
              </div>

              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                🔒 HabitFlow Privacy Protection: Individual habit titles, personal notes, and specific check-in times are kept strictly private to each member.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <Lock size={20} color="var(--text-muted)" style={{ flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>Progress Hidden by Privacy Settings</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  This user has chosen to keep their habit progress and streak numbers private.
                </p>
              </div>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            {onRemoveFriend ? (
              <button
                type="button"
                onClick={() => {
                  onRemoveFriend(profile.uid);
                  onClose();
                }}
                className="btn btn-ghost"
                style={{ fontSize: '0.8rem', color: 'var(--accent-rose)', gap: '6px' }}
              >
                <UserMinus size={15} />
                <span>Remove Friend</span>
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem', padding: '8px 16px' }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
