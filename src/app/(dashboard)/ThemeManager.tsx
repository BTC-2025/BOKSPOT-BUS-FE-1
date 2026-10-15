'use client';

import { useEffect } from 'react';
import { useVendorStore } from '@/lib/store';

export function ThemeManager() {
  const { theme } = useVendorStore();

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    const applyTheme = (currentTheme: 'system' | 'light' | 'dark') => {
      const isLight = 
        currentTheme === 'light' || 
        (currentTheme === 'system' && window.matchMedia('(prefers-color-scheme: light)').matches);

      if (isLight) {
        root.classList.add('light');
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
        if (body) {
          body.classList.add('light');
          body.classList.remove('dark');
        }
      } else {
        root.classList.remove('light');
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
        if (body) {
          body.classList.remove('light');
          body.classList.add('dark');
        }
      }
    };

    applyTheme(theme || 'system');

    // Listen to changes in system preferences if theme is system
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handleSystemChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme]);

  return null;
}
