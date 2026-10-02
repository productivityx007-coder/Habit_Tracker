import { describe, it, expect } from 'vitest';
import { DEFAULT_PRIVACY_SETTINGS } from '../types/habit';
import {
  getEffectivePrivacySettings,
  canAppearInFriendSearch,
  canAppearOnLeaderboard,
  canFriendsViewProgress,
} from './privacyUtils';
import type { UserProfile, UserPrivacySettings } from '../types/habit';

describe('Privacy Settings & Social Visibility Engine', () => {
  it('enforces strict private defaults for new and unconfigured users', () => {
    expect(DEFAULT_PRIVACY_SETTINGS.profileVisibility).toBe('private');
    expect(DEFAULT_PRIVACY_SETTINGS.allowFriendRequests).toBe(false);
    expect(DEFAULT_PRIVACY_SETTINGS.participateInLeaderboard).toBe(false);
    expect(DEFAULT_PRIVACY_SETTINGS.allowFriendsToSeeProgress).toBe(false);

    const userWithoutPrivacy: UserProfile = {
      uid: 'user_1',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: null,
      themePreference: 'system',
      weekStartsOn: 1,
      timezone: 'UTC',
      createdAt: '2026-09-29T00:00:00.000Z',
    };

    const effective = getEffectivePrivacySettings(userWithoutPrivacy);
    expect(effective.profileVisibility).toBe('private');
    expect(effective.allowFriendRequests).toBe(false);
    expect(effective.participateInLeaderboard).toBe(false);
    expect(effective.allowFriendsToSeeProgress).toBe(false);
  });

  it('guarantees private users NEVER appear in friend searches even if toggle is ON', () => {
    const privateSettingsWithToggleOn: UserPrivacySettings = {
      profileVisibility: 'private',
      allowFriendRequests: true,
      participateInLeaderboard: true,
      allowFriendsToSeeProgress: true,
    };

    expect(canAppearInFriendSearch(privateSettingsWithToggleOn)).toBe(false);
    expect(canAppearInFriendSearch(null)).toBe(false);
    expect(canAppearInFriendSearch(undefined)).toBe(false);
  });

  it('guarantees private users NEVER appear on leaderboards even if participate is ON', () => {
    const privateSettingsWithLeaderboardOn: UserPrivacySettings = {
      profileVisibility: 'private',
      allowFriendRequests: true,
      participateInLeaderboard: true,
      allowFriendsToSeeProgress: true,
    };

    expect(canAppearOnLeaderboard(privateSettingsWithLeaderboardOn)).toBe(false);
    expect(canAppearOnLeaderboard(null)).toBe(false);
  });

  it('guarantees private users NEVER expose progress even if friends progress toggle is ON', () => {
    const privateSettings: UserPrivacySettings = {
      profileVisibility: 'private',
      allowFriendRequests: false,
      participateInLeaderboard: false,
      allowFriendsToSeeProgress: true,
    };

    expect(canFriendsViewProgress(privateSettings)).toBe(false);
  });

  it('permits friend search and leaderboard appearance when visibility is Friends or Public and toggles are enabled', () => {
    const publicSettings: UserPrivacySettings = {
      profileVisibility: 'public',
      allowFriendRequests: true,
      participateInLeaderboard: true,
      allowFriendsToSeeProgress: true,
    };

    expect(canAppearInFriendSearch(publicSettings)).toBe(true);
    expect(canAppearOnLeaderboard(publicSettings)).toBe(true);
    expect(canFriendsViewProgress(publicSettings)).toBe(true);

    const friendsOnlySettings: UserPrivacySettings = {
      profileVisibility: 'friends',
      allowFriendRequests: true,
      participateInLeaderboard: false,
      allowFriendsToSeeProgress: true,
    };

    expect(canAppearInFriendSearch(friendsOnlySettings)).toBe(true);
    expect(canAppearOnLeaderboard(friendsOnlySettings)).toBe(false);
    expect(canFriendsViewProgress(friendsOnlySettings)).toBe(true);
  });

  it('handles partial privacy settings safely', () => {
    const userWithPartialPrivacy: UserProfile = {
      uid: 'user_2',
      email: 'partial@example.com',
      displayName: 'Partial User',
      photoURL: null,
      themePreference: 'system',
      weekStartsOn: 1,
      timezone: 'UTC',
      createdAt: '2026-09-29T00:00:00.000Z',
      privacy: {
        profileVisibility: 'public',
      } as any,
    };

    const effective = getEffectivePrivacySettings(userWithPartialPrivacy);
    expect(effective.profileVisibility).toBe('public');
    // Missing boolean toggles must default to false
    expect(effective.allowFriendRequests).toBe(false);
    expect(effective.participateInLeaderboard).toBe(false);
    expect(effective.allowFriendsToSeeProgress).toBe(false);
  });
});
