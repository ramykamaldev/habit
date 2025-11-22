import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storage';

const HabitContext = createContext();

export const useHabit = () => {
    const context = useContext(HabitContext);
    if (!context) {
        throw new Error('useHabit must be used within a HabitProvider');
    }
    return context;
};

export const HabitProvider = ({ children }) => {
    const [habits, setHabits] = useState([]);
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = () => {
            setHabits(storageService.getHabits());
            setEntries(storageService.getAllEntries());
            setLoading(false);
        };
        loadData();
    }, []);

    const addHabit = (habitData) => {
        const newHabit = storageService.saveHabit(habitData);
        setHabits(prev => [...prev, newHabit]);
    };

    const deleteHabit = (id) => {
        storageService.deleteHabit(id);
        setHabits(prev => prev.filter(h => h.id !== id));
        setEntries(prev => prev.filter(e => e.habitId !== id));
    };

    const addEntry = (entryData) => {
        const newEntry = storageService.addEntry(entryData);
        setEntries(prev => [...prev, newEntry]);
    };

    const getHabitEntries = (habitId) => {
        return entries.filter(e => e.habitId === habitId);
    };

    const value = {
        habits,
        entries,
        loading,
        addHabit,
        deleteHabit,
        addEntry,
        getHabitEntries
    };

    return (
        <HabitContext.Provider value={value}>
            {children}
        </HabitContext.Provider>
    );
};
