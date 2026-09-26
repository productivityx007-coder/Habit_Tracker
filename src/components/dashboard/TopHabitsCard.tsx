import React from 'react';
import { Flame, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHabits } from '../../context/HabitContext';

export const TopHabitsCard: React.FC = () => {
  const { habits, monthOverview } = useHabits();
  const activeHabits = habits.filter((h) => !h.archived);

  // Rank habits by completion percentage descending, then by streak
  const rankedHabits = [...activeHabits].sort((a, b) => {
    const statsA = monthOverview.habitStats[a.id]?.percentage || 0;
    const statsB = monthOverview.habitStats[b.id]?.percentage || 0;
    if (statsB !== statsA) return statsB - statsA;
    const streakA = monthOverview.habitStats[a.id]?.currentStreak || 0;
    const streakB = monthOverview.habitStats[b.id]?.currentStreak || 0;
    return streakB - streakA;
  }).slice(0, 10);

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header">
        <h2 className="card-title">
          <Trophy size={18} color="var(--accent-amber)" />
          <span>Top Daily Habits</span>
        </h2>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Ranked by Consistency
        </span>
      </div>
      <div className="card-body" style={{ padding: '16px 20px' }}>
        {rankedHabits.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>
            No habits active yet.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {rankedHabits.map((habit, index) => {
              const stats = monthOverview.habitStats[habit.id] || {
                completedCount: 0,
                goalCount: habit.goal,
                percentage: 0,
                currentStreak: 0,
              };

              return (
                <Link
                  key={habit.id}
                  to={`/habit/${habit.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-secondary)',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'all 0.15s ease',
                  }}
                  className="top-habit-item"
                >
                  {/* Rank Badge */}
                  <span
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      backgroundColor: index === 0 ? 'var(--accent-amber)' : 'var(--bg-surface)',
                      color: index === 0 ? '#fff' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                    }}
                  >
                    {index + 1}
                  </span>

                  {/* Habit Icon & Name */}
                  <span style={{ fontSize: '1.2rem' }}>{habit.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {habit.name}
                      </p>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                        {stats.percentage}%
                      </span>
                    </div>

                    {/* Mini Progress Bar */}
                    <div style={{ width: '100%', height: '5px', backgroundColor: 'var(--bg-surface)', borderRadius: '999px', overflow: 'hidden', marginTop: '4px' }}>
                      <div
                        style={{
                          width: `${Math.min(100, stats.percentage)}%`,
                          height: '100%',
                          backgroundColor: habit.color || 'var(--primary)',
                          borderRadius: '999px',
                        }}
                      />
                    </div>
                  </div>

                  {/* Streak Flame */}
                  {stats.currentStreak > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--accent-amber)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                      }}
                      title={`${stats.currentStreak} day streak`}
                    >
                      <Flame size={13} />
                      <span>{stats.currentStreak}</span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
