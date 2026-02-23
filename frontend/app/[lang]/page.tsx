'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/lib/i18n-client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, LogOut, User } from 'lucide-react';
import { Transaction, SummaryData } from '@/lib/types';
import { TransactionForm } from '@/components/finance/transaction-form';
import { TransactionList } from '@/components/finance/transaction-list';
import { SummaryCards } from '@/components/finance/summary-cards';
import { CategoryBreakdown } from '@/components/finance/category-breakdown';
import { DateRangeFilter } from '@/components/finance/date-range-filter';
import { Charts } from '@/components/finance/charts';
import { Pagination } from '@/components/finance/pagination';
import { LanguageSwitcher } from '@/components/language-switcher';
import { transactionAPI } from '@/lib/api';
import { getCurrentSession, logout } from '@/lib/auth';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 10;

export default function Home() {
  const router = useRouter();
  const t = useTranslations('dashboard');
  const tTransaction = useTranslations('transaction');
  const tCommon = useTranslations('common');
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<SummaryData>({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    byCategory: {},
  });
  const [isLoading, setIsLoading] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication
  useEffect(() => {
    const session = getCurrentSession();
    if (!session) {
      router.push('/auth');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Load transactions from API
  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const filters: any = {};
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;

      const data = await transactionAPI.getAll(filters);
      setFilteredTransactions(data);
    } catch (error: any) {
      toast.error(error.message || tTransaction('addFailed'));
      console.error('Error loading transactions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate]);

  // Load summary from API
  const loadSummary = useCallback(async () => {
    try {
      const filters: any = {};
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;

      const data = await transactionAPI.getSummary(filters);
      setSummary(data);
    } catch (error: any) {
      console.error('Error loading summary:', error);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (isAuthenticated) {
      loadTransactions();
      loadSummary();
    }
  }, [isAuthenticated, startDate, endDate, loadTransactions, loadSummary]);

  const handleAddTransaction = useCallback(
    async (data: any) => {
      setIsLoading(true);
      try {
        await transactionAPI.create({
          amount: data.amount,
          type: data.type,
          category: data.category,
          description: data.description,
          date: data.date,
        });

        await loadTransactions();
        await loadSummary();
        setIsDialogOpen(false);
        toast.success(tTransaction('addSuccess'));
      } catch (error: any) {
        toast.error(error.message || tTransaction('addFailed'));
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [loadTransactions, loadSummary]
  );

  const handleEditTransaction = useCallback(
    async (data: any) => {
      if (!editingTransaction) return;

      setIsLoading(true);
      try {
        await transactionAPI.update(editingTransaction.id, {
          amount: data.amount,
          type: data.type,
          category: data.category,
          description: data.description,
          date: data.date,
        });

        await loadTransactions();
        await loadSummary();
        setEditingTransaction(null);
        setIsDialogOpen(false);
        toast.success(tTransaction('updateSuccess'));
      } catch (error: any) {
        toast.error(error.message || tTransaction('updateFailed'));
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [editingTransaction, loadTransactions, loadSummary]
  );

  const handleDeleteTransaction = useCallback(async () => {
    if (!deleteTarget) return;

    setIsLoading(true);
    try {
      await transactionAPI.delete(deleteTarget.id);
      await loadTransactions();
      await loadSummary();
      setDeleteTarget(null);
      toast.success(tTransaction('deleteSuccess'));
    } catch (error: any) {
      toast.error(error.message || tTransaction('deleteFailed'));
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [deleteTarget, loadTransactions, loadSummary]);

  const handleOpenEditDialog = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsDialogOpen(true);
  };

  const handleLogout = () => {
    logout();
    toast.success(tCommon('logout'));
    router.push('/auth');
  };

  const resetDateFilter = () => {
    setStartDate('');
    setEndDate('');
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTransactions = filteredTransactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background smooth-transition">
      <div className="fixed inset-0 -z-10 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in-up">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('title')}
            </h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="default"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setEditingTransaction(null);
                    setIsDialogOpen(true);
                  }}
                >
                  <Plus className="mr-2 h-5 w-5" />
                  {t('addTransaction')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingTransaction ? tTransaction('edit') : tTransaction('add')}
                  </DialogTitle>
                  <DialogDescription>
                    {editingTransaction
                      ? tTransaction('updateDetails')
                      : tTransaction('fillDetails')}
                  </DialogDescription>
                </DialogHeader>

                <TransactionForm
                  transaction={editingTransaction || undefined}
                  onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
                  isLoading={isLoading}
                />
              </DialogContent>
            </Dialog>

            <LanguageSwitcher />

            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/profile')}
              className="w-full sm:w-auto smooth-transition"
            >
              <User className="h-4 w-4 mr-2" />
              {tCommon('profile')}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full sm:w-auto hover:bg-red-100 dark:hover:bg-red-900/30 smooth-transition"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {tCommon('logout')}
            </Button>
          </div>
        </div>

        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <SummaryCards summary={summary} />
        </div>

        <div className="mb-8">
          <Charts transactions={filteredTransactions} summary={summary} />
        </div>

        <div className="mb-8 p-4 rounded-lg border border-border bg-card">
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onReset={resetDateFilter}
          />
        </div>

        <div className="grid gap-6 sm:gap-8 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                {t('transactions')} ({filteredTransactions.length})
              </h2>
            </div>
            <TransactionList
              transactions={paginatedTransactions}
              onEdit={handleOpenEditDialog}
              onDelete={(transaction) => setDeleteTarget(transaction)}
              isLoading={isLoading}
            />
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                {t('categoryBreakdown')}
              </h2>
            </div>
            <CategoryBreakdown summary={summary} />
          </div>
        </div>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tTransaction('delete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {tTransaction('deleteConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>{tCommon('cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteTransaction}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? tCommon('loading') : tCommon('delete')}
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
