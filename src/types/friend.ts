import type { ProfileVisibility } from './habit';

export interface PublicUserProfile {
  uid: string;
  displayName: string;
  photoURL: string | null;
  profileVisibility: ProfileVisibility;
  allowFriendRequests: boolean;
  allowFriendsToSeeProgress: boolean;
  createdAt: string;
  updatedAt: string;
}

export type FriendRequestStatus = 'pending' | 'accepted' | 'declined';

export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromDisplayName: string;
  fromPhotoURL: string | null;
  toUserId: string;
  toDisplayName: string;
  toPhotoURL: string | null;
  status: FriendRequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Friendship {
  id: string;
  user1Id: string;
  user2Id: string;
  user1DisplayName: string;
  user1PhotoURL: string | null;
  user2DisplayName: string;
  user2PhotoURL: string | null;
  createdAt: string;
}

export interface FriendItem {
  friendshipId: string;
  friendUid: string;
  friendDisplayName: string;
  friendPhotoURL: string | null;
  friendSince: string;
  allowFriendsToSeeProgress?: boolean;
  profileVisibility?: ProfileVisibility;
}

export interface FriendViewProfile {
  uid: string;
  displayName: string;
  photoURL: string | null;
  memberSince?: string;
  friendSince?: string;
  profileVisibility: ProfileVisibility;
  allowFriendsToSeeProgress: boolean;
  // NOTE: No private habit names or completion history are ever included
  stats?: {
    activeHabitCount: number;
    bestStreak: number;
    completionRate: number;
  };
}
