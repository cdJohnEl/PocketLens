import React from 'react';
import { render, screen } from '@testing-library/react';
import { TransactionsPage } from '../components/transactions-page';

describe('TransactionsPage', () => {
  it('renders transaction list and CSV export', () => {
    render(
      <TransactionsPage
        transactions={[
          { id: '1', amount: 100, type: 'Income', category: 'Salary', date: '2025-09-20', method: 'Bank' },
        ]}
        onTransactionChange={() => {}}
      />
    );
    expect(screen.getByText(/transactions/i)).toBeInTheDocument();
    expect(screen.getByText(/CSV/i)).toBeInTheDocument();
  });
});
