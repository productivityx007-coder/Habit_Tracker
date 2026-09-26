import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { AddEditHabitModal } from '../habits/AddEditHabitModal';
import { useHabits } from '../../context/HabitContext';

export const AppShell: React.FC = () => {
  // Session storage persistence for desktop collapsed state
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState<boolean>(() => {
    return sessionStorage.getItem('habitflow_sidebar_collapsed') === 'true';
  });

  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const { addHabit } = useHabits();

  // Save desktop collapsed state to session
  const toggleDesktopCollapse = () => {
    setIsDesktopCollapsed((prev) => {
      const next = !prev;
      sessionStorage.setItem('habitflow_sidebar_collapsed', String(next));
      return next;
    });
  };

  // Header Hamburger button action
  const handleToggleMenu = () => {
    if (window.innerWidth >= 1024) {
      toggleDesktopCollapse();
    } else {
      setIsMobileOpen((prev) => !prev);
    }
  };

  // Auto-close mobile drawer if resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileOpen]);

  return (
    <div className={`app-shell ${isDesktopCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar 
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        isCollapsed={isDesktopCollapsed}
        onToggleCollapse={toggleDesktopCollapse}
      />

      <div className="main-content">
        <Header 
          onToggleSidebar={handleToggleMenu}
          onOpenAddHabit={() => setIsAddModalOpen(true)}
          isSidebarCollapsed={isDesktopCollapsed}
        />

        <main className="page-container animate-fade-in">
          <Outlet context={{ onOpenAddHabit: () => setIsAddModalOpen(true) }} />
        </main>

        <MobileNav />
      </div>

      <AddEditHabitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={addHabit}
      />
    </div>
  );
};
