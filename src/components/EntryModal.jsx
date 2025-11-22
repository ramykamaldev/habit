import React, { useState, useEffect } from 'react';
import { useHabit } from '../context/HabitContext';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';
import { format } from 'date-fns';

const EntryModal = ({ isOpen, onClose, habit }) => {
    const { addEntry } = useHabit();
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    useEffect(() => {
        if (isOpen) {
            setAmount('');
            const now = new Date();
            setDate(format(now, 'yyyy-MM-dd'));
            setTime(format(now, 'HH:mm'));
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || !date || !time) return;

        const timestamp = new Date(`${date}T${time}`).toISOString();
        addEntry({
            habitId: habit.id,
            amount: parseFloat(amount),
            timestamp
        });
        onClose();
    };

    if (!habit) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Add Entry: ${habit.name}`}>
            <form onSubmit={handleSubmit} className="flex-col gap-md" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label className="text-sm" style={{ display: 'block', marginBottom: '0.25rem' }}>Amount ({habit.unit})</label>
                    <Input
                        type="number"
                        step="any"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        autoFocus
                        required
                    />
                </div>

                <div>
                    <label className="text-sm" style={{ display: 'block', marginBottom: '0.25rem' }}>Date</label>
                    <Input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="text-sm" style={{ display: 'block', marginBottom: '0.25rem' }}>Time</label>
                    <Input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                    />
                </div>

                <div className="flex justify-between mt-md" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <Button type="button" variant="secondary" onClick={onClose} style={{ background: 'transparent', border: '1px solid var(--color-text-secondary)', color: 'var(--color-text-secondary)' }}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        Save Entry
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default EntryModal;
