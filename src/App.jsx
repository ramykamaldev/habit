import React, { useState } from 'react';
import { HabitProvider } from './context/HabitContext';
import Layout from './components/Layout';
import HabitForm from './components/HabitForm';
import HabitList from './components/HabitList';
import EntryModal from './components/EntryModal';
import Dashboard from './components/Dashboard'; // Will implement next

// Temporary placeholder for Dashboard until implemented
const DashboardPlaceholder = () => <div className="text-center mt-md">Dashboard Coming Soon</div>;

function App() {
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [view, setView] = useState('habits'); // 'habits' or 'dashboard'

  return (
    <HabitProvider>
      <Layout>
        <div className="flex justify-between mb-md" style={{ marginBottom: '1rem' }}>
          <button
            className={`btn ${view === 'habits' ? 'btn-primary' : ''}`}
            onClick={() => setView('habits')}
            style={{ flex: 1, marginRight: '0.5rem', background: view === 'habits' ? 'var(--color-accent)' : 'var(--color-bg-card)' }}
          >
            Habits
          </button>
          <button
            className={`btn ${view === 'dashboard' ? 'btn-primary' : ''}`}
            onClick={() => setView('dashboard')}
            style={{ flex: 1, marginLeft: '0.5rem', background: view === 'dashboard' ? 'var(--color-accent)' : 'var(--color-bg-card)' }}
          >
            Dashboard
          </button>
        </div>

        {view === 'habits' ? (
          <>
            <HabitForm />
            <HabitList onAddEntry={setSelectedHabit} />
          </>
        ) : (
          <Dashboard />
        )}

        <EntryModal
          isOpen={!!selectedHabit}
          onClose={() => setSelectedHabit(null)}
          habit={selectedHabit}
        />
      </Layout>
    </HabitProvider>
  );
}

export default App;
