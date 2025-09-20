import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardContent from '../components/dashboard-content';

describe('DashboardContent', () => {
  it('renders dashboard sections', () => {
    render(<DashboardContent activeTab="dashboard" transactions={[]} />);
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });
});
