import React from 'react';
import { render, screen } from '@testing-library/react';
import { SettingsPage } from '../components/settings-page';

describe('SettingsPage', () => {
  it('renders currency selector', () => {
    render(<SettingsPage />);
    expect(screen.getByText(/currency/i)).toBeInTheDocument();
  });
});
