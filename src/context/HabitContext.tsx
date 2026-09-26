import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import type { Habit, HabitCompletion, MonthOverview } from '../types/habit';
import { useAuth } from './AuthContext';
import { habitService } from '../services/habitService';
import { calculateMonthOverview, calculateTodayStats } from '../utils/analyticsUtils';
import { getTodayString } from '../utils/dateUtils';
import { generateSeedData } from '../utils/seedData';
import { useToast } from '../components/common/Toast';

interface HabitContextType {
  habits: Habit[];
  completions: HabitCompletion[];
  loading: boolean;
  selectedYear: number;
  selectedMonth: number;
  monthOverview: MonthOverview;
  todayStats: {
    totalScheduled: number;
    completedToday: number;
    remaining: number;
    percentage: number;
  };
  setSelectedMonth: (month: number, year?: number) => void;
  nextMonth: () => void;
  prevMonth: () => void;
  addHabit: (habitData: Omit<Habit, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<Habit>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  archiveHabit: (id: string) => Promise<void>;
  unarchiveHabit: (id: string) => Promise<void>;
  toggleHabitCompletion: (habitId: string, dateStr: string) => Promise<void>;
  updateHabitNumericValue: (habitId: string, dateStr: string, delta: number) => Promise<void>;
  loadSampleData: () => Promise<void>;
  clearAllData: () => Promise<void>;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const toast = useToast();

  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Default to September 2026 as seen in the reference screenshot, or current date
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth());

