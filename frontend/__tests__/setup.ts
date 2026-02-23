import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/en',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock i18n translations
vi.mock('@/lib/i18n-client', () => ({
  useTranslations: (namespace?: string) => {
    return (key: string) => {
      // Simple mock that returns the key without the namespace prefix
      const fullKey = namespace ? `${namespace}.${key}` : key;
      
      // Mock translations for common keys
      const translations: Record<string, string> = {
        'transaction.type': 'Transaction Type',
        'transaction.amount': 'Amount',
        'transaction.category': 'Category',
        'transaction.description': 'Description',
        'transaction.date': 'Date',
        'transaction.income': 'Income',
        'transaction.expense': 'Expense',
        'transaction.add': 'Add Transaction',
        'transaction.update': 'Update Transaction',
        'transaction.enterDescription': 'Enter description',
        'transaction.noTransactions': 'No transactions yet',
        'transaction.selectCategory': 'Select category',
        'dashboard.title': 'Dashboard',
        'dashboard.totalIncome': 'Total Income',
        'dashboard.totalExpenses': 'Total Expenses',
        'dashboard.balance': 'Balance',
      };
      
      return translations[fullKey] || fullKey;
    };
  },
  DictionaryProvider: ({ children }: any) => children,
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    button: 'button',
    p: 'p',
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});
