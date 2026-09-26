import React from 'react';
import { ChevronLeft, ChevronRight, Check, Sparkles } from 'lucide-react';
import { useHabits } from '../../context/HabitContext';
import { MONTH_NAMES } from '../../utils/dateUtils';
import { isHabitScheduledOnDate } from '../../utils/analyticsUtils';

export const HabitMatrix: React.FC = () => {
  const {
    habits,
    completions,
    selectedYear,
    selectedMonth,
    setSelectedMonth,
    nextMonth,
    prevMonth,
    monthOverview,
    toggleHabitCompletion,
    updateHabitNumericValue,
    loadSampleData,
  } = useHabits();

  const activeHabits = habits.filter((h) => !h.archived);

  // Fast lookup for completion
  const completionMap = new Map<string, { completed: boolean; value: number }>();
  completions.forEach((c) => {
    completionMap.set(`${c.habitId}_${c.date}`, { completed: c.completed, value: c.value });
  });

  return (
    <div className="matrix-wrapper">
      {/* Calendar Settings Bar (Matching Reference 1) */}
      <div className="calendar-bar">
        <div className="calendar-bar-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={prevMonth} 
              className="btn-ghost" 
              style={{ padding: '6px', borderRadius: '50%' }}
              aria-label="Previous Month"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="calendar-banner-text">
              - {MONTH_NAMES[selectedMonth]} {selectedYear} -
            </span>
            <button 
              onClick={nextMonth} 
              className="btn-ghost" 
              style={{ padding: '6px', borderRadius: '50%' }}
              aria-label="Next Month"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="calendar-selectors">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>YEAR</label>
            <select
              className="custom-select"
              value={selectedYear}
              onChange={(e) => setSelectedMonth(selectedMonth, Number(e.target.value))}
            >
              {[2024, 2025, 2026, 2027, 2028].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>MONTH</label>
            <select
              className="custom-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {MONTH_NAMES.map((m, idx) => (
                <option key={m} value={idx}>{m}</option>
              ))}
            </select>
          </div>

          <button
            onClick={loadSampleData}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            title="Load Reference Data (September 2026)"
          >
            <Sparkles size={14} color="var(--primary)" />
            <span>Load Reference Data</span>
          </button>
        </div>
      </div>

      {/* Main Habit Matrix Table (Modernized Reference 2) */}
      <div className="matrix-container">
        <table className="matrix-table">
          <thead>
            {/* Row 1: Week group labels */}
            <tr>
              <th className="matrix-habit-col" style={{ zIndex: 20 }}>
                DAILY HABITS
              </th>
              <th className="matrix-goal-col">GOALS</th>
              {monthOverview.weeks.map((week) => (
                <th
                  key={week.weekNumber}
                  colSpan={week.days.length}
                  className="matrix-header-week"
                >
                  {week.label}
                </th>
              ))}
              <th colSpan={4} style={{ backgroundColor: 'var(--bg-secondary)', fontWeight: 700, fontSize: '0.8rem' }}>
                OVERALL PROGRESS
              </th>
            </tr>

            {/* Row 2: Day headers (Weekday and day number) */}
            <tr>
              <th className="matrix-habit-col" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {activeHabits.length} Habits Tracked
              </th>
              <th className="matrix-goal-col" style={{ fontSize: '0.75rem' }}>Days</th>
              {monthOverview.allDays.map((day) => (
                <th
                  key={day.date}
                  className={`matrix-header-day ${day.isToday ? 'is-today' : ''}`}
                  style={{ minWidth: '38px', padding: '6px 2px' }}
                >
                  <div style={{ fontSize: '0.7rem' }}>{day.weekday}</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{day.dayNumber}</div>
                </th>
              ))}
              {/* Overall Progress Subheaders */}
              <th style={{ width: '48px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>DONE</th>
              <th style={{ width: '48px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>LEFT</th>
              <th style={{ width: '54px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>%</th>
              <th style={{ minWidth: '110px', fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'left' }}>PROGRESS</th>
            </tr>
          </thead>

          <tbody>
            {activeHabits.length === 0 ? (
              <tr>
                <td colSpan={monthOverview.allDays.length + 6} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No active habits found. Click "Load Reference Data" or "New Habit" to get started!
                </td>
              </tr>
            ) : (
              activeHabits.map((habit) => {
                const stats = monthOverview.habitStats[habit.id] || {
                  completedCount: 0,
                  goalCount: habit.goal || monthOverview.totalDays,
                  leftCount: habit.goal || monthOverview.totalDays,
                  percentage: 0,
                  currentStreak: 0,
                  bestStreak: 0,
                };

                return (
                  <tr key={habit.id}>
                    {/* Sticky Habit Header */}
                    <td className="matrix-habit-col">
                      <div className="matrix-habit-title" title={habit.name}>
                        <span style={{ fontSize: '1.2rem' }}>{habit.icon}</span>
                        <span style={{ fontWeight: 600 }}>{habit.name}</span>
                      </div>
                    </td>

                    {/* Goal Days */}
                    <td className="matrix-goal-col">{habit.goal}</td>

                    {/* Checkbox for each day */}
                    {monthOverview.allDays.map((day) => {
                      const record = completionMap.get(`${habit.id}_${day.date}`);
                      const isCompleted = Boolean(record?.completed);
                      const isScheduled = isHabitScheduledOnDate(habit, day.date);

                      return (
                        <td key={day.date} style={{ padding: '4px 2px' }}>
                          {habit.targetType === 'numeric' ? (
                            <button
                              type="button"
                              onClick={() => {
                                const current = record?.value || 0;
                                const max = habit.targetCount || 1;
                                const nextDelta = current >= max ? -current : 1;
                                updateHabitNumericValue(habit.id, day.date, nextDelta);
                              }}
                              className={`matrix-check-btn ${isCompleted ? 'checked' : ''} ${!isScheduled ? 'unscheduled' : ''}`}
                              style={{
                                width: '32px',
                                height: '28px',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                backgroundColor: isCompleted ? habit.color : undefined,
                                borderColor: isCompleted ? habit.color : undefined,
                              }}
                              title={`${habit.name} on ${day.date}: ${record?.value || 0}/${habit.targetCount || 1} ${habit.unit || ''}`}
                            >
                              {record?.value ? `${record.value}` : '0'}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => toggleHabitCompletion(habit.id, day.date)}
                              className={`matrix-check-btn ${isCompleted ? 'checked' : ''} ${!isScheduled ? 'unscheduled' : ''}`}
                              style={{
                                backgroundColor: isCompleted ? habit.color : undefined,
                                borderColor: isCompleted ? habit.color : undefined,
                              }}
                              aria-label={`Toggle ${habit.name} on ${day.date}`}
                            >
                              {isCompleted && <Check size={16} strokeWidth={3} color="#fff" />}
                            </button>
                          )}
                        </td>
                      );
                    })}

                    {/* Overall Progress for Habit */}
                    <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      {stats.completedCount}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {stats.leftCount}
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                      {stats.percentage}%
                    </td>
                    <td style={{ textAlign: 'left', padding: '6px 12px' }}>
                      <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--bg-secondary)', borderRadius: '999px', overflow: 'hidden' }}>
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
                    </td>
                  </tr>
                );
              })
            )}

            {/* Matrix Summary Footer: GLOBAL PROGRESS (Directly from Reference 1) */}
            <tr style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <td className="matrix-habit-col" style={{ fontWeight: 800, letterSpacing: '0.04em' }}>
                GLOBAL PROGRESS
              </td>
              <td className="matrix-goal-col">—</td>
              {monthOverview.allDays.map((day) => (
                <td key={day.date} style={{ verticalAlign: 'bottom', padding: '6px 2px' }}>
                  <div className="mini-progress-bar-wrap" title={`${day.date}: ${day.percentage}% completed (${day.completedCount}/${day.goalCount})`}>
                    <div
                      className="mini-progress-bar-fill"
                      style={{ height: `${day.percentage}%` }}
                    />
                  </div>
                </td>
              ))}
              <td colSpan={4} style={{ textAlign: 'center', fontWeight: 700, color: 'var(--text-muted)' }}>
                DAILY VOLUME
              </td>
            </tr>

            {/* Row: COMPLETED Count per day */}
            <tr>
              <td className="matrix-habit-col" style={{ fontWeight: 700, color: 'var(--success-text)' }}>
                COMPLETED
              </td>
              <td className="matrix-goal-col">{monthOverview.totalCompleted}</td>
              {monthOverview.allDays.map((day) => (
                <td key={day.date} style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                  {day.completedCount}
                </td>
              ))}
              <td colSpan={4} style={{ textAlign: 'left', paddingLeft: '12px', fontWeight: 700, color: 'var(--success-text)' }}>
                Total Done: {monthOverview.totalCompleted}
              </td>
            </tr>

            {/* Row: GOAL Count per day */}
            <tr>
              <td className="matrix-habit-col" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                GOAL
              </td>
              <td className="matrix-goal-col">{monthOverview.totalGoal}</td>
              {monthOverview.allDays.map((day) => (
                <td key={day.date} style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                  {day.goalCount}
                </td>
              ))}
              <td colSpan={4} style={{ textAlign: 'left', paddingLeft: '12px', color: 'var(--text-muted)' }}>
                Total Goal: {monthOverview.totalGoal}
              </td>
            </tr>

            {/* Row: LEFT Count per day */}
            <tr>
              <td className="matrix-habit-col" style={{ fontWeight: 600, color: 'var(--text-muted)' }}>
                LEFT
              </td>
              <td className="matrix-goal-col">{monthOverview.totalLeft}</td>
              {monthOverview.allDays.map((day) => (
                <td key={day.date} style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                  {day.leftCount}
                </td>
              ))}
              <td colSpan={4} style={{ textAlign: 'left', paddingLeft: '12px', color: 'var(--text-muted)' }}>
                Remaining: {monthOverview.totalLeft}
              </td>
            </tr>

            {/* Row: WEEKLY PROGRESS Summary */}
            <tr style={{ backgroundColor: 'var(--primary-light)' }}>
              <td className="matrix-habit-col" style={{ fontWeight: 800, color: 'var(--primary)' }}>
                WEEKLY PROGRESS
              </td>
              <td className="matrix-goal-col" style={{ color: 'var(--primary)', fontWeight: 800 }}>
                {monthOverview.monthlyPercentage}%
              </td>
              {monthOverview.weeks.map((week) => (
                <td
                  key={week.weekNumber}
                  colSpan={week.days.length}
                  style={{ textAlign: 'center', padding: '8px 4px', color: 'var(--primary)', fontWeight: 700 }}
                >
                  <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                    {week.completed}/{week.totalGoal}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>
                    {week.percentage}%
                  </div>
                </td>
              ))}
              <td colSpan={4} style={{ textAlign: 'center', fontWeight: 800, color: 'var(--primary)' }}>
                Monthly Rate: {monthOverview.monthlyPercentage}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
