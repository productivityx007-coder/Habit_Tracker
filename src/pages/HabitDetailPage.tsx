import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Flame, 
  Trophy, 
  Calendar, 
  Edit3, 
  Archive, 
  Trash2, 
  CheckCircle2,
  Clock,
  RotateCcw
} from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { getLastNDays } from '../utils/dateUtils';
import { AddEditHabitModal } from '../components/habits/AddEditHabitModal';
import { DeleteConfirmModal } from '../components/habits/DeleteConfirmModal';

export const HabitDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    habits, 
    completions, 
    updateHabit, 
    deleteHabit, 
    archiveHabit, 
    unarchiveHabit, 
    monthOverview 
  } = useHabits();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const habit = habits.find((h) => h.id === id);

  if (!habit) {
    return (
      <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px' }}>Habit Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>The habit you are looking for does not exist or was deleted.</p>
        <Link to="/habits" className="btn btn-primary">
          Back to Habits
        </Link>
      </div>
    );
  }

  const stats = monthOverview.habitStats[habit.id] || {
    completedCount: 0,
    goalCount: habit.goal,
    leftCount: habit.goal,
    percentage: 0,
    currentStreak: 0,
    bestStreak: 0,
  };

  const last30Days = getLastNDays(30);
  const habitCompletionDates = new Set(
    completions.filter((c) => c.habitId === habit.id && c.completed).map((c) => c.date)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top back navigation and actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost"
          style={{ paddingLeft: '8px' }}
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => setIsEditOpen(true)} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
            <Edit3 size={15} />
            <span>Edit</span>
          </button>

          {habit.archived ? (
            <button 
              onClick={async () => {
                await unarchiveHabit(habit.id);
              }} 
              className="btn btn-secondary" 
              style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)' }}
            >
              <RotateCcw size={15} />
              <span>Restore</span>
            </button>
          ) : (
            <button 
              onClick={async () => {
                await archiveHabit(habit.id);
              }} 
              className="btn btn-secondary" 
              style={{ fontSize: '0.85rem' }}
            >
              <Archive size={15} />
              <span>Archive</span>
            </button>
          )}

          <button onClick={() => setIsDeleteOpen(true)} className="btn btn-danger" style={{ fontSize: '0.85rem' }}>
            <Trash2 size={15} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Habit Header Card */}
      <div className="card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: habit.color ? `${habit.color}20` : 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              flexShrink: 0,
            }}
          >
            {habit.icon}
          </div>

          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{habit.name}</h1>
              {habit.archived && (
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                  ARCHIVED
                </span>
              )}
            </div>

            {habit.description && (
              <p style={{ color: 'var(--text-secondary)', marginTop: '6px', fontSize: '0.95rem', lineHeight: 1.5 }}>
                {habit.description}
              </p>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={15} />
                <span>Frequency: <strong style={{ color: 'var(--text-primary)' }}>{habit.frequency}</strong></span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={15} />
                <span>Goal: <strong style={{ color: 'var(--text-primary)' }}>{habit.goal} days/month</strong></span>
              </span>
              {habit.reminderEnabled && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={15} />
                  <span>Reminder: <strong style={{ color: 'var(--text-primary)' }}>{habit.reminderTime}</strong></span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)' }}>
            <Flame size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Current Streak</span>
            <span className="stat-value">{stats.currentStreak}d</span>
            <span className="stat-subtext">Active streak</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-purple)' }}>
            <Trophy size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Best Streak</span>
            <span className="stat-value">{stats.bestStreak}d</span>
            <span className="stat-subtext">All-time record</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Monthly Rate</span>
            <span className="stat-value">{stats.percentage}%</span>
            <span className="stat-subtext">{stats.completedCount} of {stats.goalCount} days</span>
          </div>
        </div>
      </div>

      {/* 30-Day Check-in Log */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent 30 Days Check-in Log</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Daily consistency</span>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
            {last30Days.map((d) => {
              const isDone = habitCompletionDates.has(d);
              return (
                <div
                  key={d}
                  style={{
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isDone ? 'var(--bg-secondary)' : 'var(--bg-surface)',
                    border: `1.5px solid ${isDone ? (habit.color || 'var(--accent-emerald)') : 'var(--border-subtle)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {d.slice(5)}
                  </span>
                  {isDone ? (
                    <span style={{ color: habit.color || 'var(--accent-emerald)', fontSize: '0.75rem', fontWeight: 800 }}>
                      DONE ✓
                    </span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>—</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AddEditHabitModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        initialHabit={habit}
        onSave={async (data) => {
          await updateHabit(habit.id, data);
        }}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Habit"
        message={`Delete "${habit.name}"? This cannot be undone.`}
        onConfirm={async () => {
          await deleteHabit(habit.id);
          navigate('/habits');
        }}
      />
    </div>
  );
};
