import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Table2, Users, BarChart3, Settings } from 'lucide-react';

export const MobileNav: React.FC = () => {
  return (
    <nav className="mobile-nav" aria-label="Mobile Navigation">
      <NavLink 
        to="/dashboard" 
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
      >
        <LayoutDashboard size={20} />
        <span>Today</span>
      </NavLink>

      <NavLink 
        to="/matrix" 
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
      >
        <Table2 size={20} />
        <span>Matrix</span>
      </NavLink>

      <NavLink 
        to="/friends" 
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
      >
        <Users size={20} />
        <span>Friends</span>
      </NavLink>

      <NavLink 
        to="/analytics" 
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
      >
        <BarChart3 size={20} />
        <span>Analytics</span>
      </NavLink>

      <NavLink 
        to="/settings" 
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
      >
        <Settings size={20} />
        <span>Settings</span>
      </NavLink>
    </nav>
  );
};
