'use client';

import { SummaryData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useTranslations } from '@/lib/i18n-client';

interface SummaryCardsProps {
  summary: SummaryData;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const t = useTranslations();
  
  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
      <Card className="card-hover gradient-bg border-green-200 dark:border-green-900/50 overflow-hidden relative">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-xs sm:text-sm font-medium text-foreground">{t('summary.totalIncome')}</CardTitle>
          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent break-words">
            ${summary.totalIncome.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {t('summary.fromAllSources')}
          </p>
        </CardContent>
      </Card>

      <Card className="card-hover gradient-bg border-red-200 dark:border-red-900/50 overflow-hidden relative">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-xs sm:text-sm font-medium text-foreground">{t('summary.totalExpenses')}</CardTitle>
          <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
            <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent break-words">
            ${summary.totalExpenses.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {t('summary.totalSpent')}
          </p>
        </CardContent>
      </Card>

      <Card className="card-hover gradient-bg border-primary/30 dark:border-primary/50 overflow-hidden relative">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-xs sm:text-sm font-medium text-foreground">{t('summary.balance')}</CardTitle>
          <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
            <Wallet className="h-4 w-4 text-primary flex-shrink-0" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div
            className={`text-xl sm:text-2xl font-bold break-words ${
              summary.balance >= 0
                ? 'bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            ${summary.balance.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {t('summary.incomeMinusExpenses')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
