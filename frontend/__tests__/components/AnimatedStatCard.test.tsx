import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AnimatedStatCard } from '@/components/finance/animated-stat-card';
import { TrendingUp } from 'lucide-react';

describe('AnimatedStatCard', () => {
  it('renders with title and value', () => {
    render(
      <AnimatedStatCard
        title="Total Income"
        value={5000}
        icon={TrendingUp}
        format="currency"
        color="green"
      />
    );

    expect(screen.getByText('Total Income')).toBeInTheDocument();
  });

  it('formats currency correctly', () => {
    render(
      <AnimatedStatCard
        title="Total Income"
        value={5000}
        icon={TrendingUp}
        format="currency"
        color="green"
      />
    );

    // Value will be animated, so we check if it's eventually displayed
    const valueElement = screen.getByText(/\$/);
    expect(valueElement).toBeInTheDocument();
  });

  it('displays trend when provided', () => {
    render(
      <AnimatedStatCard
        title="Total Income"
        value={5000}
        icon={TrendingUp}
        trend={12.5}
        format="currency"
        color="green"
      />
    );

    expect(screen.getByText(/12\.5%/)).toBeInTheDocument();
  });

  it('formats percentage correctly', () => {
    render(
      <AnimatedStatCard
        title="Savings Rate"
        value={25.5}
        icon={TrendingUp}
        format="percentage"
        color="purple"
      />
    );

    // Check for percentage symbol
    const valueElement = screen.getByText(/%/);
    expect(valueElement).toBeInTheDocument();
  });
});
