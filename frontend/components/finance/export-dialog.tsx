'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { Transaction } from '@/lib/types';
import { toast } from 'sonner';

interface ExportDialogProps {
  transactions: Transaction[];
}

export function ExportDialog({ transactions }: ExportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const exportToCSV = () => {
    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount'];
    const rows = transactions.map(t => [
      t.date,
      t.type,
      t.category,
      t.description,
      t.amount.toString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success('Transactions exported successfully');
    setIsOpen(false);
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(transactions, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success('Transactions exported successfully');
    setIsOpen(false);
  };

  const formats = [
    {
      name: 'CSV',
      description: 'Comma-separated values file',
      icon: FileSpreadsheet,
      action: exportToCSV,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      name: 'JSON',
      description: 'JavaScript Object Notation',
      icon: FileText,
      action: exportToJSON,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Transactions</DialogTitle>
          <DialogDescription>
            Choose a format to export your transactions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {formats.map((format, index) => {
            const Icon = format.icon;
            return (
              <motion.button
                key={format.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={format.action}
                className="w-full flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent transition-colors text-left"
              >
                <div className={`p-3 rounded-full ${format.bgColor}`}>
                  <Icon className={`h-6 w-6 ${format.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{format.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {format.description}
                  </p>
                </div>
                <Download className="h-5 w-5 text-muted-foreground" />
              </motion.button>
            );
          })}
        </div>

        <p className="text-sm text-muted-foreground mt-4">
          Exporting {transactions.length} transactions
        </p>
      </DialogContent>
    </Dialog>
  );
}
