'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentSession, logout } from '@/lib/auth';
import { Session } from '@/lib/types';
import { LogOut, User, Calendar, Shield } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useTranslations } from '@/lib/i18n-client';

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;
  const t = useTranslations();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const currentSession = getCurrentSession();
    if (!currentSession) {
      router.push(`/${lang}/auth`);
      return;
    }
    setSession(currentSession);
    setIsLoading(false);
  }, [router, lang]);

  const handleLogout = () => {
    logout();
    toast.success(t('profile.logoutSuccess'));
    router.push(`/${lang}/auth`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">{t('common.loading')}</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient */}
      <div className="fixed inset-0 -z-10 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
      </div>

      <div className="container mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between animate-fade-in-up">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('profile.title')}
            </h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">
              {t('profile.subtitle')}
            </p>
          </div>
          <Link href={`/${lang}`}>
            <Button variant="outline" className="smooth-transition">
              {t('profile.backToDashboard')}
            </Button>
          </Link>
        </div>

        {/* Profile Card */}
        <Card className="card-hover gradient-bg border-primary/20 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <User className="h-5 w-5 text-primary" />
              {t('profile.accountInformation')}
            </CardTitle>
            <CardDescription>{t('profile.accountDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Username */}
            <div className="p-4 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/20 space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <label className="text-sm font-semibold text-foreground">{t('profile.username')}</label>
              </div>
              <p className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {session.username}
              </p>
            </div>

            {/* User ID */}
            <div className="p-4 rounded-lg bg-secondary/5 dark:bg-secondary/10 border border-secondary/20 space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-secondary" />
                <label className="text-sm font-semibold text-foreground">{t('profile.userId')}</label>
              </div>
              <p className="text-xs sm:text-sm font-mono text-muted-foreground break-all">
                {session.userId}
              </p>
            </div>

            {/* Session Token */}
            <div className="p-4 rounded-lg bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <label className="text-sm font-semibold text-foreground">{t('profile.authToken')}</label>
              </div>
              <p className="text-xs font-mono text-muted-foreground break-all truncate">
                {session.token}
              </p>
              <p className="text-xs text-muted-foreground">{t('profile.authTokenDescription')}</p>
            </div>

            {/* Session Expiry */}
            <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                <label className="text-sm font-semibold text-foreground">{t('profile.sessionExpires')}</label>
              </div>
              {mounted && (
                <>
                  <p className="text-sm text-foreground font-medium">
                    {new Date(session.expiresAt).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('profile.sessionExpiresIn').replace('{days}', Math.ceil((new Date(session.expiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000)).toString())}
                  </p>
                </>
              )}
            </div>

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white font-semibold smooth-transition h-10 shadow-lg"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t('common.logout')}
            </Button>
          </CardContent>
        </Card>

        {/* Account Stats */}
        <div className="mt-8 grid gap-4 grid-cols-1 sm:grid-cols-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Card className="card-hover gradient-bg border-primary/20">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-foreground">{t('profile.accountStatus')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{t('profile.accountStatusActive')}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('profile.accountStatusDescription')}</p>
            </CardContent>
          </Card>

          <Card className="card-hover gradient-bg border-primary/20">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-foreground">{t('profile.memberSince')}</CardTitle>
            </CardHeader>
            <CardContent>
              {mounted && (
                <>
                  <p className="text-lg font-bold text-foreground">
                    {new Date().toLocaleDateString(lang === 'am' ? 'am-ET' : 'en-US', { year: 'numeric', month: 'long' })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{t('profile.accountCreated')}</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
