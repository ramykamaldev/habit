import React from 'react';

const Layout = ({ children }) => {
    return (
        <div className="container">
            <header className="flex justify-between items-center mb-md">
                <h1 className="text-accent">HabitTrack</h1>
                {/* Placeholder for user profile or settings if needed */}
            </header>
            <main className="flex-col gap-md">
                {children}
            </main>
        </div>
    );
};

export default Layout;
