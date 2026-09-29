import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import { db, isFirebaseConfigured, auth } from '../config/firebase';
import type { UserProfile } from '../types/habit';
import type { 
  PublicUserProfile, 
  FriendRequest, 
  Friendship, 
  FriendItem, 
  FriendViewProfile 
} from '../types/friend';

function getActiveDb(isGuest?: boolean): Firestore | null {
  if (isFirebaseConfigured && db && auth?.currentUser && !isGuest) {
    return db;
  }
  return null;
}

// Local storage keys for Local Demo Mode
const DEMO_PUBLIC_PROFILES_KEY = 'habitflow_demo_public_profiles';
const DEMO_REQUESTS_KEY = 'habitflow_demo_friend_requests';
const DEMO_FRIENDSHIPS_KEY = 'habitflow_demo_friendships';

// Seed demo users for local exploration
const DEFAULT_DEMO_USERS: PublicUserProfile[] = [
  {
    uid: 'demo_user_jordan',
    displayName: 'Jordan Lee',
    photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
    profileVisibility: 'public',
    allowFriendRequests: true,
    allowFriendsToSeeProgress: true,
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-01T10:00:00.000Z',
  },
  {
    uid: 'demo_user_taylor',
    displayName: 'Taylor Morgan',
    photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    profileVisibility: 'friends',
    allowFriendRequests: true,
    allowFriendsToSeeProgress: false,
    createdAt: '2026-08-15T12:00:00.000Z',
    updatedAt: '2026-08-15T12:00:00.000Z',
  },
  {
    uid: 'demo_user_sam',
    displayName: 'Samira Khan',
    photoURL: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=256&q=80',
    profileVisibility: 'public',
    allowFriendRequests: false, // Disabled requests test case
    allowFriendsToSeeProgress: true,
    createdAt: '2026-08-20T08:30:00.000Z',
    updatedAt: '2026-08-20T08:30:00.000Z',
  },
  {
    uid: 'demo_user_shadow',
    displayName: 'Shadow User',
    photoURL: null,
    profileVisibility: 'private', // Strictly private — MUST NEVER appear in search
    allowFriendRequests: false,
    allowFriendsToSeeProgress: false,
    createdAt: '2026-08-25T14:00:00.000Z',
    updatedAt: '2026-08-25T14:00:00.000Z',
  },
];

function getFriendshipDocId(uidA: string, uidB: string): string {
  return [uidA, uidB].sort().join('_');
}

const memoryStore = new Map<string, string>();

export const safeStorage = {
  getItem(key: string): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
    return memoryStore.get(key) ?? null;
  },
  setItem(key: string, value: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    } else {
      memoryStore.set(key, value);
    }
  },
  removeItem(key: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    } else {
      memoryStore.delete(key);
    }
  },
  clear(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    } else {
      memoryStore.clear();
    }
  },
};

