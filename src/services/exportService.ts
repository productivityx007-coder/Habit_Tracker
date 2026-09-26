import type { Habit, HabitCompletion } from '../types/habit';

export const exportService = {
  /**
   * Generates and downloads a JSON file of user habits and completions
   */
  exportToJSON(habits: Habit[], completions: HabitCompletion[], userName: string = 'user') {
    const data = {
      exportedAt: new Date().toISOString(),
      user: userName,
      habitsCount: habits.length,
      completionsCount: completions.length,
      habits,
      completions,
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute(
      'download',
      `habitflow_export_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  /**
   * Generates and downloads a CSV of habits and their completion history
   */
  exportToCSV(habits: Habit[], completions: HabitCompletion[]) {
    const habitMap = new Map<string, Habit>();
    habits.forEach((h) => habitMap.set(h.id, h));

    const headers = ['Habit Name', 'Category', 'Frequency', 'Date', 'Status', 'Value', 'Unit'];
    const rows = completions.map((c) => {
      const habit = habitMap.get(c.habitId);
      return [
        `"${habit?.name || 'Unknown'}"`,
        `"${habit?.category || ''}"`,
        `"${habit?.frequency || ''}"`,
        `"${c.date}"`,
        c.completed ? 'Completed' : 'Missed',
        c.value || (c.completed ? 1 : 0),
        `"${habit?.unit || ''}"`,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `habitflow_completions_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  },
};
