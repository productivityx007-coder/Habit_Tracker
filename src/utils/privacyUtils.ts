import type { UserPrivacySettings, UserProfile } from '../types/habit';
import { DEFAULT_PRIVACY_SETTINGS } from '../types/habit';

/**
 * Returns complete privacy settings with strict defaults applied for missing keys.
 */
export function getEffectivePrivacySettings(user?: UserProfile | null): UserPrivacySettings {
  if (!user || !user.privacy) {
    return { ...DEFAULT_PRIVACY_SETTINGS };
  }
  return {
    profileVisibility: user.privacy.profileVisibility || DEFAULT_PRIVACY_SETTINGS.profileVisibility,
    allowFriendRequests: typeof user.privacy.allowFriendRequests === 'boolean'
      ? user.privacy.allowFriendRequests
      : DEFAULT_PRIVACY_SETTINGS.allowFriendRequests,
    participateInLeaderboard: typeof user.privacy.participateInLeaderboard === 'boolean'
      ? user.privacy.participateInLeaderboard
      : DEFAULT_PRIVACY_SETTINGS.participateInLeaderboard,
    allowFriendsToSeeProgress: typeof user.privacy.allowFriendsToSeeProgress === 'boolean'
      ? user.privacy.allowFriendsToSeeProgress
      : DEFAULT_PRIVACY_SETTINGS.allowFriendsToSeeProgress,
  };
}

/**
 * Enforces the core privacy constraint:
 * Private users must NEVER appear in friend searches, recommendations, or member directories.
 */
export function canAppearInFriendSearch(privacy?: UserPrivacySettings | null): boolean {
  if (!privacy) return false;
  if (privacy.profileVisibility === 'private') return false;
  return Boolean(privacy.allowFriendRequests);
}

/**
 * Enforces the core privacy constraint:
 * Private users must NEVER appear on public or community leaderboards.
 */
export function canAppearOnLeaderboard(privacy?: UserPrivacySettings | null): boolean {
  if (!privacy) return false;
  if (privacy.profileVisibility === 'private') return false;
  return Boolean(privacy.participateInLeaderboard);
}

/**
 * Checks if friends are permitted to view the user's progress & completion history.
 * If the profile is private, progress is strictly hidden from everyone.
 */
export function canFriendsViewProgress(privacy?: UserPrivacySettings | null): boolean {
  if (!privacy) return false;
  if (privacy.profileVisibility === 'private') return false;
  return Boolean(privacy.allowFriendsToSeeProgress);
}
