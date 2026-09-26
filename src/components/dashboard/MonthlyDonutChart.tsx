import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useHabits } from '../../context/HabitContext';

export const MonthlyDonutChart: React.FC = () => {
  const { monthOverview } = useHabits();

  const completed = monthOverview.totalCompleted;
  const left = monthOverview.totalLeft;
  const percentage = monthOverview.monthlyPercentage;

  const data = [
    { name: 'Completed', value: completed, color: 'var(--primary)' },
    { name: 'Left', value: left, color: 'var(--border-subtle)' },
  ];

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="card-header">
        <h2 className="card-title">Overview Monthly Progress</h2>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {monthOverview.monthName}
        </span>
      </div>
      <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: '260px' }}>
        <div style={{ width: '100%', height: '180px', position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(val: any, name: any) => [`${val} habit instances`, name]}
                contentStyle={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                  borderRadius: '8px',
                  fontSize: '0.85rem'
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              pointerEvents: 'none',
            }}
          >
            <span style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
              {percentage}%
            </span>
            <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Done
            </span>
          </div>
        </div>

        {/* Legend row matching Reference 1 */}
        <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', marginTop: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)', marginRight: '6px' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>COMPLETED</span>
            <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {percentage}%
            </p>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{completed} total</p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--text-muted)', marginRight: '6px' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>LEFT</span>
            <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {Math.max(0, 100 - percentage)}%
            </p>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{left} remaining</p>
          </div>
        </div>
      </div>
    </div>
  );
};
