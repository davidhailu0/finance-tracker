import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionForm } from '@/components/finance/transaction-form';

describe('TransactionForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders form with all fields', () => {
    render(<TransactionForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/transaction type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add transaction/i })).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    render(<TransactionForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText(/amount/i), '100');
    await user.click(screen.getByLabelText(/category/i));
    await user.click(screen.getByText('Food'));
    await user.type(screen.getByLabelText(/description/i), 'Grocery shopping');

    await user.click(screen.getByRole('button', { name: /add transaction/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'expense',
          amount: 100,
          category: 'Food',
          description: 'Grocery shopping',
        })
      );
    });
  });

  it('shows validation errors for invalid data', async () => {
    const user = userEvent.setup();

    render(<TransactionForm onSubmit={mockOnSubmit} />);

    await user.click(screen.getByRole('button', { name: /add transaction/i }));

    await waitFor(() => {
      expect(screen.getByText(/amount must be greater than 0/i)).toBeInTheDocument();
      expect(screen.getByText(/please select a category/i)).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('displays error message on submit failure', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockRejectedValue(new Error('Network error'));

    render(<TransactionForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText(/amount/i), '100');
    await user.click(screen.getByLabelText(/category/i));
    await user.click(screen.getByText('Food'));
    await user.type(screen.getByLabelText(/description/i), 'Test');

    await user.click(screen.getByRole('button', { name: /add transaction/i }));

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  it('populates form with transaction data in edit mode', () => {
    const transaction = {
      id: '1',
      type: 'income' as const,
      amount: 500,
      category: 'Salary',
      description: 'Monthly salary',
      date: '2024-01-15',
      createdAt: '2024-01-15T00:00:00Z',
    };

    render(<TransactionForm transaction={transaction} onSubmit={mockOnSubmit} />);

    expect(screen.getByDisplayValue('500')).toBeInTheDocument();
    expect(screen.getByText('Salary')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Monthly salary')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update transaction/i })).toBeInTheDocument();
  });

  it('updates categories when transaction type changes', async () => {
    const user = userEvent.setup();

    render(<TransactionForm onSubmit={mockOnSubmit} />);

    // Initially expense categories should be available
    await user.click(screen.getByLabelText(/category/i));
    expect(screen.getByText('Food')).toBeInTheDocument();

    // Change to income
    await user.click(screen.getByLabelText(/transaction type/i));
    await user.click(screen.getByText('Income'));

    // Now income categories should be available
    await user.click(screen.getByLabelText(/category/i));
    expect(screen.getByText('Salary')).toBeInTheDocument();
  });

  it('shows loading state when submitting', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<TransactionForm onSubmit={mockOnSubmit} isLoading={true} />);

    const submitButton = screen.getByRole('button', { name: /add transaction/i });
    expect(submitButton).toBeDisabled();
  });
});
