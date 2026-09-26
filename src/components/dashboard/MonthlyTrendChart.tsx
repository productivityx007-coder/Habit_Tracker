import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useHabits } from '../../context/HabitContext';

export const MonthlyTrendChart: React.FC = () => {
  const { monthOverview } = useHabits();

  // Transform all days into chart data points
  const chartData = monthOverview.allDays.map((d) => ({
    day: d.dayNumber,
    date: d.date,
    weekday: d.weekday,
    percentage: d.percentage,
    completed: d.completedCount,
    goal: d.goalCount,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '10px 14px',
            boxShadow: 'var(--shadow-md)',
            fontSize: '0.85rem',
          }}
        >
          <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
            Day {data.day} ({data.weekday})
          </p>
          <p style={{ color: 'var(--primary)', fontWeight: 600 }}>
            {data.percentage}% Completed
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
            {data.completed} of {data.goal} habits completed
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header">
        <h2 className="card-title">Daily Progress Trend — {monthOverview.monthName}</h2>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Target vs Realized Completion
        </span>
      </div>
      <div className="card-body" style={{ height: '280px', padding: '16px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="progressGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
            <XAxis
              dataKey="day"
              stroke="var(--text-muted)"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'var(--border-subtle)' }}
            />
            <YAxis
              domain={[0, 100]}
              stroke="var(--text-muted)"
              fontSize={11}
              tickFormatter={(v) => `${v}%`}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="percentage"
              stroke="var(--primary)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#progressGrad)"
              dot={{ r: 3, fill: 'var(--primary)', strokeWidth: 1 }}
              activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
