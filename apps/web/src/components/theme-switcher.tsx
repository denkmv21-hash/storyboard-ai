'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { Button } from './ui';

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="relative w-10 px-0 h-9"
      title={theme === 'light' ? 'Включить темную тему' : 'Включить светлую тему'}
      type="button"
      aria-label="Переключить тему"
    >
      <span className="relative flex h-full w-full items-center justify-center">
        <Sun className="h-5 w-5 transition-all duration-300 ease-in-out" 
          style={{ opacity: theme === 'light' ? 1 : 0, transform: theme === 'light' ? 'rotate(0deg)' : 'rotate(90deg)' }} 
        />
        <Moon className="h-5 w-5 absolute transition-all duration-300 ease-in-out" 
          style={{ opacity: theme === 'dark' ? 1 : 0, transform: theme === 'dark' ? 'rotate(0deg)' : 'rotate(-90deg)' }} 
        />
      </span>
    </Button>
  );
}
