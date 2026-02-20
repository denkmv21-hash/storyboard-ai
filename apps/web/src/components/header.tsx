'use client';

import Link from 'next/link';
import { Film, Home, Plus, Settings, LogOut, User, Shield } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useLanguage } from '@/contexts/language-context';
import { useAdminAuthStore } from '@/stores/admin-auth-store';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from './ui';

export function Header() {
  const { user, logout } = useAuthStore();
  const { t } = useLanguage();
  const { isAdminAuthenticated } = useAdminAuthStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 max-w-7xl">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Film className="h-6 w-6" />
            <span className="font-bold">Storyboard AI</span>
          </Link>

          {user && (
            <nav className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                title={t.dashboard.title}
              >
                <Home className="h-4 w-4" />
              </Link>
              <Link
                href="/projects"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                title={t.projects}
              >
                <Film className="h-4 w-4" />
              </Link>
              <Link
                href={isAdminAuthenticated ? "/admin" : "/admin/login"}
                className={`text-sm font-medium hover:text-foreground ${
                  isAdminAuthenticated
                    ? 'text-muted-foreground'
                    : 'text-primary'
                }`}
                title={isAdminAuthenticated ? "Admin Panel" : "Admin Login"}
              >
                {isAdminAuthenticated ? (
                  <Settings className="h-4 w-4" />
                ) : (
                  <Shield className="h-4 w-4" />
                )}
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <LanguageSwitcher />
          
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm">{user.email}</span>
                <span className="text-sm font-medium text-primary">
                  {user.credits} {t.credits}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">{t.login}</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">{t.signUp}</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
