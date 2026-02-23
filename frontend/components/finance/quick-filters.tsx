'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';
import { useTranslations } from '@/lib/i18n-client';

interface QuickFiltersProps {
  onFilterChange: (startDate: string, endDate: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export function QuickFilters({ onFilterChange, activeFilter, setActiveFilter }: QuickFiltersProps) {
  const t = useTranslations();
  const getDateRange = (filter: string): { start: string; end: string } => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (filter) {
      case 'today':
        return {
          start: today.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0],
        };
      case 'thisWeek': {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        return {
          start: weekStart.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0],
        };
      }
      case 'thisMonth': {
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        return {
          start: monthStart.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0],
        };
      }
      case 'lastMonth': {
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        return {
          start: lastMonthStart.toISOString().split('T')[0],
          end: lastMonthEnd.toISOString().split('T')[0],
        };
      }
      case 'last3Months': {
        const threeMonthsAgo = new Date(today);
        threeMonthsAgo.setMonth(today.getMonth() - 3);
        return {
          start: threeMonthsAgo.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0],
        };
      }
      case 'thisYear': {
        const yearStart = new Date(today.getFullYear(), 0, 1);
        return {
          start: yearStart.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0],
        };
      }
      default:
        return { start: '', end: '' };
    }
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    if (filter === 'allTime') {
      onFilterChange('', '');
    } else {
      const { start, end } = getDateRange(filter);
      onFilterChange(start, end);
    }
  };

  const filters = [
    { key: 'allTime', label: t('filters.allTime'), icon: Clock },
    { key: 'today', label: t('filters.today'), icon: Calendar },
    { key: 'thisWeek', label: t('filters.thisWeek'), icon: Calendar },
    { key: 'thisMonth', label: t('filters.thisMonth'), icon: Calendar },
    { key: 'lastMonth', label: t('filters.lastMonth'), icon: Calendar },
    { key: 'last3Months', label: t('filters.last3Months'), icon: Calendar },
    { key: 'thisYear', label: t('filters.thisYear'), icon: Calendar },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter, index) => {
        const Icon = filter.icon;
        return (
          <motion.div
            key={filter.key}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Button
              variant={activeFilter === filter.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFilterClick(filter.key)}
              className="gap-2"
            >
              <Icon className="h-3 w-3" />
              {filter.label}
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
}
