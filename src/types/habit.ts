export type HabitFrequency = 'daily' | 'weekdays' | 'weekends' | 'custom';
export type HabitPriority = 'low' | 'medium' | 'high';
export type HabitCategory = 
  | 'health' 
  | 'fitness' 
  | 'study' 
  | 'productivity' 
  | 'finance' 
  | 'mindfulness' 
  | 'personal' 
  | 'custom';

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  icon: string; // Emoji e.g. '⏰', '💧', '🏋️‍♂️'
  color: string; // Accent color hex
  frequency: HabitFrequency;
  customDays?: number[]; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  goal: number; // Monthly target (e.g., 30 days) or daily target count
  targetType: 'boolean' | 'numeric';
  targetCount?: number; // e.g., 3 for "Drink 3L Water"
  unit?: string; // e.g., "liters", "pages", "reps"
  category: HabitCategory;
  customCategory?: string;
  priority: HabitPriority;
  reminderEnabled?: boolean;
  reminderTime?: string; // "HH:MM"
  startDate: string; // "YYYY-MM-DD"
  endDate?: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HabitCompletion {
  id?: string;
  habitId: string;
  date: string; // "YYYY-MM-DD" in local timezone
  completed: boolean;
  value: number; // 1 for boolean, or counter value (e.g. 2 for 2L)
  updatedAt: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  themePreference: 'light' | 'dark' | 'system';
  weekStartsOn: 0 | 1; // 1 = Monday, 0 = Sunday
  timezone: string;
  createdAt: string;
  isGuest?: boolean;
}

export interface DaySummary {
  date: string;
  dayNumber: number;
  weekday: string;
  isToday: boolean;
  completedCount: number;
  goalCount: number;
  leftCount: number;
  percentage: number;
}

export interface WeekSummary {
  weekNumber: number;
  label: string; // "WEEK 1", "WEEK 2", etc.
  days: DaySummary[];
  completed: number;
  totalGoal: number;
  percentage: number;
}

export interface HabitStats {
  habitId: string;
  completedCount: number;
  goalCount: number;
  leftCount: number;
  percentage: number;
  currentStreak: number;
  bestStreak: number;
}

export interface MonthOverview {
  year: number;
  month: number; // 0-indexed (0 = Jan, 8 = Sep)
  monthName: string;
  totalDays: number;
  weeks: WeekSummary[];
  allDays: DaySummary[];
  totalCompleted: number;
  totalGoal: number;
  totalLeft: number;
  monthlyPercentage: number;
  habitStats: Record<string, HabitStats>;
}
