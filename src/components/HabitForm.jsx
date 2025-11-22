import React, { useState } from 'react';
import { useHabit } from '../context/HabitContext';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';

const HabitForm = () => {
    const { addHabit } = useHabit();
    const [name, setName] = useState('');
    const [unit, setUnit] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !unit) return;

        addHabit({ name, unit });
        setName('');
        setUnit('');
        setIsExpanded(false);
    };

    if (!isExpanded) {
        return (
            <Button onClick={() => setIsExpanded(true)} className="w-full" style={{ width: '100%' }}>
                + Add New Habit
            </Button>
        );
    }

    return (
        <Card className="mb-md">
            <form onSubmit={handleSubmit} className="flex-col gap-md">
                <h3 className="mb-md">New Habit</h3>
                <div className="flex-col gap-sm" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Input
                        placeholder="Habit Name (e.g., Running)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                    />
                    <Input
                        placeholder="Unit (e.g., km, hours)"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                    />
                </div>
                <div className="flex justify-between mt-md" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <Button type="button" variant="secondary" onClick={() => setIsExpanded(false)} style={{ background: 'transparent', border: '1px solid var(--color-text-secondary)', color: 'var(--color-text-secondary)' }}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        Create Habit
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default HabitForm;
