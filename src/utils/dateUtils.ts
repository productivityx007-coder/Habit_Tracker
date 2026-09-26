/**
 * Centralized Date Utilities for HabitFlow
 * Handles timezone-safe formatting, month boundaries, and week grouping
 */

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Returns YYYY-MM-DD for a local date without UTC shifts
 */
export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns today's date formatted as YYYY-MM-DD
 */
export function getTodayString(): string {
  return formatLocalDate(new Date());
}

/**
 * Parses YYYY-MM-DD string into a local Date object safely
 */
export function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Returns the short weekday name for a date (e.g., 'Mon', 'Tue')
 */
export function getShortWeekday(date: Date): string {
  return WEEKDAYS_SHORT[date.getDay()];
}

/**
 * Returns days in a given month (year, month: 0-indexed)
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Formats a friendly readable date e.g. "Tuesday, Sep 24"
 */
export function formatFriendlyDate(dateString: string): string {
  const date = parseLocalDate(dateString);
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Groups all days of a month into Weeks (Week 1, Week 2, etc.)
 * exactly matching the reference screenshot layout!
 */
export function getMonthDaysGrouped(year: number, month: number) {
  const totalDays = getDaysInMonth(year, month);
  const todayStr = getTodayString();
  const days = [];

  for (let d = 1; d <= totalDays; d++) {
    const dateObj = new Date(year, month, d);
    const dateStr = formatLocalDate(dateObj);
    days.push({
      date: dateStr,
      dayNumber: d,
      weekday: getShortWeekday(dateObj),
      isToday: dateStr === todayStr,
      dayOfWeek: dateObj.getDay()
    });
  }

  // Group into 7-day chunks (Week 1: days 1-7, Week 2: 8-14, Week 3: 15-21, Week 4: 22-28, Week 5: 29-end)
  const weeks = [];
  let currentWeekDays = [];
  let weekIndex = 1;

  for (let i = 0; i < days.length; i++) {
    currentWeekDays.push(days[i]);
    if (currentWeekDays.length === 7 || i === days.length - 1) {
      weeks.push({
        weekNumber: weekIndex,
        label: `WEEK ${weekIndex}`,
        days: currentWeekDays
      });
      weekIndex++;
      currentWeekDays = [];
    }
  }

  return {
    year,
    month,
    monthName: MONTH_NAMES[month],
    totalDays,
    allDays: days,
    weeks
  };
}

/**
 * Generates an array of last N days formatted as YYYY-MM-DD
 */
export function getLastNDays(n: number): string[] {
  const result = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    result.push(formatLocalDate(d));
  }
  return result;
}
