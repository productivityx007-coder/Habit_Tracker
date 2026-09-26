import type { Habit, HabitCompletion } from '../types/habit';
import { formatLocalDate, getDaysInMonth } from './dateUtils';

export const INITIAL_SEED_HABITS: Omit<Habit, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Wake up at 6AM',
    description: 'Rise early and start the morning with energy and focus',
    icon: '⏰',
    color: '#3b82f6', // Sapphire blue
    frequency: 'daily',
    goal: 30,
    targetType: 'boolean',
    category: 'productivity',
    priority: 'high',
    reminderEnabled: true,
    reminderTime: '06:00',
    startDate: '2026-09-01',
    archived: false,
  },
  {
    name: 'No corn',
    description: 'Avoid unhealthy corn syrups and ultra-processed corn snacks',
    icon: '🌽',
    color: '#10b981', // Emerald green
    frequency: 'daily',
    goal: 30,
    targetType: 'boolean',
    category: 'health',
    priority: 'medium',
    startDate: '2026-09-01',
    archived: false,
  },
  {
    name: 'Drink 3L Water',
    description: 'Stay hydrated throughout the day (3 liters target)',
    icon: '💧',
    color: '#06b6d4', // Cyan
    frequency: 'daily',
    goal: 30,
    targetType: 'numeric',
    targetCount: 3,
    unit: 'liters',
    category: 'health',
    priority: 'high',
    reminderEnabled: true,
    reminderTime: '09:00',
    startDate: '2026-09-01',
    archived: false,
  },
  {
    name: 'Workout',
    description: 'Weightlifting or cardio exercise for at least 45 minutes',
    icon: '🏋️‍♂️',
    color: '#8b5cf6', // Violet
    frequency: 'weekdays',
    goal: 27,
    targetType: 'boolean',
    category: 'fitness',
    priority: 'high',
    reminderEnabled: true,
    reminderTime: '18:00',
    startDate: '2026-09-01',
    archived: false,
  },
  {
    name: 'Stretching',
    description: 'Full body mobility and flexibility routine',
    icon: '🧘',
    color: '#ec4899', // Pink
    frequency: 'daily',
    goal: 30,
    targetType: 'boolean',
    category: 'fitness',
    priority: 'low',
    startDate: '2026-09-01',
    archived: false,
  },
  {
    name: 'Meditation',
    description: '15 minutes of mindful breathwork and calm awareness',
    icon: '🧘',
    color: '#6366f1', // Indigo
    frequency: 'daily',
    goal: 30,
    targetType: 'boolean',
    category: 'mindfulness',
    priority: 'medium',
    startDate: '2026-09-01',
    archived: false,
  },
  {
    name: 'Study 1 Hour',
    description: 'Dedicated focused deep work or technical learning',
    icon: '🎓',
    color: '#f59e0b', // Amber
    frequency: 'weekdays',
    goal: 25,
    targetType: 'boolean',
    category: 'study',
    priority: 'high',
    startDate: '2026-09-01',
    archived: false,
  },
  {
    name: 'Limit Social Media',
    description: 'Keep screen time on recreational social apps under 20 mins',
    icon: '📵',
    color: '#ef4444', // Rose red
    frequency: 'daily',
    goal: 30,
    targetType: 'boolean',
    category: 'productivity',
    priority: 'medium',
    startDate: '2026-09-01',
    archived: false,
  },
  {
    name: 'Track Expenses',
    description: 'Log every transaction and review daily spending in budget',
    icon: '💵',
    color: '#14b8a6', // Teal
    frequency: 'daily',
    goal: 30,
    targetType: 'boolean',
    category: 'finance',
    priority: 'medium',
    startDate: '2026-09-01',
    archived: false,
  },
];

/**
 * Creates sample seed data for the specified user and month/year
 * with realistic completion patterns mirroring reference screenshots!
 */
export function generateSeedData(userId: string, year: number = 2026, month: number = 8) {
  const timestamp = new Date().toISOString();
  const habits: Habit[] = INITIAL_SEED_HABITS.map((item, index) => ({
    ...item,
    id: `seed-habit-${index + 1}`,
    userId,
    createdAt: timestamp,
    updatedAt: timestamp,
  }));

  const completions: HabitCompletion[] = [];
  const daysCount = getDaysInMonth(year, month);

  // Exact reference matrix patterns (from reference_2.png for days 1 to 24)
  const completionMap: Record<number, number[]> = {
    0: [1,2,3,4,5,6,7, 8,9,10,11,12,13,14, 15,16,17,18,19,20,21, 22,23], // Wake up (23 days)
    1: [1,2,3,4,5,6,7, 8,9,10,11,12,13,14, 15,16,17,18,19,20,21], // No corn (21 days)
    2: [1,2,3,4,5,6,7, 8,9,10,11,12,13,14, 15,16,17], // Water (17 days)
    3: [1,2,4,5, 8,9,12, 16,17,19, 22,23], // Workout (15 days)
    4: [], // Stretching (0 days)
    5: [4], // Meditation (1 day)
    6: [], // Study (0 days)
    7: [2,6, 8,10, 15,16,20, 23], // Limit Social Media (12 days)
    8: [1, 8,11, 22], // Track expenses (4 days)
  };

  habits.forEach((habit, idx) => {
    const activeDays = completionMap[idx] || [];
    for (let day = 1; day <= daysCount; day++) {
      const isCompleted = activeDays.includes(day);
      if (isCompleted) {
        const dateStr = formatLocalDate(new Date(year, month, day));
        completions.push({
          id: `${habit.id}_${dateStr}`,
          habitId: habit.id,
          date: dateStr,
          completed: true,
          value: habit.targetType === 'numeric' ? (habit.targetCount || 1) : 1,
          updatedAt: timestamp,
        });
      }
    }
  });

  return { habits, completions };
}
