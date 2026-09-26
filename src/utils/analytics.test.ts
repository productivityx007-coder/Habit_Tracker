import { describe, it, expect } from 'vitest';
import {
  formatLocalDate,
  getDaysInMonth,
  getMonthDaysGrouped
} from './dateUtils';
import {
  isHabitScheduledOnDate,
  calculateHabitStreaks,
  calculateMonthOverview,
  calculateTodayStats
} from './analyticsUtils';
import { generateSeedData } from './seedData';
import type { Habit } from '../types/habit';

describe('HabitFlow Analytics & Calculation Engine', () => {
  it('formats local date without timezone shifts', () => {
    const d = new Date(2026, 8, 24);
    expect(formatLocalDate(d)).toBe('2026-09-24');
    expect(getDaysInMonth(2026, 8)).toBe(30);
    expect(getDaysInMonth(2024, 1)).toBe(29); // Leap year
  });

  it('groups month days into 5 weeks matching reference layout', () => {
    const grouped = getMonthDaysGrouped(2026, 8);
    expect(grouped.totalDays).toBe(30);
    expect(grouped.weeks.length).toBe(5);
    expect(grouped.weeks[0].days[0].weekday).toBe('Tue'); // Sep 1, 2026 is Tuesday
    expect(grouped.weeks[4].days.length).toBe(2); // Days 29 and 30
  });

  it('correctly filters habits by frequency schedule', () => {
    const dailyHabit: Habit = {
      id: 'h1',
      userId: 'u1',
      name: 'Daily Habit',
      icon: '⏰',
      color: '#3b82f6',
      frequency: 'daily',
      goal: 30,
      targetType: 'boolean',
      category: 'productivity',
      priority: 'high',
      startDate: '2026-09-01',
      archived: false,
      createdAt: '2026-09-01',
      updatedAt: '2026-09-01',
    };

    const weekdayHabit: Habit = {
      ...dailyHabit,
      id: 'h2',
      frequency: 'weekdays',
    };

    expect(isHabitScheduledOnDate(dailyHabit, '2026-09-01')).toBe(true);
    expect(isHabitScheduledOnDate(dailyHabit, '2026-09-06')).toBe(true); // Sunday
    expect(isHabitScheduledOnDate(weekdayHabit, '2026-09-01')).toBe(true); // Tuesday
    expect(isHabitScheduledOnDate(weekdayHabit, '2026-09-06')).toBe(false); // Sunday
  });

  it('calculates streaks correctly without penalizing unscheduled days', () => {
    const habit: Habit = {
      id: 'h1',
      userId: 'u1',
      name: 'Workout',
      icon: '🏋️‍♂️',
      color: '#8b5cf6',
      frequency: 'daily',
      goal: 30,
      targetType: 'boolean',
      category: 'fitness',
      priority: 'high',
      startDate: '2026-09-01',
      archived: false,
      createdAt: '2026-09-01',
      updatedAt: '2026-09-01',
    };

    const completions = [
      { id: '1', habitId: 'h1', date: '2026-09-24', completed: true, value: 1, updatedAt: '' },
      { id: '2', habitId: 'h1', date: '2026-09-23', completed: true, value: 1, updatedAt: '' },
      { id: '3', habitId: 'h1', date: '2026-09-22', completed: true, value: 1, updatedAt: '' },
    ];

    const streaks = calculateHabitStreaks(habit, completions, '2026-09-24');
    expect(streaks.currentStreak).toBe(3);
    expect(streaks.bestStreak).toBe(3);
  });

  it('matches Reference 2 completion percentage for Wake up at 6AM (77%)', () => {
    const seed = generateSeedData('user_test', 2026, 8);
    const overview = calculateMonthOverview(seed.habits, seed.completions, 2026, 8);

    const wakeUp = overview.habitStats['seed-habit-1'];
    expect(wakeUp.completedCount).toBe(23);
    expect(wakeUp.percentage).toBe(77); // 23 / 30 = 76.66% -> 77% matching reference_2.png
  });

  it('handles zero-goal and empty state safely without division by zero', () => {
    const todayStats = calculateTodayStats([], []);
    expect(todayStats.totalScheduled).toBe(0);
    expect(todayStats.percentage).toBe(0);
    expect(todayStats.remaining).toBe(0);
  });
});
