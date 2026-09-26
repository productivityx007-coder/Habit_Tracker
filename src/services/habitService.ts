import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import type { Habit, HabitCompletion } from '../types/habit';

const getHabitsStorageKey = (uid: string) => `habitflow_habits_${uid}`;
const getCompletionsStorageKey = (uid: string) => `habitflow_completions_${uid}`;

export const habitService = {
  async fetchHabits(userId: string, isGuest: boolean): Promise<Habit[]> {
    if (isFirebaseConfigured && db && !isGuest) {
      try {
        const habitsCol = collection(db, 'users', userId, 'habits');
        const snapshot = await getDocs(habitsCol);
        return snapshot.docs.map((docSnap) => docSnap.data() as Habit);
      } catch (err) {
        console.warn('Failed to load from Firestore, checking localStorage:', err);
      }
    }
    const local = localStorage.getItem(getHabitsStorageKey(userId));
    return local ? JSON.parse(local) : [];
  },

  async saveHabits(userId: string, habits: Habit[], _isGuest: boolean): Promise<void> {
    localStorage.setItem(getHabitsStorageKey(userId), JSON.stringify(habits));
  },

  async addHabit(userId: string, habit: Habit, isGuest: boolean): Promise<void> {
    if (isFirebaseConfigured && db && !isGuest) {
      try {
        const docRef = doc(db, 'users', userId, 'habits', habit.id);
        await setDoc(docRef, habit);
      } catch (err) {
        console.error('Firestore addHabit error:', err);
      }
    }
  },

  async updateHabit(userId: string, habit: Habit, isGuest: boolean): Promise<void> {
    if (isFirebaseConfigured && db && !isGuest) {
      try {
        const docRef = doc(db, 'users', userId, 'habits', habit.id);
        await updateDoc(docRef, { ...habit });
      } catch (err) {
        console.error('Firestore updateHabit error:', err);
      }
    }
  },

  async deleteHabit(userId: string, habitId: string, isGuest: boolean): Promise<void> {
    if (isFirebaseConfigured && db && !isGuest) {
      try {
        const docRef = doc(db, 'users', userId, 'habits', habitId);
        await deleteDoc(docRef);
      } catch (err) {
        console.error('Firestore deleteHabit error:', err);
      }
    }
  },

  async fetchCompletions(userId: string, isGuest: boolean): Promise<HabitCompletion[]> {
    if (isFirebaseConfigured && db && !isGuest) {
      try {
        const compCol = collection(db, 'users', userId, 'completions');
        const snapshot = await getDocs(compCol);
        return snapshot.docs.map((docSnap) => docSnap.data() as HabitCompletion);
      } catch (err) {
        console.warn('Failed to fetch completions from Firestore, using local:', err);
      }
    }
    const local = localStorage.getItem(getCompletionsStorageKey(userId));
    return local ? JSON.parse(local) : [];
  },

  async saveCompletions(userId: string, completions: HabitCompletion[], _isGuest: boolean): Promise<void> {
    localStorage.setItem(getCompletionsStorageKey(userId), JSON.stringify(completions));
  },

  async saveCompletionRecord(
    userId: string,
    completion: HabitCompletion,
    isGuest: boolean
  ): Promise<void> {
    if (isFirebaseConfigured && db && !isGuest) {
      try {
        const docId = `${completion.habitId}_${completion.date}`;
        const docRef = doc(db, 'users', userId, 'completions', docId);
        await setDoc(docRef, completion);
      } catch (err) {
        console.error('Firestore saveCompletionRecord error:', err);
      }
    }
  },

  async removeCompletionRecord(
    userId: string,
    habitId: string,
    date: string,
    isGuest: boolean
  ): Promise<void> {
    if (isFirebaseConfigured && db && !isGuest) {
      try {
        const docId = `${habitId}_${date}`;
        const docRef = doc(db, 'users', userId, 'completions', docId);
        await deleteDoc(docRef);
      } catch (err) {
        console.error('Firestore removeCompletionRecord error:', err);
      }
    }
  }
};
