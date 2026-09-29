import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  UserCheck, 
  Clock, 
  Check, 
  X, 
  UserMinus, 
  Sparkles, 
  ShieldCheck, 
  Eye
} from 'lucide-react';
import { useFriends } from '../context/FriendsContext';
import { UserAvatar } from '../components/common/UserAvatar';
import { FriendProfileModal } from '../components/friends/FriendProfileModal';
import { DeleteConfirmModal } from '../components/habits/DeleteConfirmModal';
import type { PublicUserProfile, FriendItem, FriendViewProfile, FriendRequest } from '../types/friend';

export const FriendsPage: React.FC = () => {
  const {
    friends,
    incomingRequests,
    outgoingRequests,
    loading,
    searchUsers,
    sendFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    getFriendProfile,
  } = useFriends();

  // Tab State: 'friends' | 'search' | 'requests'
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'search'>('friends');

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PublicUserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Selected Friend Profile Modal
  const [selectedFriendProfile, setSelectedFriendProfile] = useState<FriendViewProfile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Friend Removal State
  const [friendToRemove, setFriendToRemove] = useState<FriendItem | null>(null);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  // Search handler
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    try {
      setIsSearching(true);
      setHasSearched(true);
      const results = await searchUsers(query);
      setSearchResults(results);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleOpenFriendProfile = async (friend: FriendItem) => {
    const profile = await getFriendProfile(friend.friendUid);
    if (profile) {
      setSelectedFriendProfile({
        ...profile,
        friendSince: friend.friendSince,
      });
      setIsProfileModalOpen(true);
    }
  };

  // Helper to check relationship with a searched user
  type RelationshipStatus =
    | { type: 'friends' }
    | { type: 'outgoing'; requestId: string }
    | { type: 'incoming'; request: FriendRequest }
    | { type: 'none' };

  const getRelationshipStatus = (targetUid: string): RelationshipStatus => {
    if (friends.some((f) => f.friendUid === targetUid)) {
      return { type: 'friends' };
    }
    const outgoing = outgoingRequests.find((r) => r.toUserId === targetUid);
    if (outgoing) {
      return { type: 'outgoing', requestId: outgoing.id };
    }
    const incoming = incomingRequests.find((r) => r.fromUserId === targetUid);
    if (incoming) {
      return { type: 'incoming', request: incoming };
    }
    return { type: 'none' };
  };

  const totalRequestsCount = incomingRequests.length + outgoingRequests.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '960px' }}>
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Friends & Social
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Connect with friends, share accountability milestones, and cheer each other on.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '2px',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('friends')}
          className={`btn-ghost ${activeTab === 'friends' ? 'active' : ''}`}
          style={{
            padding: '10px 18px',
            fontSize: '0.9rem',
            fontWeight: 700,
            borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
            borderBottom: activeTab === 'friends' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'friends' ? 'var(--primary)' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Users size={17} />
          <span>My Friends</span>
          <span
            style={{
              fontSize: '0.72rem',
              padding: '2px 7px',
              borderRadius: '999px',
              backgroundColor: activeTab === 'friends' ? 'var(--primary-light)' : 'var(--bg-secondary)',
              color: activeTab === 'friends' ? 'var(--primary)' : 'var(--text-muted)',
            }}
          >
            {friends.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('requests')}
          className={`btn-ghost ${activeTab === 'requests' ? 'active' : ''}`}
          style={{
            padding: '10px 18px',
            fontSize: '0.9rem',
            fontWeight: 700,
            borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
            borderBottom: activeTab === 'requests' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'requests' ? 'var(--primary)' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Clock size={17} />
          <span>Requests</span>
          {totalRequestsCount > 0 && (
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '2px 7px',
                borderRadius: '999px',
                backgroundColor: incomingRequests.length > 0 ? 'var(--accent-rose)' : 'var(--primary-light)',
                color: incomingRequests.length > 0 ? '#fff' : 'var(--primary)',
              }}
            >
              {totalRequestsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('search')}
          className={`btn-ghost ${activeTab === 'search' ? 'active' : ''}`}
          style={{
            padding: '10px 18px',
            fontSize: '0.9rem',
            fontWeight: 700,
            borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
            borderBottom: activeTab === 'search' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'search' ? 'var(--primary)' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Search size={17} />
          <span>Find Friends</span>
        </button>
      </div>

      {/* ========================================================
          TAB 1: MY FRIENDS
          ======================================================== */}
      {activeTab === 'friends' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading friends...
            </div>
          ) : friends.length === 0 ? (
            <div className="card" style={{ padding: '48px 24px', textAlign: 'center' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <Users size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>No friends yet</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '420px', margin: '0 auto 20px' }}>
                Habit tracking is more fun and consistent together. Search for friends by username or display name to connect.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('search')}
                className="btn btn-primary"
                style={{ fontSize: '0.85rem', padding: '10px 20px', margin: '0 auto' }}
              >
                <Search size={15} />
                <span>Search for Friends</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {friends.map((friend) => (
                <div
                  key={friend.friendshipId}
                  className="card"
                  style={{
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <UserAvatar
                      photoURL={friend.friendPhotoURL}
                      displayName={friend.friendDisplayName}
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        border: '2px solid var(--border-subtle)',
                        objectFit: 'cover',
                      }}
                    />
                    <div style={{ overflow: 'hidden' }}>
                      <p style={{ fontWeight: 800, fontSize: '1rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {friend.friendDisplayName}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Friends since{' '}
                        {new Date(friend.friendSince).toLocaleDateString(undefined, {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                    <button
                      type="button"
                      onClick={() => handleOpenFriendProfile(friend)}
                      className="btn btn-secondary"
                      style={{ flex: 1, fontSize: '0.8rem', padding: '7px 12px', gap: '6px' }}
                    >
                      <Eye size={14} />
                      <span>View Profile</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setFriendToRemove(friend);
                        setIsRemoveModalOpen(true);
                      }}
                      className="btn-ghost"
                      style={{ padding: '7px 10px', color: 'var(--text-muted)' }}
                      title="Remove Friend"
                      aria-label="Remove friend"
                    >
                      <UserMinus size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 2: FRIEND REQUESTS (Incoming & Outgoing)
          ======================================================== */}
      {activeTab === 'requests' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Incoming Requests */}
          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">Incoming Friend Requests</h2>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Requests from members who want to connect with you
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '3px 9px',
                  borderRadius: '999px',
                  backgroundColor: incomingRequests.length > 0 ? 'var(--accent-rose)' : 'var(--bg-secondary)',
                  color: incomingRequests.length > 0 ? '#fff' : 'var(--text-muted)',
                }}
              >
                {incomingRequests.length} Pending
              </span>
            </div>

            <div className="card-body">
              {incomingRequests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 12px', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: '0.9rem' }}>No incoming requests right now.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {incomingRequests.map((req) => (
                    <div
                      key={req.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                        flexWrap: 'wrap',
                        gap: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <UserAvatar
                          photoURL={req.fromPhotoURL}
                          displayName={req.fromDisplayName}
                          style={{ width: '42px', height: '42px', borderRadius: '50%' }}
                        />
                        <div>
                          <p style={{ fontWeight: 800, fontSize: '0.95rem' }}>{req.fromDisplayName}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Sent{' '}
                            {new Date(req.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => acceptFriendRequest(req)}
                          className="btn btn-primary"
                          style={{ fontSize: '0.8rem', padding: '6px 14px', gap: '6px' }}
                        >
                          <Check size={14} />
                          <span>Accept</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => declineFriendRequest(req.id)}
                          className="btn btn-secondary"
                          style={{ fontSize: '0.8rem', padding: '6px 12px', gap: '6px' }}
                        >
                          <X size={14} />
                          <span>Decline</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Outgoing Requests */}
          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">Sent Requests</h2>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Requests you have sent waiting for response
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '3px 9px',
                  borderRadius: '999px',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-muted)',
                }}
              >
                {outgoingRequests.length} Sent
              </span>
            </div>

            <div className="card-body">
              {outgoingRequests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 12px', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: '0.9rem' }}>No pending sent requests.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {outgoingRequests.map((req) => (
                    <div
                      key={req.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                        flexWrap: 'wrap',
                        gap: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <UserAvatar
                          photoURL={req.toPhotoURL}
                          displayName={req.toDisplayName}
                          style={{ width: '42px', height: '42px', borderRadius: '50%' }}
                        />
                        <div>
                          <p style={{ fontWeight: 800, fontSize: '0.95rem' }}>{req.toDisplayName}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Pending response • Sent{' '}
                            {new Date(req.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => cancelFriendRequest(req.id)}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.8rem', padding: '6px 12px', gap: '6px' }}
                      >
                        <X size={14} />
                        <span>Cancel Request</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: FIND FRIENDS (Search)
          ======================================================== */}
      {activeTab === 'search' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Search Form Card */}
          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">Discover HabitFlow Members</h2>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Search by username or display name
                </span>
              </div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: 'var(--accent-emerald)',
                }}
              >
                <ShieldCheck size={14} />
                <span>Privacy-Safe Search</span>
              </span>
            </div>

            <div className="card-body">
              <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search
                    size={18}
                    style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                    }}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by display name..."
                    className="form-input"
                    style={{ width: '100%', paddingLeft: '40px' }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearching || !searchQuery.trim()}
                  className="btn btn-primary"
                  style={{ fontSize: '0.875rem', padding: '0 20px', gap: '6px' }}
                >
                  <Search size={15} />
                  <span>{isSearching ? 'Searching...' : 'Search'}</span>
                </button>
              </form>

              <div
                style={{
                  marginTop: '14px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                }}
              >
                <Sparkles size={14} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span>
                  Tip: Members with <strong>Private</strong> profiles are protected and will never appear in discovery or search.
                </span>
              </div>
            </div>
          </div>

          {/* Search Results */}
          {hasSearched && (
            <div className="card">
              <div className="card-header">
                <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Search Results</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {searchResults.length} {searchResults.length === 1 ? 'member' : 'members'} found
                </span>
              </div>

              <div className="card-body">
                {searchResults.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
                    <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>No members found</p>
                    <p style={{ fontSize: '0.8rem' }}>
                      Try searching with a different name or spelling. Remember that private accounts do not appear in search.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {searchResults.map((target) => {
                      const rel = getRelationshipStatus(target.uid);

                      return (
                        <div
                          key={target.uid}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '14px',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--bg-secondary)',
                            border: '1px solid var(--border-subtle)',
                            flexWrap: 'wrap',
                            gap: '12px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <UserAvatar
                              photoURL={target.photoURL}
                              displayName={target.displayName}
                              style={{ width: '48px', height: '48px', borderRadius: '50%' }}
                            />
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <p style={{ fontWeight: 800, fontSize: '1rem' }}>{target.displayName}</p>
                                <span
                                  style={{
                                    fontSize: '0.68rem',
                                    fontWeight: 700,
                                    padding: '2px 6px',
                                    borderRadius: '999px',
                                    backgroundColor:
                                      target.profileVisibility === 'public'
                                        ? 'rgba(2, 132, 199, 0.12)'
                                        : 'var(--primary-light)',
                                    color:
                                      target.profileVisibility === 'public'
                                        ? 'var(--accent-cyan)'
                                        : 'var(--primary)',
                                  }}
                                >
                                  {target.profileVisibility === 'public' ? 'Public Profile' : 'Friends Visibility'}
                                </span>
                              </div>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                Joined {new Date(target.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                              </p>
                            </div>
                          </div>

                          {/* Action Button depending on relationship status */}
                          <div>
                            {rel.type === 'friends' ? (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  fontSize: '0.8rem',
                                  fontWeight: 700,
                                  color: 'var(--accent-emerald)',
                                  padding: '6px 12px',
                                  borderRadius: '999px',
                                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                                }}
                              >
                                <UserCheck size={15} />
                                <span>Friends</span>
                              </span>
                            ) : rel.type === 'outgoing' ? (
                              <button
                                type="button"
                                onClick={() => cancelFriendRequest(rel.requestId)}
                                className="btn btn-secondary"
                                style={{ fontSize: '0.8rem', padding: '6px 14px', gap: '6px' }}
                              >
                                <Clock size={14} />
                                <span>Requested (Cancel)</span>
                              </button>
                            ) : rel.type === 'incoming' ? (
                              <button
                                type="button"
                                onClick={() => acceptFriendRequest(rel.request)}
                                className="btn btn-primary"
                                style={{ fontSize: '0.8rem', padding: '6px 14px', gap: '6px' }}
                              >
                                <Check size={14} />
                                <span>Accept Request</span>
                              </button>
                            ) : !target.allowFriendRequests ? (
                              <span
                                style={{
                                  fontSize: '0.75rem',
                                  color: 'var(--text-muted)',
                                  padding: '6px 12px',
                                  borderRadius: 'var(--radius-sm)',
                                  backgroundColor: 'var(--bg-surface)',
                                  border: '1px solid var(--border-subtle)',
                                }}
                              >
                                Requests Off
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => sendFriendRequest(target)}
                                className="btn btn-primary"
                                style={{ fontSize: '0.8rem', padding: '7px 14px', gap: '6px' }}
                              >
                                <UserPlus size={15} />
                                <span>Add Friend</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Friend Profile Modal */}
      <FriendProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={selectedFriendProfile}
        onRemoveFriend={(friendUid) => {
          const item = friends.find((f) => f.friendUid === friendUid);
          if (item) {
            setFriendToRemove(item);
            setIsRemoveModalOpen(true);
          }
        }}
      />

      {/* Remove Friend Confirmation Dialog */}
      <DeleteConfirmModal
        isOpen={isRemoveModalOpen}
        onClose={() => {
          setIsRemoveModalOpen(false);
          setFriendToRemove(null);
        }}
        title="Remove Friend"
        message={`Are you sure you want to remove ${friendToRemove?.friendDisplayName || 'this friend'} from your friends list?`}
        confirmLabel="Remove Friend"
        cancelLabel="Keep Friend"
        warningText="You will no longer be friends or see each other's social milestones."
        onConfirm={async () => {
          if (friendToRemove) {
            await removeFriend(friendToRemove.friendshipId);
          }
        }}
      />
    </div>
  );
};
