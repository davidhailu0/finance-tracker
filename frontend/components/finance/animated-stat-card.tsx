'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslations } from '@/lib/i18n-client';

interface AnimatedStatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: number;
  format?: 'currency' | 'percentage' | 'number';
  delay?: number;
  color?: 'green' | 'red' | 'blue' | 'purple' | 'orange';
}

const colorClasses = {
  green: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
  red: 'from-red-500/20 to-rose-500/20 border-red-500/30',
  blue: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
  purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
  orange: 'from-orange-500/20 to-amber-500/20 border-orange-500/30',
};

const iconColorClasses = {
  green: 'text-green-600 dark:text-green-400',
  red: 'text-red-600 dark:text-red-400',
  blue: 'text-blue-600 dark:text-blue-400',
  purple: 'text-purple-600 dark:text-purple-400',
  orange: 'text-orange-600 dark:text-orange-400',
};

export function AnimatedStatCard({
  title,
  value,
  icon: Icon,
  trend,
  format = 'currency',
  delay = 0,
  color = 'blue',
}: AnimatedStatCardProps) {
  const t = useTranslations();
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const formatValue = (val: number) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
    } else if (format === 'percentage') {
      return `${val.toFixed(1)}%`;
    }
    return val.toFixed(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className={`relative overflow-hidden bg-gradient-to-br ${colorClasses[color]} border-2 backdrop-blur-sm`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              <motion.p
                className="text-3xl font-bold"
                key={displayValue}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {formatValue(displayValue)}
              </motion.p>
              {trend !== undefined && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className={`flex items-center text-sm ${
                    trend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  <span>{trend >= 0 ? '↑' : '↓'}</span>
                  <span className="ml-1">{Math.abs(trend).toFixed(1)}%</span>
                  <span className="ml-1 text-muted-foreground">{t('charts.vsLastMonth')}</span>
                </motion.div>
              )}
            </div>
            <motion.div
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: delay + 0.2 }}
              className={`p-3 rounded-full bg-background/50 ${iconColorClasses[color]}`}
            >
              <Icon className="h-6 w-6" />
            </motion.div>
          </div>
        </CardContent>

        {/* Animated background effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{
            duration: 2,
            delay: delay + 0.5,
            repeat: Infinity,
            repeatDelay: 5,
          }}
        />
      </Card>
    </motion.div>
  );
}
