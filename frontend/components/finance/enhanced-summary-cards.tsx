'use client';

import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';
import { AnimatedStatCard } from './animated-stat-card';
import { SummaryData } from '@/lib/types';
import { useTranslations } from '@/lib/i18n-client';

interface EnhancedSummaryCardsProps {
  summary: SummaryData;
}

export function EnhancedSummaryCards({ summary }: EnhancedSummaryCardsProps) {
  const t = useTranslations();
  // Calculate trends (mock data - you can calculate real trends from historical data)
  const incomeTrend = 12.5;
  const expenseTrend = -5.3;
  const balanceTrend = 18.2;
  const savingsRate = summary.totalIncome > 0 
    ? ((summary.balance / summary.totalIncome) * 100) 
    : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <AnimatedStatCard
        title={t('summary.totalIncome')}
        value={summary.totalIncome}
        icon={TrendingUp}
        trend={incomeTrend}
        format="currency"
        delay={0}
        color="green"
      />
      
      <AnimatedStatCard
        title={t('summary.totalExpenses')}
        value={summary.totalExpenses}
        icon={TrendingDown}
        trend={expenseTrend}
        format="currency"
        delay={0.1}
        color="red"
      />
      
      <AnimatedStatCard
        title={t('summary.balance')}
        value={summary.balance}
        icon={Wallet}
        trend={balanceTrend}
        format="currency"
        delay={0.2}
        color="blue"
      />
      
      <AnimatedStatCard
        title={t('summary.savingsRate')}
        value={savingsRate}
        icon={PiggyBank}
        format="percentage"
        delay={0.3}
        color="purple"
      />
    </div>
  );
}
