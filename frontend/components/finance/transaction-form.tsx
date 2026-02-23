'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Transaction, TRANSACTION_CATEGORIES } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useTranslations } from '@/lib/i18n-client';

interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export function TransactionForm({ transaction, onSubmit, isLoading = false }: TransactionFormProps) {
  const t = useTranslations();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const transactionType = transaction?.type || 'expense';

  const transactionFormSchema = z.object({
    type: z.enum(['income', 'expense']),
    amount: z.coerce.number().positive(t('transaction.amountPositive')),
    category: z.string().min(1, t('transaction.categoryRequired')),
    description: z.string().min(1, t('transaction.descriptionRequired')).max(200, t('transaction.descriptionMax')),
    date: z.string().min(1, t('transaction.dateRequired')),
  });

  type TransactionFormValues = z.infer<typeof transactionFormSchema>;

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      type: transaction?.type || 'expense',
      amount: transaction?.amount || undefined,
      category: transaction?.category || '',
      description: transaction?.description || '',
      date: transaction?.date || new Date().toISOString().split('T')[0],
    },
  });

  const handleSubmit = async (data: TransactionFormValues) => {
    setSubmitError(null);
    try {
      await onSubmit(data);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const selectedType = form.watch('type');
  const categories = TRANSACTION_CATEGORIES[selectedType];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 sm:space-y-6 animate-fade-in-up">
        {submitError && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50 smooth-transition">
            {submitError}
          </div>
        )}

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs sm:text-sm">{t('transaction.type')}</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="income">{t('transaction.income')}</SelectItem>
                  <SelectItem value="expense">{t('transaction.expense')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs sm:text-sm">{t('transaction.amount')}</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">$</span>
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="flex-1"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs sm:text-sm">{t('transaction.category')}</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('transaction.selectCategory')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs sm:text-sm">{t('transaction.description')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('transaction.enterDescription')}
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t('transaction.charactersCount').replace('{count}', (field.value?.length || 0).toString())}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs sm:text-sm">{t('transaction.date')}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={isLoading} 
          className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold smooth-transition h-10 shadow-lg hover:shadow-xl"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {transaction ? t('transaction.edit') : t('transaction.add')}
        </Button>
      </form>
    </Form>
  );
}
