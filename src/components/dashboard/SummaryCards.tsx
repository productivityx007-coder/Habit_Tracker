import React from 'react';
import { CheckCircle2, Flame, Calendar, TrendingUp } from 'lucide-react';
import { useHabits } from '../../context/HabitContext';

export const SummaryCards: React.FC = () => {
  const { todayStats, monthOverview, habits } = useHabits();

  // Find highest current streak among habits
  const highestStreak = Object.values(monthOverview.habitStats).reduce(
    (max, s) => Math.max(max, s.currentStreak),
    0
  );

  return (
    <div className="stats-grid">
      {/* Today's Completion */}
      <div className="stat-card">
        <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(79, 70, 229, 0.12)', color: 'var(--primary)' }}>
          <CheckCircle2 size={24} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Today's Progress</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className="stat-value">{todayStats.percentage}%</span>
            <span className="stat-subtext">({todayStats.completedToday}/{todayStats.totalScheduled})</span>
          </div>
          <span className="stat-subtext">
            {todayStats.remaining === 0 && todayStats.totalScheduled > 0
              ? 'All habits done today! 🚀'
              : `${todayStats.remaining} habits left today`}
          </span>
        </div>
      </div>

      {/* Monthly Rate */}
      <div className="stat-card">
        <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: 'var(--accent-emerald)' }}>
          <TrendingUp size={24} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Monthly Rate</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className="stat-value">{monthOverview.monthlyPercentage}%</span>
            <span className="stat-subtext">({monthOverview.totalCompleted}/{monthOverview.totalGoal})</span>
          </div>
          <span className="stat-subtext">For {monthOverview.monthName}</span>
        </div>
      </div>

      {/* Best Streak */}
      <div className="stat-card">
        <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: 'var(--accent-amber)' }}>
          <Flame size={24} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Current Top Streak</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className="stat-value">{highestStreak}</span>
            <span className="stat-subtext">days</span>
          </div>
          <span className="stat-subtext">Keep the momentum going!</span>
        </div>
      </div>

      {/* Active Habits */}
      <div className="stat-card">
        <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(139, 92, 246, 0.12)', color: 'var(--accent-purple)' }}>
          <Calendar size={24} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Active Habits</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className="stat-value">{habits.filter((h) => !h.archived).length}</span>
            <span className="stat-subtext">habits</span>
          </div>
          <span className="stat-subtext">Configured for your routine</span>
        </div>
      </div>
    </div>
  );
};
