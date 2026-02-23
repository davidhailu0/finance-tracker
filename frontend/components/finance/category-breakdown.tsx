'use client';

import { SummaryData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from '@/lib/i18n-client';

interface CategoryBreakdownProps {
  summary: SummaryData;
}

export function CategoryBreakdown({ summary }: CategoryBreakdownProps) {
  const t = useTranslations();
  const categoryEntries = Object.entries(summary.byCategory)
    .map(([key, value]) => ({
      key,
      value,
      type: key.split('-')[0],
      category: key.split('-').slice(1).join('-'),
    }))
    .sort((a, b) => b.value - a.value);

  if (categoryEntries.length === 0) {
    return (
      <Card className="card-hover gradient-bg border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">{t('categoryBreakdown.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {t('categoryBreakdown.noTransactions')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-hover gradient-bg border-primary/20 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg text-foreground">{t('categoryBreakdown.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {categoryEntries.map(({ key, value, type, category }, index) => (
            <div 
              key={key} 
              className="flex items-center justify-between gap-2 p-2 rounded-lg smooth-transition hover:bg-primary/5 dark:hover:bg-primary/10 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Badge
                  variant="outline"
                  className={`text-xs whitespace-nowrap flex-shrink-0 font-semibold ${
                    type === 'income'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-800'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800'
                  }`}
                >
                  {type === 'income' ? t('transaction.income') : t('transaction.expense')}
                </Badge>
                <span className="text-xs sm:text-sm font-medium truncate text-foreground">{category}</span>
              </div>
              <span
                className={`text-xs sm:text-sm font-bold whitespace-nowrap flex-shrink-0 ${
                  type === 'income'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent'
                    : 'bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent'
                }`}
              >
                ${value.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
