'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/lib/i18n-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { loginUser, registerUser } from '@/lib/auth';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const t = useTranslations('auth');
  const tValidation = useTranslations('validation');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);

  const authSchema = z.object({
    name: z.string().min(3, tValidation('minLength', { min: '3' })),
    email: z.string().email(tValidation('invalidEmail')),
    password: z.string().min(6, tValidation('minLength', { min: '6' })),
  });

  const loginSchema = z.object({
    email: z.string().email(tValidation('invalidEmail')),
    password: z.string().min(6, tValidation('minLength', { min: '6' })),
  });

  const form = useForm<any>({
    resolver: zodResolver(isSignUp ? authSchema : loginSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      const result = isSignUp 
        ? await registerUser(data.name, data.email, data.password)
        : await loginUser(data.email, data.password);

      if (result.success) {
        toast.success(result.message || (isSignUp ? t('registrationSuccess') : t('loginSuccess')));
        form.reset();
        router.push('/');
      } else {
        toast.error(result.message || t('authFailed'));
      }
    } catch (error) {
      toast.error(t('authFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Language Switcher */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      {/* Background gradient */}
      <div className="fixed inset-0 -z-10 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
      </div>

      <Card className="w-full max-w-md card-hover gradient-bg border-primary/20 animate-fade-in-up">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t('title')}
          </CardTitle>
          <CardDescription>
            {isSignUp ? t('createAccount') : t('welcomeBack')}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {isSignUp && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('name')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('enterName')}
                          {...field}
                          disabled={isLoading}
                          className="smooth-transition"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('email')}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t('enterEmail')}
                        {...field}
                        disabled={isLoading}
                        className="smooth-transition"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('password')}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={t('enterPassword')}
                        {...field}
                        disabled={isLoading}
                        className="smooth-transition"
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
                {isSignUp ? t('signUp') : t('signIn')}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    form.reset();
                  }}
                  className="text-sm text-muted-foreground hover:text-primary smooth-transition"
                >
                  {isSignUp ? t('alreadyHaveAccount') : t('dontHaveAccount')}
                </button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
