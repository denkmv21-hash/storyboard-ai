'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Film } from 'lucide-react';
import { Button, Input, Label, Card } from '@/components/ui';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { useLanguage } from '@/contexts/language-context';

export default function SignupPage() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authApi.signup(
        formData.email,
        formData.password,
        formData.name
      );

      if (response.data.success) {
        const { user, session, requiresConfirmation } = response.data.data;

        // If email confirmation is required, redirect to login
        if (requiresConfirmation || !session) {
          setError(t.auth.checkEmail);
          setIsLoading(false);
          return;
        }

        if (session) {
          setToken(session.access_token);
          localStorage.setItem('auth-token', session.access_token);
        }

        setUser({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || formData.name,
          avatarUrl: user.user_metadata?.avatar_url || null,
          credits: user.user_metadata?.credits || 10,
          subscriptionTier: user.user_metadata?.subscription_tier || 'free',
        });

        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8 shadow-2xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <Film className="mb-3 h-14 w-14 text-primary" />
          <h1 className="text-2xl font-bold">{t.auth.createAccount}</h1>
          <p className="text-muted-foreground">{t.auth.startCreatingStoryboards}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">{t.auth.name}</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t.auth.email}</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t.auth.password}</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              minLength={8}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t.auth.creatingAccount : t.auth.createAccountButton}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t.auth.alreadyHaveAccount}{' '}
          <Link href="/login" className="text-primary hover:underline">
            {t.auth.signIn}
          </Link>
        </p>
      </Card>
    </div>
  );
}
