import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '../components/common/Toast';
import { friendsService } from '../services/friendsService';
import type { 
  FriendItem, 
  FriendRequest, 
  PublicUserProfile, 
  FriendViewProfile 
} from '../types/friend';

interface FriendsContextType {
  friends: FriendItem[];
  incomingRequests: FriendRequest[];
  outgoingRequests: FriendRequest[];
  loading: boolean;
  refreshFriends: () => Promise<void>;
  searchUsers: (query: string) => Promise<PublicUserProfile[]>;
  sendFriendRequest: (targetUser: PublicUserProfile) => Promise<void>;
  cancelFriendRequest: (requestId: string) => Promise<void>;
  acceptFriendRequest: (request: FriendRequest) => Promise<void>;
  declineFriendRequest: (requestId: string) => Promise<void>;
  removeFriend: (friendshipId: string) => Promise<void>;
  getFriendProfile: (friendUid: string) => Promise<FriendViewProfile | null>;
}

const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

export const FriendsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const toast = useToast();

  const [friends, setFriends] = useState<FriendItem[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshFriends = useCallback(async () => {
    if (!user) {
      setFriends([]);
      setIncomingRequests([]);
      setOutgoingRequests([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Sync user's public profile if needed
      await friendsService.syncPublicProfile(user);

      const [friendList, incoming, outgoing] = await Promise.all([
        friendsService.getFriends(user.uid),
        friendsService.getIncomingRequests(user.uid),
        friendsService.getOutgoingRequests(user.uid),
      ]);

      setFriends(friendList);
      setIncomingRequests(incoming);
      setOutgoingRequests(outgoing);
    } catch (err) {
      console.error('Failed to load friends state:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshFriends();
  }, [refreshFriends]);

  const searchUsers = async (query: string): Promise<PublicUserProfile[]> => {
    if (!user) return [];
    return friendsService.searchUsers(query, user.uid);
  };

  const sendFriendRequest = async (targetUser: PublicUserProfile) => {
    if (!user) return;
    try {
      await friendsService.sendFriendRequest(user, targetUser);
      toast.success(`Friend request sent to ${targetUser.displayName}!`);
      await refreshFriends();
    } catch (err: any) {
      toast.error(err.message || 'Failed to send friend request.');
      throw err;
    }
  };

  const cancelFriendRequest = async (requestId: string) => {
    try {
      await friendsService.cancelFriendRequest(requestId);
      toast.success('Friend request cancelled.');
      await refreshFriends();
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel request.');
      throw err;
    }
  };

  const acceptFriendRequest = async (request: FriendRequest) => {
    try {
      await friendsService.acceptFriendRequest(request);
      toast.success(`You and ${request.fromDisplayName} are now friends! 🎉`);
      await refreshFriends();
    } catch (err: any) {
      toast.error(err.message || 'Failed to accept friend request.');
      throw err;
    }
  };

  const declineFriendRequest = async (requestId: string) => {
    try {
      await friendsService.declineFriendRequest(requestId);
      toast.success('Friend request declined.');
      await refreshFriends();
    } catch (err: any) {
      toast.error(err.message || 'Failed to decline request.');
      throw err;
    }
  };

  const removeFriend = async (friendshipId: string) => {
    try {
      await friendsService.removeFriend(friendshipId);
      toast.success('Friend removed.');
      await refreshFriends();
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove friend.');
      throw err;
    }
  };

  const getFriendProfile = async (friendUid: string): Promise<FriendViewProfile | null> => {
    return friendsService.getFriendViewProfile(friendUid);
  };

  return (
    <FriendsContext.Provider
      value={{
        friends,
        incomingRequests,
        outgoingRequests,
        loading,
        refreshFriends,
        searchUsers,
        sendFriendRequest,
        cancelFriendRequest,
        acceptFriendRequest,
        declineFriendRequest,
        removeFriend,
        getFriendProfile,
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
};

export const useFriends = (): FriendsContextType => {
  const context = useContext(FriendsContext);
  if (!context) {
    throw new Error('useFriends must be used within a FriendsProvider');
  }
  return context;
};
