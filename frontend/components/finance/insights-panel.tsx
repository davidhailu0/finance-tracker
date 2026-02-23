'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, AlertCircle, Lightbulb, Target } from 'lucide-react';
import { Transaction } from '@/lib/types';

interface InsightsPanelProps {
  transactions: Transaction[];
}

export function InsightsPanel({ transactions }: InsightsPanelProps) {
  // Calculate insights
  const expenses = transactions.filter(t => t.type === 'expense');
  const categoryTotals = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  const avgDailySpending = expenses.length > 0
    ? expenses.reduce((sum, t) => sum + t.amount, 0) / 30
    : 0;

  const insights = [
    {
      icon: TrendingUp,
      title: 'Spending Trends',
      description: `Your average daily spending is $${avgDailySpending.toFixed(2)}`,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: AlertCircle,
      title: 'Top Categories',
      description: topCategory
        ? `${topCategory[0]} is your highest expense at $${topCategory[1].toFixed(2)}`
        : 'No expense data yet',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-500/10',
    },
    {
      icon: Lightbulb,
      title: 'Savings Tips',
      description: 'Consider setting a budget for your top spending categories',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Target,
      title: 'Recommendation',
      description: 'Try to save at least 20% of your income each month',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Financial Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className={`p-2 rounded-full ${insight.bgColor}`}>
                <Icon className={`h-5 w-5 ${insight.color}`} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{insight.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {insight.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
