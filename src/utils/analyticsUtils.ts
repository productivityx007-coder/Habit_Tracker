import type { Habit, HabitCompletion, MonthOverview, HabitStats, DaySummary, WeekSummary } from '../types/habit';
import { getMonthDaysGrouped, parseLocalDate, formatLocalDate } from './dateUtils';

/**
 * Checks if a habit is scheduled for a given date (based on frequency & customDays)
 */
export function isHabitScheduledOnDate(habit: Habit, dateStr: string): boolean {
  if (habit.archived) return false;
  if (habit.startDate && dateStr < habit.startDate) return false;
  if (habit.endDate && dateStr > habit.endDate) return false;

  const date = parseLocalDate(dateStr);
  const dayOfWeek = date.getDay(); // 0 = Sun, 6 = Sat

  switch (habit.frequency) {
    case 'daily':
      return true;
    case 'weekdays':
      return dayOfWeek >= 1 && dayOfWeek <= 5;
    case 'weekends':
      return dayOfWeek === 0 || dayOfWeek === 6;
    case 'custom':
      return habit.customDays ? habit.customDays.includes(dayOfWeek) : true;
    default:
      return true;
  }
}

/**
 * Calculates current streak and longest streak for a habit
 */
export function calculateHabitStreaks(
  habit: Habit,
  completions: HabitCompletion[],
  currentDateStr: string = formatLocalDate(new Date())
): { currentStreak: number; bestStreak: number } {
  const completedDates = new Set(
    completions
      .filter((c) => c.habitId === habit.id && c.completed)
      .map((c) => c.date)
  );

  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  const checkDate = parseLocalDate(currentDateStr);
  let streakOngoing = true;

  for (let i = 0; i < 365; i++) {
    const d = new Date(checkDate);
    d.setDate(checkDate.getDate() - i);
    const dateStr = formatLocalDate(d);

    if (habit.startDate && dateStr < habit.startDate) {
      break;
    }

    const scheduled = isHabitScheduledOnDate(habit, dateStr);
    if (!scheduled) {
      continue;
    }

    const isCompleted = completedDates.has(dateStr);

    if (streakOngoing) {
      if (isCompleted) {
        currentStreak++;
      } else {
        if (i === 0) {
          continue;
        } else {
          streakOngoing = false;
        }
      }
    }
  }

  const sortedDates = Array.from(completedDates).sort();
  tempStreak = 0;
  for (let i = 0; i < sortedDates.length; i++) {
    tempStreak++;
    if (tempStreak > bestStreak) {
      bestStreak = tempStreak;
    }
  }
  bestStreak = Math.max(bestStreak, currentStreak);

  return { currentStreak, bestStreak };
}

/**
 * Calculates complete month overview matching reference screenshots!
 */
export function calculateMonthOverview(
  habits: Habit[],
  completions: HabitCompletion[],
  year: number,
  month: number
): MonthOverview {
  const activeHabits = habits.filter((h) => !h.archived);
  const grouped = getMonthDaysGrouped(year, month);

  const completionMap = new Map<string, boolean>();
  completions.forEach((c) => {
    if (c.completed) {
      completionMap.set(`${c.habitId}_${c.date}`, true);
    }
  });

  const habitStats: Record<string, HabitStats> = {};
  activeHabits.forEach((habit) => {
    let completedCount = 0;
    grouped.allDays.forEach((d) => {
      if (completionMap.get(`${habit.id}_${d.date}`)) {
        completedCount++;
      }
    });

    const goalCount = habit.goal || grouped.totalDays;
    const leftCount = Math.max(0, goalCount - completedCount);
    const percentage = goalCount > 0 ? Math.round((completedCount / goalCount) * 100) : 0;
    const { currentStreak, bestStreak } = calculateHabitStreaks(habit, completions);

    habitStats[habit.id] = {
      habitId: habit.id,
      completedCount,
      goalCount,
      leftCount,
      percentage,
      currentStreak,
      bestStreak,
    };
  });

  const allDaysSummaries: DaySummary[] = grouped.allDays.map((d) => {
    let completedCount = 0;
    let goalCount = 0;

    activeHabits.forEach((habit) => {
      const scheduled = isHabitScheduledOnDate(habit, d.date);
      if (scheduled) {
        goalCount++;
        if (completionMap.get(`${habit.id}_${d.date}`)) {
          completedCount++;
        }
      }
    });

    const leftCount = Math.max(0, goalCount - completedCount);
    const percentage = goalCount > 0 ? Math.round((completedCount / goalCount) * 100) : 0;

    return {
      date: d.date,
      dayNumber: d.dayNumber,
      weekday: d.weekday,
      isToday: d.isToday,
      completedCount,
      goalCount,
      leftCount,
      percentage,
    };
  });

  const weeksSummaries: WeekSummary[] = grouped.weeks.map((w) => {
    const weekDays = allDaysSummaries.filter((d) =>
      w.days.some((wd) => wd.date === d.date)
    );
    const completed = weekDays.reduce((acc, d) => acc + d.completedCount, 0);
    const totalGoal = weekDays.reduce((acc, d) => acc + d.goalCount, 0);
    const percentage = totalGoal > 0 ? Math.round((completed / totalGoal) * 100) : 0;

    return {
      weekNumber: w.weekNumber,
      label: w.label,
      days: weekDays,
      completed,
      totalGoal,
      percentage,
    };
  });

  const totalCompleted = allDaysSummaries.reduce((acc, d) => acc + d.completedCount, 0);
  const totalGoal = allDaysSummaries.reduce((acc, d) => acc + d.goalCount, 0);
  const totalLeft = Math.max(0, totalGoal - totalCompleted);
  const monthlyPercentage = totalGoal > 0 ? Math.round((totalCompleted / totalGoal) * 100) : 0;

  return {
    year,
    month,
    monthName: grouped.monthName,
    totalDays: grouped.totalDays,
    weeks: weeksSummaries,
    allDays: allDaysSummaries,
    totalCompleted,
    totalGoal,
    totalLeft,
    monthlyPercentage,
    habitStats,
  };
}

/**
 * Calculates summary metrics for today
 */
export function calculateTodayStats(
  habits: Habit[],
  completions: HabitCompletion[],
  todayStr: string = formatLocalDate(new Date())
) {
  const activeHabits = habits.filter((h) => !h.archived);
  const scheduledToday = activeHabits.filter((h) => isHabitScheduledOnDate(h, todayStr));
  
  let completedToday = 0;
  scheduledToday.forEach((habit) => {
    const isComp = completions.some(
      (c) => c.habitId === habit.id && c.date === todayStr && c.completed
    );
    if (isComp) completedToday++;
  });

  const remaining = Math.max(0, scheduledToday.length - completedToday);
  const percentage = scheduledToday.length > 0 ? Math.round((completedToday / scheduledToday.length) * 100) : 0;

  return {
    totalScheduled: scheduledToday.length,
    completedToday,
    remaining,
    percentage,
  };
}