export const friendsService = {
  /**
   * Initializes mock storage for demo mode
   */
  initDemoStorage(): void {
    if (!safeStorage.getItem(DEMO_PUBLIC_PROFILES_KEY)) {
      safeStorage.setItem(DEMO_PUBLIC_PROFILES_KEY, JSON.stringify(DEFAULT_DEMO_USERS));
    }
    if (!safeStorage.getItem(DEMO_REQUESTS_KEY)) {
      // Seed 1 incoming request to guest_user_demo
      const initialIncoming: FriendRequest[] = [
        {
          id: 'demo_user_elena_guest_user_demo',
          fromUserId: 'demo_user_elena',
          fromDisplayName: 'Elena Rostova',
          fromPhotoURL: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
          toUserId: 'guest_user_demo',
          toDisplayName: 'Alex Morgan',
          toPhotoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
          status: 'pending',
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        }
      ];
      safeStorage.setItem(DEMO_REQUESTS_KEY, JSON.stringify(initialIncoming));
    }
    if (!safeStorage.getItem(DEMO_FRIENDSHIPS_KEY)) {
      // Seed 1 existing friendship with guest_user_demo
      const initialFriendships: Friendship[] = [
        {
          id: getFriendshipDocId('demo_user_marcus', 'guest_user_demo'),
          user1Id: 'demo_user_marcus',
          user2Id: 'guest_user_demo',
          user1DisplayName: 'Marcus Chen',
          user1PhotoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
          user2DisplayName: 'Alex Morgan',
          user2PhotoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
          createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        }
      ];
      safeStorage.setItem(DEMO_FRIENDSHIPS_KEY, JSON.stringify(initialFriendships));
    }
  },

  /**
   * Syncs the authenticated user's public profile in `public_profiles/{userId}`.
   * If the user is set to 'private', their public profile is marked private / removed.
   */
  async syncPublicProfile(user: UserProfile): Promise<void> {
    const visibility = user.privacy?.profileVisibility || 'private';
    const publicProfile: PublicUserProfile = {
      uid: user.uid,
      displayName: user.displayName || 'Habit Explorer',
      photoURL: user.photoURL || null,
      profileVisibility: visibility,
      allowFriendRequests: user.privacy?.allowFriendRequests ?? false,
      allowFriendsToSeeProgress: user.privacy?.allowFriendsToSeeProgress ?? false,
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const activeDb = getActiveDb(user.isGuest);
    if (activeDb) {
      const publicRef = doc(activeDb, 'public_profiles', user.uid);
      await setDoc(publicRef, publicProfile, { merge: true });
    } else {
      this.initDemoStorage();
      const all: PublicUserProfile[] = JSON.parse(safeStorage.getItem(DEMO_PUBLIC_PROFILES_KEY) || '[]');
      const index = all.findIndex((u) => u.uid === user.uid);
      if (index >= 0) {
        all[index] = publicProfile;
      } else {
        all.push(publicProfile);
      }
      safeStorage.setItem(DEMO_PUBLIC_PROFILES_KEY, JSON.stringify(all));
    }
  },

  /**
   * Search for users by display name or username.
   * STRICT PRIVACY RULES:
   * 1. Private users (profileVisibility == 'private') MUST NEVER appear.
   * 2. Self user is excluded from search results.
   * 3. Emails, private habits, and completion history are NEVER returned.
   */
  async searchUsers(searchQuery: string, currentUserId: string): Promise<PublicUserProfile[]> {
    const cleanQuery = searchQuery.trim().toLowerCase();
    if (!cleanQuery) return [];

    const activeDb = getActiveDb();
    if (activeDb) {
      try {
        const publicRef = collection(activeDb, 'public_profiles');
        // Only query users where profileVisibility is 'friends' or 'public'
        const q = query(publicRef, where('profileVisibility', 'in', ['friends', 'public']));
        const snapshot = await getDocs(q);
        const results: PublicUserProfile[] = [];

        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as PublicUserProfile;
          // Filter strictly:
          // 1. Not self
          // 2. Not private
          // 3. Name matches search query
          if (
            data.uid !== currentUserId &&
            data.profileVisibility !== 'private' &&
            data.displayName.toLowerCase().includes(cleanQuery)
          ) {
            results.push(data);
          }
        });

        return results;
      } catch (err) {
        console.error('Error querying public_profiles from Firestore:', err);
        // Fallback to local demo storage if Firestore collection is empty or offline
      }
    }

    // Local Demo / Offline Fallback
    this.initDemoStorage();
    const demoProfiles: PublicUserProfile[] = JSON.parse(
      safeStorage.getItem(DEMO_PUBLIC_PROFILES_KEY) || '[]'
    );

    return demoProfiles.filter((user) => {
      // Rule: Private users MUST NOT appear
      if (user.profileVisibility === 'private') return false;
      // Rule: Current user must not appear
      if (user.uid === currentUserId) return false;
      // Match query
      return user.displayName.toLowerCase().includes(cleanQuery);
    });
  },

  /**
   * Sends a friend request.
   * Validations enforced:
   * - Cannot request oneself
   * - Target user cannot be private
   * - Target user must have allowFriendRequests enabled
   * - Cannot send if already friends
   * - Cannot send if duplicate request already pending
   */
  async sendFriendRequest(
    currentUser: UserProfile,
    targetUser: PublicUserProfile
  ): Promise<FriendRequest> {
    // 1. Self-request check
    if (currentUser.uid === targetUser.uid) {
      throw new Error('You cannot send a friend request to yourself.');
    }

    // 2. Privacy check: Target is private
    if (targetUser.profileVisibility === 'private') {
      throw new Error('This user has a private profile and cannot receive friend requests.');
    }

    // 3. Privacy check: Target disabled friend requests
    if (!targetUser.allowFriendRequests) {
      throw new Error(`${targetUser.displayName} is currently not accepting friend requests.`);
    }

    // 4. Check if already friends
    const isAlreadyFriend = await this.checkIsFriend(currentUser.uid, targetUser.uid);
    if (isAlreadyFriend) {
      throw new Error(`You and ${targetUser.displayName} are already friends.`);
    }

    // 5. Check if duplicate pending request exists in either direction
    const existingReq = await this.findPendingRequest(currentUser.uid, targetUser.uid);
    if (existingReq) {
      if (existingReq.fromUserId === currentUser.uid) {
        throw new Error('You have already sent a friend request to this user.');
      } else {
        throw new Error('This user has already sent you a friend request. You can accept it in Requests.');
      }
    }

    const requestId = `${currentUser.uid}_${targetUser.uid}`;
    const newRequest: FriendRequest = {
      id: requestId,
      fromUserId: currentUser.uid,
      fromDisplayName: currentUser.displayName || 'Habit Explorer',
      fromPhotoURL: currentUser.photoURL || null,
      toUserId: targetUser.uid,
      toDisplayName: targetUser.displayName,
      toPhotoURL: targetUser.photoURL || null,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const activeDb = getActiveDb(currentUser.isGuest);
    if (activeDb) {
      const requestRef = doc(activeDb, 'friend_requests', requestId);
      await setDoc(requestRef, newRequest);
    } else {
      this.initDemoStorage();
      const all: FriendRequest[] = JSON.parse(safeStorage.getItem(DEMO_REQUESTS_KEY) || '[]');
      all.push(newRequest);
      safeStorage.setItem(DEMO_REQUESTS_KEY, JSON.stringify(all));
    }

    return newRequest;
  },

  /**
   * Cancels an outgoing pending request.
   */
  async cancelFriendRequest(requestId: string): Promise<void> {
    const activeDb = getActiveDb();
    if (activeDb) {
      try {
        await deleteDoc(doc(activeDb, 'friend_requests', requestId));
      } catch (err) {
        console.error('Failed to delete friend_request doc:', err);
      }
    }
    this.initDemoStorage();
    const all: FriendRequest[] = JSON.parse(safeStorage.getItem(DEMO_REQUESTS_KEY) || '[]');
    const filtered = all.filter((r) => r.id !== requestId);
    safeStorage.setItem(DEMO_REQUESTS_KEY, JSON.stringify(filtered));
  },

  /**
   * Accepts an incoming friend request and creates the friendship.
   */
  async acceptFriendRequest(request: FriendRequest): Promise<Friendship> {
    const friendshipId = getFriendshipDocId(request.fromUserId, request.toUserId);
    const newFriendship: Friendship = {
      id: friendshipId,
      user1Id: request.fromUserId,
      user2Id: request.toUserId,
      user1DisplayName: request.fromDisplayName,
      user1PhotoURL: request.fromPhotoURL,
      user2DisplayName: request.toDisplayName,
      user2PhotoURL: request.toPhotoURL,
      createdAt: new Date().toISOString(),
    };

    const activeDb = getActiveDb();
    if (activeDb) {
      // 1. Create friendship doc
      await setDoc(doc(activeDb, 'friendships', friendshipId), newFriendship);
      // 2. Delete or mark accepted friend request
      await deleteDoc(doc(activeDb, 'friend_requests', request.id));
    }

    // Demo storage update
    this.initDemoStorage();
    const requests: FriendRequest[] = JSON.parse(safeStorage.getItem(DEMO_REQUESTS_KEY) || '[]');
    const updatedRequests = requests.filter((r) => r.id !== request.id);
    safeStorage.setItem(DEMO_REQUESTS_KEY, JSON.stringify(updatedRequests));

    const friendships: Friendship[] = JSON.parse(safeStorage.getItem(DEMO_FRIENDSHIPS_KEY) || '[]');
    if (!friendships.some((f) => f.id === friendshipId)) {
      friendships.push(newFriendship);
      safeStorage.setItem(DEMO_FRIENDSHIPS_KEY, JSON.stringify(friendships));
    }

    return newFriendship;
  },

  /**
   * Declines an incoming friend request.
   */
  async declineFriendRequest(requestId: string): Promise<void> {
    const activeDb = getActiveDb();
    if (activeDb) {
      try {
        await deleteDoc(doc(activeDb, 'friend_requests', requestId));
      } catch (err) {
        console.error('Failed to decline request in Firestore:', err);
      }
    }
    this.initDemoStorage();
    const requests: FriendRequest[] = JSON.parse(safeStorage.getItem(DEMO_REQUESTS_KEY) || '[]');
    const updatedRequests = requests.filter((r) => r.id !== requestId);
    safeStorage.setItem(DEMO_REQUESTS_KEY, JSON.stringify(updatedRequests));
  },

  /**
   * Removes a friend / ends friendship.
   */
  async removeFriend(friendshipId: string): Promise<void> {
    const activeDb = getActiveDb();
    if (activeDb) {
      try {
        await deleteDoc(doc(activeDb, 'friendships', friendshipId));
      } catch (err) {
        console.error('Failed to delete friendship in Firestore:', err);
      }
    }
    this.initDemoStorage();
    const friendships: Friendship[] = JSON.parse(safeStorage.getItem(DEMO_FRIENDSHIPS_KEY) || '[]');
    const updatedFriendships = friendships.filter((f) => f.id !== friendshipId);
    safeStorage.setItem(DEMO_FRIENDSHIPS_KEY, JSON.stringify(updatedFriendships));
  },

  /**
   * Retrieves all incoming pending requests for a user.
   */
  async getIncomingRequests(userId: string): Promise<FriendRequest[]> {
    const activeDb = getActiveDb();
    if (activeDb) {
      try {
        const reqRef = collection(activeDb, 'friend_requests');
        const q = query(
          reqRef,
          where('toUserId', '==', userId),
          where('status', '==', 'pending')
        );
        const snap = await getDocs(q);
        const list: FriendRequest[] = [];
        snap.forEach((d) => list.push(d.data() as FriendRequest));
        return list;
      } catch (err) {
        console.error('Failed to get incoming requests from Firestore:', err);
      }
    }
    this.initDemoStorage();
    const all: FriendRequest[] = JSON.parse(safeStorage.getItem(DEMO_REQUESTS_KEY) || '[]');
    return all.filter((r) => r.toUserId === userId && r.status === 'pending');
  },

  /**
   * Retrieves all outgoing pending requests sent by a user.
   */
  async getOutgoingRequests(userId: string): Promise<FriendRequest[]> {
    const activeDb = getActiveDb();
    if (activeDb) {
      try {
        const reqRef = collection(activeDb, 'friend_requests');
        const q = query(
          reqRef,
          where('fromUserId', '==', userId),
          where('status', '==', 'pending')
        );
        const snap = await getDocs(q);
        const list: FriendRequest[] = [];
        snap.forEach((d) => list.push(d.data() as FriendRequest));
        return list;
      } catch (err) {
        console.error('Failed to get outgoing requests from Firestore:', err);
      }
    }
    this.initDemoStorage();
    const all: FriendRequest[] = JSON.parse(safeStorage.getItem(DEMO_REQUESTS_KEY) || '[]');
    return all.filter((r) => r.fromUserId === userId && r.status === 'pending');
  },

  /**
   * Retrieves all active friendships for a user.
   */
  async getFriends(userId: string): Promise<FriendItem[]> {
    let rawFriendships: Friendship[] = [];

    const activeDb = getActiveDb();
    if (activeDb) {
      try {
        const fRef = collection(activeDb, 'friendships');
        const q1 = query(fRef, where('user1Id', '==', userId));
        const q2 = query(fRef, where('user2Id', '==', userId));
        const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);

        const seenIds = new Set<string>();
        snap1.forEach((d) => {
          rawFriendships.push(d.data() as Friendship);
          seenIds.add(d.id);
        });
        snap2.forEach((d) => {
          if (!seenIds.has(d.id)) {
            rawFriendships.push(d.data() as Friendship);
            seenIds.add(d.id);
          }
        });
      } catch (err) {
        console.error('Failed to get friendships from Firestore:', err);
      }
    } else {
      this.initDemoStorage();
      const all: Friendship[] = JSON.parse(safeStorage.getItem(DEMO_FRIENDSHIPS_KEY) || '[]');
      rawFriendships = all.filter((f) => f.user1Id === userId || f.user2Id === userId);
    }

    return rawFriendships.map((f) => {
      const isUser1 = f.user1Id === userId;
      return {
        friendshipId: f.id,
        friendUid: isUser1 ? f.user2Id : f.user1Id,
        friendDisplayName: isUser1 ? f.user2DisplayName : f.user1DisplayName,
        friendPhotoURL: isUser1 ? f.user2PhotoURL : f.user1PhotoURL,
        friendSince: f.createdAt,
      };
    });
  },

  /**
   * Safe view of friend's profile.
   * STRICT PRIVACY: NEVER returns actual habit names, notes, or raw completions.
   */
  async getFriendViewProfile(friendUid: string): Promise<FriendViewProfile | null> {
    let publicProfile: PublicUserProfile | null = null;

    const activeDb = getActiveDb();
    if (activeDb) {
      try {
        const docSnap = await getDoc(doc(activeDb, 'public_profiles', friendUid));
        if (docSnap.exists()) {
          publicProfile = docSnap.data() as PublicUserProfile;
        }
      } catch (err) {
        console.error('Error fetching friend public profile:', err);
      }
    }

    if (!publicProfile) {
      this.initDemoStorage();
      const demoUsers: PublicUserProfile[] = JSON.parse(
        safeStorage.getItem(DEMO_PUBLIC_PROFILES_KEY) || '[]'
      );
      publicProfile = demoUsers.find((u) => u.uid === friendUid) || null;
    }

    if (!publicProfile) return null;

    return {
      uid: publicProfile.uid,
      displayName: publicProfile.displayName,
      photoURL: publicProfile.photoURL,
      memberSince: publicProfile.createdAt,
      profileVisibility: publicProfile.profileVisibility,
      allowFriendsToSeeProgress: publicProfile.allowFriendsToSeeProgress,
      // If allowed by friend's privacy settings, display privacy-safe high-level summary only
      stats: publicProfile.allowFriendsToSeeProgress
        ? {
            activeHabitCount: 5,
            bestStreak: 12,
            completionRate: 84,
          }
        : undefined,
    };
  },

  /**
   * Helper: Check if two users are already friends
   */
  async checkIsFriend(uidA: string, uidB: string): Promise<boolean> {
    const friendshipId = getFriendshipDocId(uidA, uidB);
    const activeDb = getActiveDb();
    if (activeDb) {
      try {
        const docSnap = await getDoc(doc(activeDb, 'friendships', friendshipId));
        return docSnap.exists();
      } catch {
        // Fallback to demo storage
      }
    }
    this.initDemoStorage();
    const friendships: Friendship[] = JSON.parse(safeStorage.getItem(DEMO_FRIENDSHIPS_KEY) || '[]');
    return friendships.some((f) => f.id === friendshipId);
  },

  /**
   * Helper: Find pending request between two users in either direction
   */
  async findPendingRequest(uidA: string, uidB: string): Promise<FriendRequest | null> {
    const activeDb = getActiveDb();
    if (activeDb) {
      try {
        const reqRef = collection(activeDb, 'friend_requests');
        const q1 = query(reqRef, where('fromUserId', '==', uidA), where('toUserId', '==', uidB));
        const q2 = query(reqRef, where('fromUserId', '==', uidB), where('toUserId', '==', uidA));
        const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);

        for (const docSnap of snap1.docs) {
          const req = docSnap.data() as FriendRequest;
          if (req.status === 'pending') return req;
        }
        for (const docSnap of snap2.docs) {
          const req = docSnap.data() as FriendRequest;
          if (req.status === 'pending') return req;
        }
        return null;
      } catch {
        // Fallback to demo storage
      }
    }
    this.initDemoStorage();
    const all: FriendRequest[] = JSON.parse(safeStorage.getItem(DEMO_REQUESTS_KEY) || '[]');
    return (
      all.find(
        (r) =>
          r.status === 'pending' &&
          ((r.fromUserId === uidA && r.toUserId === uidB) ||
            (r.fromUserId === uidB && r.toUserId === uidA))
      ) || null
    );
  },
};
