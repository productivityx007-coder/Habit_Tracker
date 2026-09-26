import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Flame, Trophy, Calendar, CheckCircle2 } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { getLastNDays, parseLocalDate } from '../utils/dateUtils';

const CATEGORY_COLORS: Record<string, string> = {
  productivity: '#4f46e5',
  health: '#10b981',
  fitness: '#8b5cf6',
  study: '#f59e0b',
  mindfulness: '#06b6d4',
  finance: '#14b8a6',
  personal: '#ec4899',
};

export const AnalyticsPage: React.FC = () => {
  const { habits, completions, monthOverview } = useHabits();
  const activeHabits = habits.filter((h) => !h.archived);

  // 1. Heatmap: Last 90 days
  const last90Days = getLastNDays(90);
  const completionByDate = new Map<string, number>();
  completions.forEach((c) => {
    if (c.completed) {
      completionByDate.set(c.date, (completionByDate.get(c.date) || 0) + 1);
    }
  });

  // 2. Weekday Consistency (Sun to Sat)
  const weekdayTotals = [0, 1, 2, 3, 4, 5, 6].map((dayIdx) => {
    const daysOfType = monthOverview.allDays.filter((d) => {
      const parsed = parseLocalDate(d.date);
      return parsed.getDay() === dayIdx;
    });
    const completed = daysOfType.reduce((acc, d) => acc + d.completedCount, 0);
    const goals = daysOfType.reduce((acc, d) => acc + d.goalCount, 0);
    const rate = goals > 0 ? Math.round((completed / goals) * 100) : 0;
    const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return { weekday: names[dayIdx], rate, completed, goals };
  });

  // 3. Category Breakdown
  const categoryStats: Record<string, number> = {};
  activeHabits.forEach((h) => {
    const stats = monthOverview.habitStats[h.id];
    categoryStats[h.category] = (categoryStats[h.category] || 0) + (stats?.completedCount || 0);
  });

  const categoryChartData = Object.entries(categoryStats).map(([cat, count]) => ({
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    value: count,
    color: CATEGORY_COLORS[cat] || '#6366f1',
  }));

  // 4. Habit comparison data
  const habitComparisonData = activeHabits.map((h) => {
    const s = monthOverview.habitStats[h.id] || { completedCount: 0, percentage: 0 };
    return {
      name: h.name.length > 14 ? h.name.substring(0, 13) + '…' : h.name,
      percentage: s.percentage,
      color: h.color || 'var(--primary)',
    };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Title */}
      <div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Performance & Analytics
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Deep insights into your consistency, weekday trends, and long-term milestones.
        </p>
      </div>

      {/* High-level stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Completions</span>
            <span className="stat-value">{completions.filter((c) => c.completed).length}</span>
            <span className="stat-subtext">All-time check-ins logged</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)' }}>
            <Flame size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Longest All-Time Streak</span>
            <span className="stat-value">
              {Math.max(
                ...Object.values(monthOverview.habitStats).map((s) => s.bestStreak),
                0
              )}d
            </span>
            <span className="stat-subtext">Consecutive active days</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
            <Trophy size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Most Consistent Day</span>
            <span className="stat-value">
              {[...weekdayTotals].sort((a, b) => b.rate - a.rate)[0]?.weekday || 'Mon'}
            </span>
            <span className="stat-subtext">Peak performance weekday</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-purple)' }}>
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Current Month</span>
            <span className="stat-value">{monthOverview.monthlyPercentage}%</span>
            <span className="stat-subtext">{monthOverview.monthName} aggregate rate</span>
          </div>
        </div>
      </div>

      {/* GitHub-style Activity Heatmap (Last 90 Days) */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Consistency Heatmap (Last 90 Days)</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Daily check-in intensity
          </span>
        </div>
        <div className="card-body" style={{ overflowX: 'auto' }}>
          <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              {last90Days.map((dateStr) => {
                const count = completionByDate.get(dateStr) || 0;
                let bg = 'var(--bg-secondary)';
                if (count >= 7) bg = 'var(--primary)';
                else if (count >= 5) bg = 'rgba(79, 70, 229, 0.75)';
                else if (count >= 3) bg = 'rgba(79, 70, 229, 0.45)';
                else if (count >= 1) bg = 'rgba(79, 70, 229, 0.2)';

                return (
                  <div
                    key={dateStr}
                    style={{
                      width: '13px',
                      height: '13px',
                      borderRadius: '3px',
                      backgroundColor: bg,
                      transition: 'transform 0.1s ease',
                      cursor: 'pointer',
                    }}
                    title={`${dateStr}: ${count} habits completed`}
                  />
                );
              })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', marginTop: '10px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <span>Less</span>
              <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: 'var(--bg-secondary)' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: 'rgba(79, 70, 229, 0.2)' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: 'rgba(79, 70, 229, 0.45)' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: 'var(--primary)' }} />
              <span>More</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weekday Consistency & Category Distribution Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Weekday Consistency Bar Chart */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Consistency by Day of Week</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Average completion %</span>
          </div>
          <div className="card-body" style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekdayTotals} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                <XAxis dataKey="weekday" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="var(--text-muted)" fontSize={12} tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Completion Rate']}
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="rate" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Donut */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Habit Category Distribution</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Completions by area</span>
          </div>
          <div className="card-body" style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  innerRadius={50}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Habit Comparison Bar Chart */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Habit Comparison — {monthOverview.monthName}</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Comparison across all active habits</span>
        </div>
        <div className="card-body" style={{ height: '280px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={habitComparisonData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-subtle)" />
              <XAxis type="number" domain={[0, 100]} stroke="var(--text-muted)" fontSize={11} tickFormatter={(v) => `${v}%`} />
              <YAxis dataKey="name" type="category" stroke="var(--text-primary)" fontSize={12} tickLine={false} width={100} />
              <Tooltip
                formatter={(val: any) => [`${val}%`, 'Completed']}
                contentStyle={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="percentage" fill="var(--primary)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
