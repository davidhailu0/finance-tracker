import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SummaryCards } from '@/components/finance/summary-cards';
import { SummaryData } from '@/lib/types';

describe('SummaryCards', () => {
  it('renders all summary cards with correct data', () => {
    const summary: SummaryData = {
      totalIncome: 5000,
      totalExpenses: 3000,
      balance: 2000,
      byCategory: {},
    };

    render(<SummaryCards summary={summary} />);

    expect(screen.getByText('Total Income')).toBeInTheDocument();
    expect(screen.getByText('$5000.00')).toBeInTheDocument();

    expect(screen.getByText('Total Expenses')).toBeInTheDocument();
    expect(screen.getByText('$3000.00')).toBeInTheDocument();

    expect(screen.getByText('Balance')).toBeInTheDocument();
    expect(screen.getByText('$2000.00')).toBeInTheDocument();
  });

  it('displays positive balance with correct styling', () => {
    const summary: SummaryData = {
      totalIncome: 5000,
      totalExpenses: 3000,
      balance: 2000,
      byCategory: {},
    };

    render(<SummaryCards summary={summary} />);

    const balanceElement = screen.getByText('$2000.00');
    expect(balanceElement).toHaveClass('text-transparent');
  });

  it('displays negative balance with correct styling', () => {
    const summary: SummaryData = {
      totalIncome: 2000,
      totalExpenses: 3000,
      balance: -1000,
      byCategory: {},
    };

    render(<SummaryCards summary={summary} />);

    const balanceElement = screen.getByText('-$1000.00');
    expect(balanceElement).toHaveClass('text-red-600');
  });

  it('displays zero balance correctly', () => {
    const summary: SummaryData = {
      totalIncome: 3000,
      totalExpenses: 3000,
      balance: 0,
      byCategory: {},
    };

    render(<SummaryCards summary={summary} />);

    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });

  it('renders icons for each card', () => {
    const summary: SummaryData = {
      totalIncome: 5000,
      totalExpenses: 3000,
      balance: 2000,
      byCategory: {},
    };

    const { container } = render(<SummaryCards summary={summary} />);

    // Check for SVG icons
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThanOrEqual(3);
  });
});
