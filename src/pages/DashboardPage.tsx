import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { TodayHabitsList } from '../components/dashboard/TodayHabitsList';
import { MonthlyTrendChart } from '../components/dashboard/MonthlyTrendChart';
import { MonthlyDonutChart } from '../components/dashboard/MonthlyDonutChart';
import { TopHabitsCard } from '../components/dashboard/TopHabitsCard';

export const DashboardPage: React.FC = () => {
  const { onOpenAddHabit } = useOutletContext<{ onOpenAddHabit: () => void }>();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 4 Metric Summary Cards */}
      <SummaryCards />

      {/* Primary Action: Today's Focus Checklist */}
      <TodayHabitsList onOpenAddHabit={onOpenAddHabit} />

      {/* Visual Analytics Charts Row (Directly from Reference 1) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        <div style={{ minWidth: 0 }}>
          <MonthlyTrendChart />
        </div>
        <div style={{ minWidth: 0 }}>
          <MonthlyDonutChart />
        </div>
      </div>

      {/* Top 10 Habits Row (From Reference 1) */}
      <div>
        <TopHabitsCard />
      </div>
    </div>
  );
};
