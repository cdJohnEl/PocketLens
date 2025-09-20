import React from 'react';
import { render, screen } from '@testing-library/react';
import { ReportsPage } from '../components/reports-page';

describe('ReportsPage', () => {
  it('renders Finance Reports header', () => {
    render(<ReportsPage transactions={[]} />);
    expect(screen.getByText(/Finance Reports/i)).toBeInTheDocument();
  });
});
