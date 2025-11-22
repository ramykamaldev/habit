import React, { useState, useMemo } from 'react';
import { useHabit } from '../context/HabitContext';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, startOfMonth, endOfMonth, startOfYear, endOfYear, isValid, parseISO } from 'date-fns';
import Card from './ui/Card';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const { habits, entries } = useHabit();
    const [selectedHabitId, setSelectedHabitId] = useState(habits[0]?.id || '');
    const [period, setPeriod] = useState('week'); // 'week', 'month', 'year', 'custom'
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');

    const selectedHabit = habits.find(h => h.id === selectedHabitId);

    const chartData = useMemo(() => {
        if (!selectedHabit) return null;

        const now = new Date();
        let start, end;

        if (period === 'week') {
            start = startOfWeek(now, { weekStartsOn: 1 });
            end = endOfWeek(now, { weekStartsOn: 1 });
        } else if (period === 'month') {
            start = startOfMonth(now);
            end = endOfMonth(now);
        } else if (period === 'year') {
            start = startOfYear(now);
            end = endOfYear(now);
        } else if (period === 'custom') {
            if (!customStart || !customEnd) return null;
            start = parseISO(customStart);
            end = parseISO(customEnd);
            if (!isValid(start) || !isValid(end) || start > end) return null;
        }

        const days = eachDayOfInterval({ start, end });
        const habitEntries = entries.filter(e => e.habitId === selectedHabit.id);

        const data = days.map(day => {
            const dayEntries = habitEntries.filter(e => isSameDay(new Date(e.timestamp), day));
            return dayEntries.reduce((sum, e) => sum + e.amount, 0);
        });

        return {
            labels: days.map(day => format(day, period === 'year' ? 'MMM d' : (period === 'week' ? 'EEE' : 'd'))),
            datasets: [
                {
                    label: `${selectedHabit.name} (${selectedHabit.unit})`,
                    data: data,
                    borderColor: '#38bdf8',
                    backgroundColor: 'rgba(56, 189, 248, 0.5)',
                    tension: 0.4,
                    pointRadius: period === 'year' ? 0 : 3, // Hide points for yearly view to reduce clutter
                },
            ],
        };
    }, [selectedHabit, entries, period, customStart, customEnd]);

    const stats = useMemo(() => {
        if (!selectedHabit) return null;
        // Filter stats based on the selected period as well? 
        // The original code calculated stats based on ALL entries for the habit, not just the visible ones.
        // However, usually dashboard stats reflect the visible period. 
        // Let's stick to the original behavior (all time) for now unless requested otherwise, 
        // OR update it to reflect the chart. 
        // The prompt didn't specify, but usually "Dashboard" implies current view. 
        // But the original code: `const habitEntries = entries.filter(e => e.habitId === selectedHabitId);` 
        // implies ALL time. I will keep it as ALL time for consistency with previous implementation, 
        // as changing it might be out of scope or unexpected.

        const habitEntries = entries.filter(e => e.habitId === selectedHabit.id);
        const total = habitEntries.reduce((sum, e) => sum + e.amount, 0);
        const avg = habitEntries.length ? (total / habitEntries.length).toFixed(1) : 0;

        return { total, avg, count: habitEntries.length };
    }, [selectedHabit, entries]);

    if (!habits.length) return <div className="text-center mt-md">No habits to show.</div>;

    return (
        <div className="flex-col gap-md" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Card>
                <div className="flex flex-col gap-md mb-md" style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="flex justify-between items-center">
                        <select
                            value={selectedHabitId}
                            onChange={(e) => setSelectedHabitId(e.target.value)}
                            className="input"
                            style={{ maxWidth: '200px' }}
                        >
                            {habits.map(h => (
                                <option key={h.id} value={h.id}>{h.name}</option>
                            ))}
                        </select>

                        <div className="flex gap-sm" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {['week', 'month', 'year', 'custom'].map(p => (
                                <button
                                    key={p}
                                    className={`btn ${period === p ? 'btn-primary' : ''}`}
                                    onClick={() => setPeriod(p)}
                                    style={{
                                        padding: '0.25rem 0.5rem',
                                        fontSize: '0.8rem',
                                        background: period === p ? 'var(--color-accent)' : 'transparent',
                                        border: '1px solid var(--color-accent)',
                                        textTransform: 'capitalize'
                                    }}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {period === 'custom' && (
                        <div className="flex gap-sm items-center" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <input
                                type="date"
                                className="input"
                                value={customStart}
                                onChange={(e) => setCustomStart(e.target.value)}
                                style={{ padding: '0.25rem' }}
                            />
                            <span>to</span>
                            <input
                                type="date"
                                className="input"
                                value={customEnd}
                                onChange={(e) => setCustomEnd(e.target.value)}
                                style={{ padding: '0.25rem' }}
                            />
                        </div>
                    )}
                </div>

                {chartData ? (
                    <div style={{ height: '300px' }}>
                        <Line
                            data={chartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                                        ticks: { color: '#94a3b8' }
                                    },
                                    x: {
                                        grid: { display: false },
                                        ticks: {
                                            color: '#94a3b8',
                                            maxTicksLimit: period === 'year' ? 12 : undefined // Limit ticks for year view
                                        }
                                    }
                                },
                                plugins: {
                                    legend: { labels: { color: '#f8fafc' } }
                                }
                            }}
                        />
                    </div>
                ) : (
                    <div className="text-center text-muted" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {period === 'custom' && (!customStart || !customEnd) ? 'Select a date range' : 'No data available'}
                    </div>
                )}
            </Card>

            {stats && (
                <div className="flex gap-md" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <Card className="text-center">
                        <h4 className="text-sm text-accent">Total</h4>
                        <p className="text-xl" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.total}</p>
                        <p className="text-xs">{selectedHabit.unit}</p>
                    </Card>
                    <Card className="text-center">
                        <h4 className="text-sm text-accent">Average</h4>
                        <p className="text-xl" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.avg}</p>
                        <p className="text-xs">per entry</p>
                    </Card>
                    <Card className="text-center">
                        <h4 className="text-sm text-accent">Entries</h4>
                        <p className="text-xl" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.count}</p>
                        <p className="text-xs">times</p>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
