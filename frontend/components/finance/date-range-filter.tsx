'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';
import { useTranslations } from '@/lib/i18n-client';

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onReset: () => void;
}

export function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onReset,
}: DateRangeFilterProps) {
  const t = useTranslations();
  
  const PRESET_RANGES = [
    { label: t('filters.today'), getValue: () => ({ start: new Date().toISOString().split('T')[0], end: new Date().toISOString().split('T')[0] }) },
    {
      label: t('filters.last7Days'),
      getValue: () => {
        const end = new Date();
        const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
        return {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0],
        };
      },
    },
    {
      label: t('filters.last30Days'),
      getValue: () => {
        const end = new Date();
        const start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
        return {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0],
        };
      },
    },
    {
      label: t('filters.thisMonth'),
      getValue: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0],
        };
      },
    },
    {
      label: t('filters.last3Months'),
      getValue: () => {
        const end = new Date();
        const start = new Date(end.getTime() - 90 * 24 * 60 * 60 * 1000);
        return {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0],
        };
      },
    },
    {
      label: t('filters.thisYear'),
      getValue: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const end = new Date(now.getFullYear(), 11, 31);
        return {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0],
        };
      },
    },
  ];
  const handlePresetSelect = (getValue: () => { start: string; end: string }) => {
    const { start, end } = getValue();
    onStartDateChange(start);
    onEndDateChange(end);
  };

  const isFiltered = startDate !== '' || endDate !== '';

  return (
    <div className="space-y-3 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <div className="flex-1 w-full">
          <label className="text-xs sm:text-sm font-medium text-foreground block mb-1">
            {t('filters.fromDate')}
          </label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="smooth-transition w-full"
          />
        </div>
        <div className="flex-1 w-full">
          <label className="text-xs sm:text-sm font-medium text-foreground block mb-1">
            {t('filters.toDate')}
          </label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="smooth-transition w-full"
          />
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="mt-6 sm:mt-0 w-full sm:w-auto hover:bg-red-100 dark:hover:bg-red-900/30 smooth-transition"
          >
            <X className="h-4 w-4 mr-1" />
            {t('filters.clear')}
          </Button>
        )}
      </div>

      <div>
        <label className="text-xs sm:text-sm font-medium text-foreground block mb-2">
          {t('filters.quickFilters')}
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESET_RANGES.map((range) => (
            <Button
              key={range.label}
              variant={
                startDate === range.getValue().start && endDate === range.getValue().end
                  ? 'default'
                  : 'outline'
              }
              size="sm"
              onClick={() => handlePresetSelect(range.getValue)}
              className="text-xs smooth-transition"
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
