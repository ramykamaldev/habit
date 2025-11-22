import React from 'react';
import { useHabit } from '../context/HabitContext';
import Card from './ui/Card';
import Button from './ui/Button';

const HabitList = ({ onAddEntry }) => {
    const { habits, deleteHabit } = useHabit();

    if (habits.length === 0) {
        return (
            <div className="text-center mt-md">
                <p>No habits yet. Start by adding one!</p>
            </div>
        );
    }

    return (
        <div className="flex-col gap-md" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {habits.map(habit => (
                <Card key={habit.id} className="flex justify-between items-center">
                    <div onClick={() => onAddEntry(habit)} style={{ cursor: 'pointer', flex: 1 }}>
                        <h3>{habit.name}</h3>
                        <p className="text-sm">Unit: {habit.unit}</p>
                    </div>
                    <Button
                        variant="danger"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Delete this habit?')) deleteHabit(habit.id);
                        }}
                        style={{ marginLeft: '1rem' }}
                    >
                        Delete
                    </Button>
                </Card>
            ))}
        </div>
    );
};

export default HabitList;
