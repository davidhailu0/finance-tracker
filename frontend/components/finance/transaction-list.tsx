'use client';

import { Transaction } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { useTranslations } from '@/lib/i18n-client';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  isLoading?: boolean;
}

export function TransactionList({
  transactions,
  onEdit,
  onDelete,
  isLoading = false,
}: TransactionListProps) {
  const t = useTranslations();
  
  if (transactions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-gradient-to-br from-card to-card/50 p-8 text-center smooth-transition hover:border-primary/30">
        <p className="text-muted-foreground">
          {t('transaction.noTransactions')}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-x-auto smooth-transition card-hover">
      <div className="inline-block min-w-full">
        <Table>
          <TableHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10">
            <TableRow>
              <TableHead className="text-xs sm:text-sm font-semibold text-foreground">{t('transaction.date')}</TableHead>
              <TableHead className="text-xs sm:text-sm font-semibold text-foreground">{t('transaction.description')}</TableHead>
              <TableHead className="hidden sm:table-cell text-xs sm:text-sm font-semibold text-foreground">{t('transaction.category')}</TableHead>
              <TableHead className="text-right text-xs sm:text-sm font-semibold text-foreground">{t('transaction.amount')}</TableHead>
              <TableHead className="text-right text-xs sm:text-sm font-semibold text-foreground">{t('transaction.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction, index) => (
              <TableRow 
                key={transaction.id}
                className="smooth-transition hover:bg-primary/5 dark:hover:bg-primary/10 border-b border-border/50 last:border-b-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <TableCell className="font-medium text-xs sm:text-sm whitespace-nowrap text-foreground">
                  {format(new Date(transaction.date), 'MMM d')}
                </TableCell>
                <TableCell className="text-xs sm:text-sm max-w-[150px] sm:max-w-none truncate text-foreground">
                  {transaction.description}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30 dark:bg-primary/20 dark:border-primary/40">{transaction.category}</Badge>
                </TableCell>
                <TableCell className="text-right font-semibold text-xs sm:text-sm whitespace-nowrap">
                  <span
                    className={`font-bold ${
                      transaction.type === 'income'
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent'
                        : 'bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 sm:gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(transaction)}
                      disabled={isLoading}
                      className="h-8 w-8 p-0 hover:bg-primary/20 smooth-transition"
                    >
                      <Edit2 className="h-3 w-3 sm:h-4 sm:w-4 text-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(transaction)}
                      disabled={isLoading}
                      className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/30 smooth-transition"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 dark:text-red-400" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
