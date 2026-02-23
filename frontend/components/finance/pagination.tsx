'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from '@/lib/i18n-client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const t = useTranslations();
  
  return (
    <div className="flex items-center justify-center gap-2 mt-4 animate-fade-in-up">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="smooth-transition"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }).map((_, i) => {
          const pageNum = i + 1;
          const isCurrentPage = pageNum === currentPage;
          const isVisible =
            pageNum === 1 ||
            pageNum === totalPages ||
            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);

          if (!isVisible) {
            return null;
          }

          if (
            (pageNum === 1 && currentPage > 3) ||
            (pageNum === totalPages && currentPage < totalPages - 2)
          ) {
            return (
              <span key={`ellipsis-${pageNum}`} className="px-2 text-muted-foreground">
                ...
              </span>
            );
          }

          return (
            <Button
              key={pageNum}
              variant={isCurrentPage ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              className={`smooth-transition ${
                isCurrentPage
                  ? 'bg-gradient-to-r from-primary to-secondary text-white'
                  : 'hover:border-primary'
              }`}
            >
              {pageNum}
            </Button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="smooth-transition"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <span className="text-xs sm:text-sm text-muted-foreground ml-2">
        {t('filters.page')} {currentPage} {t('filters.of')} {totalPages}
      </span>
    </div>
  );
}
