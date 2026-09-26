import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, Calendar as CalendarIcon } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { MONTH_NAMES, formatLocalDate, formatFriendlyDate, getTodayString } from '../utils/dateUtils';
import { isHabitScheduledOnDate } from '../utils/analyticsUtils';

export const CalendarPage: React.FC = () => {
  const {
    habits,
    completions,
    selectedYear,
    selectedMonth,
    setSelectedMonth,
    nextMonth,
    prevMonth,
    toggleHabitCompletion,
    updateHabitNumericValue,
  } = useHabits();

  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());

  const activeHabits = habits.filter((h) => !h.archived);

  // Completions map
  const completionMap = new Map<string, { completed: boolean; value: number }>();
  completions.forEach((c) => {
    completionMap.set(`${c.habitId}_${c.date}`, { completed: c.completed, value: c.value });
  });

  // Calculate days in month and starting day offset
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay(); // 0 = Sun
  const totalDays = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const todayStr = getTodayString();

  const calendarDays = [];
  // Leading empty slots
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  // Days of month
  for (let d = 1; d <= totalDays; d++) {
    const dateStr = formatLocalDate(new Date(selectedYear, selectedMonth, d));
    
    // Stats for day
    let completedCount = 0;
    let scheduledCount = 0;
    activeHabits.forEach((h) => {
      if (isHabitScheduledOnDate(h, dateStr)) {
        scheduledCount++;
        if (completionMap.get(`${h.id}_${dateStr}`)?.completed) {
          completedCount++;
        }
      }
    });

    const percent = scheduledCount > 0 ? Math.round((completedCount / scheduledCount) * 100) : 0;

    calendarDays.push({
      dayNumber: d,
      date: dateStr,
      isToday: dateStr === todayStr,
      isSelected: dateStr === selectedDate,
      completedCount,
      scheduledCount,
      percent,
    });
  }

  // Habits for selected date
  const habitsForSelectedDate = activeHabits.filter((h) => isHabitScheduledOnDate(h, selectedDate));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Month Navigator Header */}
      <div className="calendar-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={prevMonth} className="btn-ghost" style={{ padding: '6px', borderRadius: '50%' }}>
            <ChevronLeft size={22} />
          </button>
          <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>
            {MONTH_NAMES[selectedMonth]} {selectedYear}
          </span>
          <button onClick={nextMonth} className="btn-ghost" style={{ padding: '6px', borderRadius: '50%' }}>
            <ChevronRight size={22} />
          </button>
        </div>

        <button
          onClick={() => {
            const today = new Date();
            setSelectedMonth(today.getMonth(), today.getFullYear());
            setSelectedDate(todayStr);
          }}
          className="btn btn-secondary"
          style={{ fontSize: '0.85rem' }}
        >
          <CalendarIcon size={16} />
          <span>Today</span>
        </button>
      </div>

      {/* Main Grid: Calendar on Left, Selected Day Focus on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
        {/* Calendar Grid */}
        <div className="card" style={{ padding: '20px' }}>
          {/* Weekday headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center', marginBottom: '8px' }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((wd) => (
              <div key={wd} style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                {wd}
              </div>
            ))}
          </div>

          {/* Days */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
            {calendarDays.map((item, idx) => {
              if (!item) {
                return <div key={`empty-${idx}`} style={{ minHeight: '64px' }} />;
              }

              return (
                <button
                  key={item.date}
                  type="button"
                  onClick={() => setSelectedDate(item.date)}
                  style={{
                    minHeight: '68px',
                    padding: '8px 4px',
                    borderRadius: 'var(--radius-md)',
                    border: item.isSelected
                      ? '2px solid var(--primary)'
                      : item.isToday
                      ? '2px solid var(--accent-amber)'
                      : '1px solid var(--border-subtle)',
                    backgroundColor: item.isSelected
                      ? 'var(--primary-light)'
                      : item.isToday
                      ? 'var(--bg-secondary)'
                      : 'var(--bg-surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  className="calendar-cell"
                >
                  <span
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: item.isToday || item.isSelected ? 800 : 600,
                      color: item.isSelected ? 'var(--primary)' : 'var(--text-primary)',
                    }}
                  >
                    {item.dayNumber}
                  </span>

                  {item.scheduledCount > 0 ? (
                    <div style={{ width: '100%', padding: '0 4px', textAlign: 'center' }}>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          color: item.percent === 100 ? 'var(--accent-emerald)' : 'var(--text-muted)',
                        }}
                      >
                        {item.completedCount}/{item.scheduledCount}
                      </span>
                      <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-subtle)', borderRadius: '999px', overflow: 'hidden', marginTop: '2px' }}>
                        <div
                          style={{
                            width: `${item.percent}%`,
                            height: '100%',
                            backgroundColor: item.percent === 100 ? 'var(--accent-emerald)' : 'var(--primary)',
                            borderRadius: '999px',
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>—</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Habits Detail Panel */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">{formatFriendlyDate(selectedDate)}</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {habitsForSelectedDate.length} habits scheduled
              </span>
            </div>
            {selectedDate === todayStr && (
              <span style={{ padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--accent-amber)', color: '#fff', fontSize: '0.72rem', fontWeight: 800 }}>
                TODAY
              </span>
            )}
          </div>

          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {habitsForSelectedDate.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '32px' }}>
                No habits scheduled for this date.
              </p>
            ) : (
              habitsForSelectedDate.map((habit) => {
                const rec = completionMap.get(`${habit.id}_${selectedDate}`);
                const isDone = Boolean(rec?.completed);

                return (
                  <div
                    key={habit.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isDone ? 'var(--bg-secondary)' : 'var(--bg-surface)',
                      border: `1px solid ${isDone ? 'var(--accent-emerald)' : 'var(--border-subtle)'}`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.25rem' }}>{habit.icon}</span>
                      <div>
                        <p style={{ fontSize: '0.9rem', fontWeight: 700 }}>{habit.name}</p>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          {habit.category}
                        </span>
                      </div>
                    </div>

                    {habit.targetType === 'numeric' ? (
                      <button
                        type="button"
                        onClick={() => {
                          const val = rec?.value || 0;
                          const max = habit.targetCount || 1;
                          updateHabitNumericValue(habit.id, selectedDate, val >= max ? -val : 1);
                        }}
                        className={`matrix-check-btn ${isDone ? 'checked' : ''}`}
                        style={{
                          width: '42px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          backgroundColor: isDone ? habit.color : undefined,
                        }}
                      >
                        {rec?.value || 0}/{habit.targetCount || 1}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleHabitCompletion(habit.id, selectedDate)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: isDone ? (habit.color || 'var(--accent-emerald)') : 'transparent',
                          border: `2px solid ${isDone ? (habit.color || 'var(--accent-emerald)') : 'var(--border-subtle)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        {isDone && <Check size={18} strokeWidth={3} color="#fff" />}
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
