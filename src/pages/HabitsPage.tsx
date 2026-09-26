import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Flame, 
  Edit3, 
  Archive, 
  Trash2, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHabits } from '../context/HabitContext';
import type { Habit } from '../types/habit';
import { AddEditHabitModal } from '../components/habits/AddEditHabitModal';
import { DeleteConfirmModal } from '../components/habits/DeleteConfirmModal';

export const HabitsPage: React.FC = () => {
  const { 
    habits, 
    updateHabit, 
    deleteHabit, 
    archiveHabit, 
    unarchiveHabit, 
    addHabit, 
    monthOverview 
  } = useHabits();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'active' | 'archived'>('active');
  const [sortBy, setSortBy] = useState<'name' | 'percentage' | 'streak'>('name');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deletingHabitId, setDeletingHabitId] = useState<string | null>(null);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Categories' },
    { id: 'productivity', label: 'Productivity' },
    { id: 'health', label: 'Health' },
    { id: 'fitness', label: 'Fitness' },
    { id: 'study', label: 'Study' },
    { id: 'mindfulness', label: 'Mindfulness' },
    { id: 'finance', label: 'Finance' },
  ];

  const filteredHabits = useMemo(() => {
    return habits
      .filter((h) => {
        if (statusFilter === 'active' && h.archived) return false;
        if (statusFilter === 'archived' && !h.archived) return false;
        if (selectedCategory !== 'all' && h.category !== selectedCategory) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = h.name.toLowerCase().includes(q);
          const matchDesc = h.description?.toLowerCase().includes(q);
          if (!matchName && !matchDesc) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const statsA = monthOverview.habitStats[a.id] || { percentage: 0, currentStreak: 0 };
        const statsB = monthOverview.habitStats[b.id] || { percentage: 0, currentStreak: 0 };

        if (sortBy === 'percentage') return statsB.percentage - statsA.percentage;
        if (sortBy === 'streak') return statsB.currentStreak - statsA.currentStreak;
        return a.name.localeCompare(b.name);
      });
  }, [habits, statusFilter, selectedCategory, searchQuery, sortBy, monthOverview]);

  const targetHabitToDelete = habits.find((h) => h.id === deletingHabitId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Habits Management
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Configure schedules, targets, and monitor your personal consistency.
          </p>
        </div>

        <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary">
          <Plus size={18} />
          <span>New Habit</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ width: '100%', paddingLeft: '38px' }}
              placeholder="Search habits by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Controls: Active/Archived, Category, Sort */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
            {/* Status tabs */}
            <div style={{ display: 'flex', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '3px' }}>
              <button
                type="button"
                onClick={() => setStatusFilter('active')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  backgroundColor: statusFilter === 'active' ? 'var(--bg-surface)' : 'transparent',
                  color: statusFilter === 'active' ? 'var(--primary)' : 'var(--text-muted)',
                  boxShadow: statusFilter === 'active' ? 'var(--shadow-sm)' : 'none',
                }}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('archived')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  backgroundColor: statusFilter === 'archived' ? 'var(--bg-surface)' : 'transparent',
                  color: statusFilter === 'archived' ? 'var(--primary)' : 'var(--text-muted)',
                  boxShadow: statusFilter === 'archived' ? 'var(--shadow-sm)' : 'none',
                }}
              >
                Archived
              </button>
            </div>

            {/* Category Dropdown */}
            <select
              className="custom-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              className="custom-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="name">Sort: Name (A-Z)</option>
              <option value="percentage">Sort: Completion Rate</option>
              <option value="streak">Sort: Streak Length</option>
            </select>
          </div>
        </div>
      </div>

      {/* Habits Grid */}
      {filteredHabits.length === 0 ? (
        <div className="card" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <Sparkles size={36} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px' }}>No habits found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '20px' }}>
            {searchQuery ? 'Try clearing your search query or adjusting your filters.' : 'Get started by creating your first daily habit!'}
          </p>
          <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary" style={{ margin: '0 auto' }}>
            <Plus size={16} />
            <span>Create a Habit</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredHabits.map((habit) => {
            const stats = monthOverview.habitStats[habit.id] || {
              completedCount: 0,
              goalCount: habit.goal,
              percentage: 0,
              currentStreak: 0,
            };

            return (
              <div key={habit.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="card-header" style={{ borderBottom: 'none', paddingBottom: '0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: habit.color ? `${habit.color}18` : 'var(--primary-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.4rem',
                      }}
                    >
                      {habit.icon}
                    </div>

                    <div>
                      <Link
                        to={`/habit/${habit.id}`}
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: 700,
                          color: 'inherit',
                          textDecoration: 'none',
                        }}
                      >
                        {habit.name}
                      </Link>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                          {habit.category}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>•</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {habit.frequency}
                        </span>
                      </div>
                    </div>
                  </div>

                  {stats.currentStreak > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        color: 'var(--accent-amber)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(245, 158, 11, 0.12)',
                      }}
                      title="Active streak"
                    >
                      <Flame size={14} />
                      <span>{stats.currentStreak}d</span>
                    </div>
                  )}
                </div>

                <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
                  {habit.description && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {habit.description}
                    </p>
                  )}

                  {/* Progress bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Monthly Goal: {habit.goal} days</span>
                      <span style={{ fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                        {stats.completedCount}/{habit.goal} ({stats.percentage}%)
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${Math.min(100, stats.percentage)}%`,
                          height: '100%',
                          backgroundColor: habit.color || 'var(--primary)',
                          borderRadius: '999px',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                    <button
                      onClick={() => setEditingHabit(habit)}
                      className="btn-ghost"
                      style={{ padding: '6px 10px', fontSize: '0.8rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      title="Edit habit"
                    >
                      <Edit3 size={14} />
                      <span>Edit</span>
                    </button>

                    {habit.archived ? (
                      <button
                        onClick={() => unarchiveHabit(habit.id)}
                        className="btn-ghost"
                        style={{ padding: '6px 10px', fontSize: '0.8rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-emerald)' }}
                        title="Restore habit"
                      >
                        <RotateCcw size={14} />
                        <span>Restore</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => archiveHabit(habit.id)}
                        className="btn-ghost"
                        style={{ padding: '6px 10px', fontSize: '0.8rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}
                        title="Archive habit"
                      >
                        <Archive size={14} />
                        <span>Archive</span>
                      </button>
                    )}

                    <button
                      onClick={() => setDeletingHabitId(habit.id)}
                      className="btn-ghost"
                      style={{ padding: '6px 10px', fontSize: '0.8rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-rose)' }}
                      title="Delete habit"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      <AddEditHabitModal
        isOpen={isAddModalOpen || Boolean(editingHabit)}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingHabit(null);
        }}
        initialHabit={editingHabit}
        onSave={async (data) => {
          if (editingHabit) {
            await updateHabit(editingHabit.id, data);
          } else {
            await addHabit(data);
          }
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingHabitId)}
        onClose={() => setDeletingHabitId(null)}
        title="Delete Habit"
        message={`Are you sure you want to delete "${targetHabitToDelete?.name}"? All historical completion data for this habit will be removed permanently.`}
        onConfirm={async () => {
          if (deletingHabitId) {
            await deleteHabit(deletingHabitId);
          }
        }}
      />
    </div>
  );
};
