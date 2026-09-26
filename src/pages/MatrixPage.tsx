import React from 'react';
import { HabitMatrix } from '../components/matrix/HabitMatrix';

export const MatrixPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Interactive Habit Matrix
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Complete month-by-month spreadsheet view with interactive checkbox matrix and progress calculations.
          </p>
        </div>
      </div>

      <HabitMatrix />
    </div>
  );
};
