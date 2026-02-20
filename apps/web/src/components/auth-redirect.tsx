'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

interface AuthRedirectProps {
  children: React.ReactNode;
  href: string;
  className?: string;
  onClick?: () => void;
}

/**
 * Компонент с проверкой аутентификации
 * Если пользователь авторизован - перенаправляет в dashboard
 * Если нет - переходит по указанному href
 */
export function AuthRedirect({ children, href, className, onClick }: AuthRedirectProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, initialize } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Помечаем что загрузка завершена
    initialize();
  }, [initialize]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isLoading) return;

    if (isAuthenticated) {
      // Пользователь авторизован - перенаправляем в dashboard
      router.push('/dashboard');
    } else {
      // Пользователь не авторизован - переходим на страницу регистрации/авторизации
      router.push(href);
    }

    onClick?.();
  };

  // На сервере или при загрузке показываем обычную ссылку
  if (!isClient || isLoading) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  // Рендерим кнопку с обработчиком клика
  // Используем span вместо button чтобы избежать вложенности кнопок
  return (
    <span
      onClick={handleClick}
      className={className}
      style={{ cursor: 'pointer', display: 'inline-flex' }}
    >
      {children}
    </span>
  );
}
