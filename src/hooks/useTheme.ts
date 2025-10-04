import { useState, useEffect } from 'react';
import { themes, ThemeMode } from '../theme';

export const useTheme = () => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;

    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', mode);
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const toggle = () => setMode(m => m === 'dark' ? 'light' : 'dark');

  return {
    mode,
    theme: themes[mode],
    toggle,
  };
};
