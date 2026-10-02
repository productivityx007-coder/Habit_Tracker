import React from 'react';
import { Check, Plus, Minus, Flame, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHabits } from '../../context/HabitContext';
import { getTodayString, formatFriendlyDate } from '../../utils/dateUtils';
import { isHabitScheduledOnDate } from '../../utils/analyticsUtils';

interface TodayHabitsListProps {
  onOpenAddHabit: () => void;
}

export const TodayHabitsList: React.FC<TodayHabitsListProps> = ({ onOpenAddHabit }) => {
  const {
    habits,
    completions,
    toggleHabitCompletion,
    updateHabitNumericValue,
    monthOverview,
    todayStr: contextTodayStr,
  } = useHabits();

  const todayStr = contextTodayStr || getTodayString();
  const friendlyDate = formatFriendlyDate(todayStr);
  const activeHabits = habits.filter((h) => !h.archived);
  const scheduledToday = activeHabits.filter((h) => isHabitScheduledOnDate(h, todayStr));

  // Completion map for today
  const todayCompletions = new Map<string, { completed: boolean; value: number }>();
  completions.forEach((c) => {
    if (c.date === todayStr) {
      todayCompletions.set(c.habitId, { completed: c.completed, value: c.value });
    }
  });

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Today's Focus Checklist</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {friendlyDate} • One-tap daily check-in to build lasting habits
          </span>
        </div>
        <Link to="/matrix" className="btn btn-ghost" style={{ fontSize: '0.825rem', gap: '4px' }}>
          <span>View Matrix</span>
          <ArrowRight size={15} />
        </Link>
      </div>

      <div className="card-body" style={{ padding: '16px 20px' }}>
        {scheduledToday.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 16px' }}>
            <p style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
              No habits scheduled for today!
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '16px' }}>
              Take a breather or add a new goal to track.
            </p>
            <button onClick={onOpenAddHabit} className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
              <Plus size={16} />
              <span>Create a Habit</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
            {scheduledToday.map((habit) => {
              const rec = todayCompletions.get(habit.id);
              const isDone = Boolean(rec?.completed);
              const currentValue = rec?.value || 0;
              const stats = monthOverview.habitStats[habit.id];

              return (
                <div
                  key={habit.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isDone ? 'var(--bg-secondary)' : 'var(--bg-surface)',
                    border: `1.5px solid ${isDone ? 'var(--accent-emerald)' : 'var(--border-subtle)'}`,
                    transition: 'all 0.2s ease',
                    boxShadow: isDone ? 'none' : 'var(--shadow-sm)',
                    opacity: isDone ? 0.92 : 1,
                  }}
                >
                  {/* Left: Icon, Name, Category */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: habit.color ? `${habit.color}18` : 'var(--primary-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.35rem',
                        flexShrink: 0,
                      }}
                    >
                      {habit.icon}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <Link
                        to={`/habit/${habit.id}`}
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          color: 'inherit',
                          textDecoration: 'none',
                          display: 'block',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {habit.name}
                      </Link>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            color: 'var(--text-muted)',
                            letterSpacing: '0.04em',
                          }}
                        >
                          {habit.category}
                        </span>

                        {stats?.currentStreak > 0 && (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '2px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              color: 'var(--accent-amber)',
                            }}
                          >
                            <Flame size={12} />
                            {stats.currentStreak}d
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Action button (Checkbox or Numeric increment/decrement) */}
                  <div style={{ flexShrink: 0 }}>
                    {habit.targetType === 'numeric' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => updateHabitNumericValue(habit.id, todayStr, -1)}
                          disabled={currentValue <= 0}
                          className="btn-ghost"
                          style={{
                            width: '28px',
                            height: '28px',
                            padding: 0,
                            borderRadius: '50%',
                            border: '1px solid var(--border-subtle)',
                            opacity: currentValue <= 0 ? 0.4 : 1,
                          }}
                          aria-label="Decrement count"
                        >
                          <Minus size={14} />
                        </button>

                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.85rem',
                            fontWeight: 800,
                            minWidth: '40px',
                            textAlign: 'center',
                            color: isDone ? 'var(--accent-emerald)' : 'var(--text-primary)',
                          }}
                        >
                          {currentValue}/{habit.targetCount || 1}
                        </span>

                        <button
                          type="button"
                          onClick={() => updateHabitNumericValue(habit.id, todayStr, 1)}
                          className="btn-primary"
                          style={{
                            width: '28px',
                            height: '28px',
                            padding: 0,
                            borderRadius: '50%',
                            backgroundColor: habit.color || 'var(--primary)',
                          }}
                          aria-label="Increment count"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleHabitCompletion(habit.id, todayStr)}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: isDone ? (habit.color || 'var(--accent-emerald)') : 'transparent',
                          border: `2px solid ${isDone ? (habit.color || 'var(--accent-emerald)') : 'var(--border-subtle)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
                          boxShadow: isDone ? '0 2px 6px rgba(16, 185, 129, 0.3)' : 'none',
                        }}
                        aria-label={`Mark ${habit.name} ${isDone ? 'incomplete' : 'complete'} for today`}
                      >
                        {isDone && <Check size={20} strokeWidth={3} color="#fff" />}
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
  );
};
