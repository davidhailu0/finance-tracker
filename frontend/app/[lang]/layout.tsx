import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import { DictionaryProvider } from '@/lib/i18n-client';
import { getDictionary, hasLocale, type Locale } from './dictionaries';
import { notFound } from 'next/navigation';
import '../globals.css';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'am' }, {lang: 'om'}, {lang: 'so'}, {lang: 'ti'}];
}

export const metadata: Metadata = {
  title: 'Finance Tracker',
  description: 'Track your income and expenses',
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const dictionary = await getDictionary(lang as Locale);

  return (
    <DictionaryProvider dictionary={dictionary}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster position="top-right" richColors />
      </ThemeProvider>
    </DictionaryProvider>
  );
}
