'use client';

import { Transaction, SummaryData } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { useTranslations } from '@/lib/i18n-client';

interface ChartsProps {
  transactions: Transaction[];
  summary: SummaryData;
}

const COLORS = {
  income: ['#10b981', '#059669', '#047857', '#065f46'],
  expense: ['#ef4444', '#dc2626', '#b91c1c', '#7f1d1d'],
  chart: ['#8864d5', '#06b6d4'],
};

export function Charts({ transactions, summary }: ChartsProps) {
  const t = useTranslations();
  // Prepare data for income vs expense bar chart
  const monthlyData = prepareMonthlyData(transactions);

  // Prepare data for category pie chart
  const incomeByCategory = Object.entries(summary.byCategory)
    .filter(([category]) => {
      const trans = transactions.find((t) => t.category === category);
      return trans && trans.type === 'income';
    })
    .map(([category, amount]) => ({
      name: category,
      value: amount,
    }));

  const expenseByCategory = Object.entries(summary.byCategory)
    .filter(([category]) => {
      const trans = transactions.find((t) => t.category === category);
      return trans && trans.type === 'expense';
    })
    .map(([category, amount]) => ({
      name: category,
      value: amount,
    }));

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
      {/* Monthly Income vs Expenses */}
      <Card className="card-hover gradient-bg border-primary/20 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">{t('charts.incomeVsExpenses')}</CardTitle>
          <CardDescription>{t('charts.monthlyComparison')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 100, 100, 0.1)" />
              <XAxis dataKey="month" stroke="currentColor" />
              <YAxis stroke="currentColor" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend />
              <Bar dataKey="income" fill={COLORS.chart[0]} radius={[8, 8, 0, 0]} name={t('charts.income')} />
              <Bar dataKey="expense" fill={COLORS.chart[1]} radius={[8, 8, 0, 0]} name={t('charts.expense')} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Income by Category */}
      {incomeByCategory.length > 0 && (
        <Card className="card-hover gradient-bg border-primary/20 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">{t('charts.incomeByCategory')}</CardTitle>
            <CardDescription>{t('charts.distributionOfIncome')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incomeByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: $${value.toFixed(0)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {incomeByCategory.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.income[index % COLORS.income.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Expenses by Category */}
      {expenseByCategory.length > 0 && (
        <Card className="card-hover gradient-bg border-primary/20 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">{t('charts.expensesByCategory')}</CardTitle>
            <CardDescription>{t('charts.whereMoneyGoes')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: $${value.toFixed(0)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseByCategory.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.expense[index % COLORS.expense.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Cumulative Balance Over Time */}
      <Card className="card-hover gradient-bg border-primary/20 overflow-hidden lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">{t('charts.balanceTrend')}</CardTitle>
          <CardDescription>{t('charts.balanceOverTime')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={prepareBalanceTrendData(transactions)}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 100, 100, 0.1)" />
              <XAxis dataKey="date" stroke="currentColor" />
              <YAxis stroke="currentColor" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value: number) => `$${value.toFixed(2)}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#8864d5"
                dot={false}
                strokeWidth={2}
                name={t('charts.balance')}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function prepareMonthlyData(transactions: Transaction[]) {
  const monthMap: Record<string, { income: number; expense: number }> = {};

  transactions.forEach((trans) => {
    const date = new Date(trans.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!monthMap[monthKey]) {
      monthMap[monthKey] = { income: 0, expense: 0 };
    }

    if (trans.type === 'income') {
      monthMap[monthKey].income += trans.amount;
    } else {
      monthMap[monthKey].expense += trans.amount;
    }
  });

  return Object.entries(monthMap)
    .map(([month, data]) => ({
      month,
      income: data.income,
      expense: data.expense,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

function prepareBalanceTrendData(transactions: Transaction[]) {
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let runningBalance = 0;
  const data: { date: string; balance: number }[] = [];

  sortedTransactions.forEach((trans) => {
    if (trans.type === 'income') {
      runningBalance += trans.amount;
    } else {
      runningBalance -= trans.amount;
    }

    data.push({
      date: new Date(trans.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      balance: runningBalance,
    });
  });

  return data;
}
