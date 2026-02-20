'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, Key, Globe, Server, Menu, X, LogOut } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useAdminAuthStore } from '@/stores/admin-auth-store';
import { Button } from '@/components/ui';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  {
    name: 'apiKeys',
    href: '/admin',
    icon: Key,
    adminOnly: true,
  },
  {
    name: 'generalSettings',
    href: '/admin/general',
    icon: Globe,
    adminOnly: false,
  },
  {
    name: 'services',
    href: '/admin/services',
    icon: Server,
    adminOnly: true,
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { isAdminAuthenticated, logout } = useAdminAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Show login page if not authenticated and not on login page
  if (!isAdminAuthenticated && pathname !== '/admin/login') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-muted-foreground">Admin authentication required</p>
          <Link href="/admin/login">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Show login page
  if (pathname === '/admin/login') {
    return children;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-4 text-muted-foreground hover:text-foreground"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-card border-r transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-14 items-center border-b px-6">
              <Link href="/admin" className="flex items-center gap-2">
                <Settings className="h-6 w-6" />
                <span className="font-bold">{t.admin.title}</span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {t.admin[item.name as keyof typeof t.admin]}
                  </Link>
                );
              })}
            </nav>

            {/* Logout & Back */}
            <div className="space-y-2 border-t p-4">
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="w-full justify-start gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
              <Link
                href="/"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                ← Back to Site
              </Link>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
