import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionList } from '@/components/finance/transaction-list';
import { Transaction } from '@/lib/types';

describe('TransactionList', () => {
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      type: 'income',
      amount: 1000,
      category: 'Salary',
      description: 'Monthly salary',
      date: '2024-01-15',
      createdAt: '2024-01-15T00:00:00Z',
    },
    {
      id: '2',
      type: 'expense',
      amount: 50,
      category: 'Food',
      description: 'Grocery shopping',
      date: '2024-01-16',
      createdAt: '2024-01-16T00:00:00Z',
    },
  ];

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  it('renders empty state when no transactions', () => {
    render(
      <TransactionList
        transactions={[]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText(/no transactions yet/i)).toBeInTheDocument();
  });

  it('renders transaction list with data', () => {
    render(
      <TransactionList
        transactions={mockTransactions}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Monthly salary')).toBeInTheDocument();
    expect(screen.getByText('Grocery shopping')).toBeInTheDocument();
    expect(screen.getByText('+$1000.00')).toBeInTheDocument();
    expect(screen.getByText('-$50.00')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <TransactionList
        transactions={mockTransactions}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButtons = screen.getAllByRole('button', { name: '' });
    await user.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockTransactions[0]);
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <TransactionList
        transactions={mockTransactions}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButtons = screen.getAllByRole('button', { name: '' });
    await user.click(deleteButtons[1]);

    expect(mockOnDelete).toHaveBeenCalledWith(mockTransactions[0]);
  });

  it('disables buttons when loading', () => {
    render(
      <TransactionList
        transactions={mockTransactions}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isLoading={true}
      />
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('displays correct styling for income and expense', () => {
    render(
      <TransactionList
        transactions={mockTransactions}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const incomeAmount = screen.getByText('+$1000.00');
    const expenseAmount = screen.getByText('-$50.00');

    expect(incomeAmount).toHaveClass('text-transparent');
    expect(expenseAmount).toHaveClass('text-transparent');
  });
});