  // Load user data on auth change
  useEffect(() => {
    if (!user) {
      setHabits([]);
      setCompletions([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    const loadUserData = async () => {
      setLoading(true);
      try {
        const [loadedHabits, loadedCompletions] = await Promise.all([
          habitService.fetchHabits(user.uid, Boolean(user.isGuest)),
          habitService.fetchCompletions(user.uid, Boolean(user.isGuest)),
        ]);

        if (isMounted) {
          if (loadedHabits.length === 0) {
            // First time user: initialize with sample habits so they immediately have a working app!
            const seed = generateSeedData(user.uid, selectedYear, selectedMonth);
            setHabits(seed.habits);
            setCompletions(seed.completions);
            await Promise.all([
              habitService.saveHabits(user.uid, seed.habits, Boolean(user.isGuest)),
              habitService.saveCompletions(user.uid, seed.completions, Boolean(user.isGuest)),
            ]);
          } else {
            setHabits(loadedHabits);
            setCompletions(loadedCompletions);
          }
        }
      } catch (err) {
        console.error('Error loading habit data:', err);
        toast.error('Could not load habits from cloud. Using local cache.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadUserData();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Derived Month Overview
  const monthOverview = useMemo(() => {
    return calculateMonthOverview(habits, completions, selectedYear, selectedMonth);
  }, [habits, completions, selectedYear, selectedMonth]);

  // Derived Today's Stats
  const todayStats = useMemo(() => {
    return calculateTodayStats(habits, completions, getTodayString());
  }, [habits, completions]);

  const handleSetSelectedMonth = (month: number, year?: number) => {
    setSelectedMonth(month);
    if (year !== undefined) setSelectedYear(year);
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  };

  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  // Add Habit
  const addHabit = async (habitData: Omit<Habit, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('Must be logged in to add habits');
    const nowIso = new Date().toISOString();
    const newHabit: Habit = {
      ...habitData,
      id: `habit_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userId: user.uid,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const newHabits = [...habits, newHabit];
    setHabits(newHabits);
    await habitService.addHabit(user.uid, newHabit, Boolean(user.isGuest));
    await habitService.saveHabits(user.uid, newHabits, Boolean(user.isGuest));
    toast.success(`Habit "${newHabit.name}" created!`);
    return newHabit;
  };

  // Update Habit
  const updateHabit = async (id: string, updates: Partial<Habit>) => {
    if (!user) return;
    const nowIso = new Date().toISOString();
    const newHabits = habits.map((h) =>
      h.id === id ? { ...h, ...updates, updatedAt: nowIso } : h
    );
    setHabits(newHabits);
    const updated = newHabits.find((h) => h.id === id);
    if (updated) {
      await habitService.updateHabit(user.uid, updated, Boolean(user.isGuest));
      await habitService.saveHabits(user.uid, newHabits, Boolean(user.isGuest));
      toast.success('Habit updated successfully');
    }
  };

  // Delete Habit
  const deleteHabit = async (id: string) => {
    if (!user) return;
    const target = habits.find((h) => h.id === id);
    const newHabits = habits.filter((h) => h.id !== id);
    const newCompletions = completions.filter((c) => c.habitId !== id);

    setHabits(newHabits);
    setCompletions(newCompletions);

    await habitService.deleteHabit(user.uid, id, Boolean(user.isGuest));
    await habitService.saveHabits(user.uid, newHabits, Boolean(user.isGuest));
    await habitService.saveCompletions(user.uid, newCompletions, Boolean(user.isGuest));
    toast.info(`Habit "${target?.name || ''}" deleted`);
  };

  // Archive / Unarchive
  const archiveHabit = async (id: string) => {
    await updateHabit(id, { archived: true });
    toast.info('Habit archived');
  };

  const unarchiveHabit = async (id: string) => {
    await updateHabit(id, { archived: false });
    toast.success('Habit restored');
  };

  // Toggle boolean completion
  const toggleHabitCompletion = async (habitId: string, dateStr: string) => {
    if (!user) return;
    const nowIso = new Date().toISOString();
    const existingIndex = completions.findIndex(
      (c) => c.habitId === habitId && c.date === dateStr
    );

    let newCompletions = [...completions];
    let isNowCompleted = false;

    if (existingIndex >= 0) {
      const existing = completions[existingIndex];
      isNowCompleted = !existing.completed;
      if (isNowCompleted) {
        newCompletions[existingIndex] = {
          ...existing,
          completed: true,
          value: 1,
          updatedAt: nowIso,
        };
      } else {
        newCompletions = completions.filter(
          (c) => !(c.habitId === habitId && c.date === dateStr)
        );
      }
    } else {
      isNowCompleted = true;
      newCompletions.push({
        id: `${habitId}_${dateStr}`,
        habitId,
        date: dateStr,
        completed: true,
        value: 1,
        updatedAt: nowIso,
      });
    }

    setCompletions(newCompletions);

    // Save
    if (isNowCompleted) {
      await habitService.saveCompletionRecord(
        user.uid,
        {
          id: `${habitId}_${dateStr}`,
          habitId,
          date: dateStr,
          completed: true,
          value: 1,
          updatedAt: nowIso,
        },
        Boolean(user.isGuest)
      );
    } else {
      await habitService.removeCompletionRecord(
        user.uid,
        habitId,
        dateStr,
        Boolean(user.isGuest)
      );
    }
    await habitService.saveCompletions(user.uid, newCompletions, Boolean(user.isGuest));

    // Celebration check: If today was just checked and all today's habits are now done
    if (isNowCompleted && dateStr === getTodayString()) {
      const newTodayStats = calculateTodayStats(habits, newCompletions, dateStr);
      if (newTodayStats.totalScheduled > 0 && newTodayStats.completedToday === newTodayStats.totalScheduled) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        toast.success("Awesome! All today's habits completed! 🎉");
      }
    }
  };

  // Numeric counter completion (e.g., Drink 3L water)
  const updateHabitNumericValue = async (habitId: string, dateStr: string, delta: number) => {
    if (!user) return;
    const targetHabit = habits.find((h) => h.id === habitId);
    if (!targetHabit) return;

    const maxTarget = targetHabit.targetCount || 1;
    const nowIso = new Date().toISOString();
    const existing = completions.find((c) => c.habitId === habitId && c.date === dateStr);
    const currentValue = existing ? existing.value : 0;
    const nextVal = Math.max(0, currentValue + delta);
    const isCompleted = nextVal >= maxTarget;

    let newCompletions = completions.filter(
      (c) => !(c.habitId === habitId && c.date === dateStr)
    );

    if (nextVal > 0) {
      const record: HabitCompletion = {
        id: `${habitId}_${dateStr}`,
        habitId,
        date: dateStr,
        completed: isCompleted,
        value: nextVal,
        updatedAt: nowIso,
      };
      newCompletions.push(record);
      await habitService.saveCompletionRecord(user.uid, record, Boolean(user.isGuest));
    } else {
      await habitService.removeCompletionRecord(user.uid, habitId, dateStr, Boolean(user.isGuest));
    }

    setCompletions(newCompletions);
    await habitService.saveCompletions(user.uid, newCompletions, Boolean(user.isGuest));
  };

  // Reset to seed reference data
  const loadSampleData = async () => {
    if (!user) return;
    const seed = generateSeedData(user.uid, selectedYear, selectedMonth);
    setHabits(seed.habits);
    setCompletions(seed.completions);
    await habitService.saveHabits(user.uid, seed.habits, Boolean(user.isGuest));
    await habitService.saveCompletions(user.uid, seed.completions, Boolean(user.isGuest));
    toast.success('Loaded sample habits and completion records from reference sheet!');
  };

  // Clear all data
  const clearAllData = async () => {
    if (!user) return;
    setHabits([]);
    setCompletions([]);
    await habitService.saveHabits(user.uid, [], Boolean(user.isGuest));
    await habitService.saveCompletions(user.uid, [], Boolean(user.isGuest));
    toast.info('All habits and history have been reset');
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        completions,
        loading,
        selectedYear,
        selectedMonth,
        monthOverview,
        todayStats,
        setSelectedMonth: handleSetSelectedMonth,
        nextMonth,
        prevMonth,
        addHabit,
        updateHabit,
        deleteHabit,
        archiveHabit,
        unarchiveHabit,
        toggleHabitCompletion,
        updateHabitNumericValue,
        loadSampleData,
        clearAllData,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = (): HabitContextType => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};
