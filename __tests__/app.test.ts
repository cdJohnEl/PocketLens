import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../app/page';

describe('Home Page', () => {
  it('renders the PocketLens title', () => {
    render(<Home />);
    expect(screen.getByText(/PocketLens/i)).toBeInTheDocument();
  });
});
