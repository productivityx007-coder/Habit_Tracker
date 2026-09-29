import { describe, it, expect, beforeEach } from 'vitest';
import { friendsService, safeStorage } from '../services/friendsService';
import type { UserProfile } from '../types/habit';
import type { PublicUserProfile } from '../types/friend';

describe('Friends System & Social Privacy Engine', () => {
  const currentUser: UserProfile = {
    uid: 'test_user_alice',
    email: 'alice@example.com',
    displayName: 'Alice Builder',
    photoURL: 'https://example.com/alice.jpg',
    themePreference: 'system',
    weekStartsOn: 1,
    timezone: 'UTC',
    createdAt: '2026-09-01T00:00:00.000Z',
    privacy: {
      profileVisibility: 'public',
      allowFriendRequests: true,
      participateInLeaderboard: true,
      allowFriendsToSeeProgress: true,
    },
  };

  const publicBob: PublicUserProfile = {
    uid: 'test_user_bob',
    displayName: 'Bob Focus',
    photoURL: 'https://example.com/bob.jpg',
    profileVisibility: 'public',
    allowFriendRequests: true,
    allowFriendsToSeeProgress: true,
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
  };

  const friendsOnlyCharlie: PublicUserProfile = {
    uid: 'test_user_charlie',
    displayName: 'Charlie Runner',
    photoURL: null,
    profileVisibility: 'friends',
    allowFriendRequests: true,
    allowFriendsToSeeProgress: false,
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
  };

  const requestsOffDave: PublicUserProfile = {
    uid: 'test_user_dave',
    displayName: 'Dave Solitude',
    photoURL: null,
    profileVisibility: 'public',
    allowFriendRequests: false, // Disabled friend requests
    allowFriendsToSeeProgress: true,
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
  };

  const privateEve: PublicUserProfile = {
    uid: 'test_user_eve',
    displayName: 'Eve Stealth',
    photoURL: null,
    profileVisibility: 'private', // Strictly private
    allowFriendRequests: false,
    allowFriendsToSeeProgress: false,
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
  };

  beforeEach(() => {
    // Reset safeStorage demo tables before each test
    safeStorage.clear();
    safeStorage.setItem(
      'habitflow_demo_public_profiles',
      JSON.stringify([publicBob, friendsOnlyCharlie, requestsOffDave, privateEve])
    );
    safeStorage.setItem('habitflow_demo_friend_requests', JSON.stringify([]));
    safeStorage.setItem('habitflow_demo_friendships', JSON.stringify([]));
  });

  it('guarantees private users NEVER appear in user search results', async () => {
    // Search for "Eve" who is private
    const results = await friendsService.searchUsers('Eve', currentUser.uid);
    expect(results.length).toBe(0);

    // Search with empty or wildcard string to return all
    const allSearchable = await friendsService.searchUsers('e', currentUser.uid);
    const foundEve = allSearchable.some((u) => u.uid === privateEve.uid);
    expect(foundEve).toBe(false);

    // Bob (public) and Charlie (friends) should be discoverable
    const bobResults = await friendsService.searchUsers('Bob', currentUser.uid);
    expect(bobResults.length).toBe(1);
    expect(bobResults[0].uid).toBe(publicBob.uid);
    expect(bobResults[0].displayName).toBe('Bob Focus');
  });

  it('excludes the current user from their own search results', async () => {
    // Inject Alice into demo public profiles
    const profiles = JSON.parse(safeStorage.getItem('habitflow_demo_public_profiles') || '[]');
    profiles.push({
      uid: currentUser.uid,
      displayName: currentUser.displayName,
      photoURL: currentUser.photoURL,
      profileVisibility: 'public',
      allowFriendRequests: true,
      allowFriendsToSeeProgress: true,
      createdAt: '2026-09-01T00:00:00.000Z',
      updatedAt: '2026-09-01T00:00:00.000Z',
    });
    safeStorage.setItem('habitflow_demo_public_profiles', JSON.stringify(profiles));

    const results = await friendsService.searchUsers('Alice', currentUser.uid);
    expect(results.some((u) => u.uid === currentUser.uid)).toBe(false);
  });

  it('blocks sending a friend request to oneself', async () => {
    const selfProfile: PublicUserProfile = {
      uid: currentUser.uid,
      displayName: currentUser.displayName || 'Alice',
      photoURL: currentUser.photoURL,
      profileVisibility: 'public',
      allowFriendRequests: true,
      allowFriendsToSeeProgress: true,
      createdAt: '2026-09-01T00:00:00.000Z',
      updatedAt: '2026-09-01T00:00:00.000Z',
    };

    await expect(friendsService.sendFriendRequest(currentUser, selfProfile)).rejects.toThrow(
      'You cannot send a friend request to yourself.'
    );
  });

  it('blocks sending a friend request to private users', async () => {
    await expect(friendsService.sendFriendRequest(currentUser, privateEve)).rejects.toThrow(
      'This user has a private profile and cannot receive friend requests.'
    );
  });

  it('blocks sending a friend request when the target user disabled friend requests', async () => {
    await expect(friendsService.sendFriendRequest(currentUser, requestsOffDave)).rejects.toThrow(
      'Dave Solitude is currently not accepting friend requests.'
    );
  });

  it('blocks duplicate pending friend requests in both directions', async () => {
    // 1. Alice sends request to Bob
    await friendsService.sendFriendRequest(currentUser, publicBob);

    // 2. Alice tries to send another request to Bob -> blocked
    await expect(friendsService.sendFriendRequest(currentUser, publicBob)).rejects.toThrow(
      'You have already sent a friend request to this user.'
    );

    // 3. Bob tries to send request to Alice while one is pending -> informed to accept
    const bobUserProfile: UserProfile = {
      ...currentUser,
      uid: publicBob.uid,
      displayName: publicBob.displayName,
    };
    const alicePublicProfile: PublicUserProfile = {
      uid: currentUser.uid,
      displayName: currentUser.displayName || 'Alice',
      photoURL: currentUser.photoURL,
      profileVisibility: 'public',
      allowFriendRequests: true,
      allowFriendsToSeeProgress: true,
      createdAt: '2026-09-01T00:00:00.000Z',
      updatedAt: '2026-09-01T00:00:00.000Z',
    };

    await expect(friendsService.sendFriendRequest(bobUserProfile, alicePublicProfile)).rejects.toThrow(
      'This user has already sent you a friend request. You can accept it in Requests.'
    );
  });

  it('creates friendship when request is accepted and cleans up pending request', async () => {
    // Alice sends request to Bob
    const request = await friendsService.sendFriendRequest(currentUser, publicBob);

    // Verify request is pending in incoming for Bob and outgoing for Alice
    const incomingForBob = await friendsService.getIncomingRequests(publicBob.uid);
    expect(incomingForBob.length).toBe(1);
    expect(incomingForBob[0].id).toBe(request.id);

    const outgoingForAlice = await friendsService.getOutgoingRequests(currentUser.uid);
    expect(outgoingForAlice.length).toBe(1);

    // Bob accepts Alice's request
    const friendship = await friendsService.acceptFriendRequest(request);
    expect(friendship).toBeDefined();
    // Deterministic sorted ID
    expect(friendship.id).toBe([currentUser.uid, publicBob.uid].sort().join('_'));

    // Check pending requests are now empty
    const updatedIncoming = await friendsService.getIncomingRequests(publicBob.uid);
    expect(updatedIncoming.length).toBe(0);

    const updatedOutgoing = await friendsService.getOutgoingRequests(currentUser.uid);
    expect(updatedOutgoing.length).toBe(0);

    // Check friendship exists for both Alice and Bob
    const aliceFriends = await friendsService.getFriends(currentUser.uid);
    expect(aliceFriends.length).toBe(1);
    expect(aliceFriends[0].friendUid).toBe(publicBob.uid);
    expect(aliceFriends[0].friendDisplayName).toBe(publicBob.displayName);

    const bobFriends = await friendsService.getFriends(publicBob.uid);
    expect(bobFriends.length).toBe(1);
    expect(bobFriends[0].friendUid).toBe(currentUser.uid);

    // Check duplicate friendship is blocked if Alice tries to send a request to Bob now
    await expect(friendsService.sendFriendRequest(currentUser, publicBob)).rejects.toThrow(
      'You and Bob Focus are already friends.'
    );
  });

  it('removes pending request cleanly when declined without creating friendship', async () => {
    const request = await friendsService.sendFriendRequest(currentUser, friendsOnlyCharlie);

    const incoming = await friendsService.getIncomingRequests(friendsOnlyCharlie.uid);
    expect(incoming.length).toBe(1);

    // Charlie declines
    await friendsService.declineFriendRequest(request.id);

    const updatedIncoming = await friendsService.getIncomingRequests(friendsOnlyCharlie.uid);
    expect(updatedIncoming.length).toBe(0);

    const charlieFriends = await friendsService.getFriends(friendsOnlyCharlie.uid);
    expect(charlieFriends.length).toBe(0);

    const aliceFriends = await friendsService.getFriends(currentUser.uid);
    expect(aliceFriends.length).toBe(0);
  });

  it('removes friendship when either user ends friendship', async () => {
    const request = await friendsService.sendFriendRequest(currentUser, publicBob);
    const friendship = await friendsService.acceptFriendRequest(request);

    // Confirm friend is present
    let friends = await friendsService.getFriends(currentUser.uid);
    expect(friends.length).toBe(1);

    // Remove friend
    await friendsService.removeFriend(friendship.id);

    // Confirm friend is removed for both users
    friends = await friendsService.getFriends(currentUser.uid);
    expect(friends.length).toBe(0);

    const bobFriends = await friendsService.getFriends(publicBob.uid);
    expect(bobFriends.length).toBe(0);
  });

  it('respects progress sharing privacy when viewing friend profile', async () => {
    // View Bob (allowFriendsToSeeProgress = true)
    const bobProfile = await friendsService.getFriendViewProfile(publicBob.uid);
    expect(bobProfile).toBeDefined();
    expect(bobProfile?.displayName).toBe(publicBob.displayName);
    expect(bobProfile?.stats).toBeDefined();
    // NEVER contains private habit names or completions
    expect((bobProfile as any).habits).toBeUndefined();
    expect((bobProfile as any).completions).toBeUndefined();

    // View Charlie (allowFriendsToSeeProgress = false)
    const charlieProfile = await friendsService.getFriendViewProfile(friendsOnlyCharlie.uid);
    expect(charlieProfile).toBeDefined();
    expect(charlieProfile?.stats).toBeUndefined(); // Progress stats hidden
  });
});
