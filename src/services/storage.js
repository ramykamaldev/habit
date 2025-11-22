import { v4 as uuidv4 } from 'uuid';

const HABITS_KEY = 'habit-tracker-habits';
const ENTRIES_KEY = 'habit-tracker-entries';

export const storageService = {
  getHabits: () => {
    const habits = localStorage.getItem(HABITS_KEY);
    return habits ? JSON.parse(habits) : [];
  },

  saveHabit: (habit) => {
    const habits = storageService.getHabits();
    const newHabit = { ...habit, id: uuidv4(), createdAt: new Date().toISOString() };
    const updatedHabits = [...habits, newHabit];
    localStorage.setItem(HABITS_KEY, JSON.stringify(updatedHabits));
    return newHabit;
  },

  deleteHabit: (id) => {
    const habits = storageService.getHabits();
    const updatedHabits = habits.filter(h => h.id !== id);
    localStorage.setItem(HABITS_KEY, JSON.stringify(updatedHabits));
    
    // Also cleanup entries for this habit
    const entries = storageService.getAllEntries();
    const updatedEntries = entries.filter(e => e.habitId !== id);
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(updatedEntries));
  },

  getAllEntries: () => {
    const entries = localStorage.getItem(ENTRIES_KEY);
    return entries ? JSON.parse(entries) : [];
  },

  getEntries: (habitId) => {
    const entries = storageService.getAllEntries();
    return entries.filter(e => e.habitId === habitId);
  },

  addEntry: (entry) => {
    const entries = storageService.getAllEntries();
    const newEntry = { ...entry, id: uuidv4(), timestamp: entry.timestamp || new Date().toISOString() };
    const updatedEntries = [...entries, newEntry];
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(updatedEntries));
    return newEntry;
  },
  
  // Helper to clear data (useful for testing)
  clearData: () => {
    localStorage.removeItem(HABITS_KEY);
    localStorage.removeItem(ENTRIES_KEY);
  }
};
