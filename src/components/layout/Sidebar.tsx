import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Table2, 
  CheckSquare, 
  CalendarDays, 
  BarChart3, 
  Settings, 
  Sparkles,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isMobileOpen, 
  onCloseMobile, 
  isCollapsed,
  onToggleCollapse
}) => {
  const { user, logout } = useAuth();

  // Close mobile drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        onCloseMobile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen, onCloseMobile]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/matrix', label: 'Habit Matrix', icon: Table2 },
    { to: '/habits', label: 'Manage Habits', icon: CheckSquare },
    { to: '/calendar', label: 'Calendar', icon: CalendarDays },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          className="drawer-overlay animate-fade-in" 
          onClick={onCloseMobile} 
          aria-label="Close menu overlay"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onCloseMobile();
          }}
        />
      )}

      {/* Sidebar / Mobile Drawer */}
      <aside 
        className={`app-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}
        aria-label="Main Navigation"
      >
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-content">
            <div className="brand-icon-wrapper" title="HabitFlow">
              <Sparkles size={20} />
            </div>
            {!isCollapsed && (
              <div className="brand-text-wrap">
                <span className="brand-title">HabitFlow</span>
                <span className="brand-badge">PRECISION TRACKER</span>
              </div>
            )}
          </div>

          {/* Mobile close button (only visible in mobile drawer) */}
          <button 
            onClick={onCloseMobile} 
            className="mobile-close-btn"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink 
                key={item.to}
                to={item.to} 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={onCloseMobile}
                title={isCollapsed ? item.label : undefined}
                data-tooltip={item.label}
              >
                <span className="nav-icon-wrap">
                  <Icon size={20} />
                </span>
                {!isCollapsed && <span className="nav-label">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Collapse toggle button for Desktop */}
        <div className="sidebar-collapse-bar">
          <button 
            type="button"
            onClick={onToggleCollapse}
            className="collapse-toggle-btn"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight size={18} /> : (
              <>
                <ChevronLeft size={18} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Collapse</span>
              </>
            )}
          </button>
        </div>

        {/* Footer User Profile & Logout */}
        <div className="sidebar-footer">
          {user && (
            <div className={`user-badge-container ${isCollapsed ? 'collapsed' : ''}`}>
              <img 
                src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.displayName || 'User')}`}
                alt="Avatar"
                className="user-avatar"
                title={isCollapsed ? `${user.displayName || 'Explorer'} (${user.isGuest ? 'Demo' : user.email})` : undefined}
              />
              {!isCollapsed && (
                <div className="user-info-text">
                  <p className="user-name">
                    {user.displayName || 'Explorer'}
                  </p>
                  <p className="user-role">
                    {user.isGuest ? 'Demo Mode' : user.email}
                  </p>
                </div>
              )}
              <button 
                onClick={logout} 
                className="btn-ghost logout-btn" 
                title="Log out"
                aria-label="Log out"
              >
                <LogOut size={17} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
