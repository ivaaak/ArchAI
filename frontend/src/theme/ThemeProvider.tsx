import { useEffect, useState } from 'react';
import { Theme, ThemeContext } from './themeContext';

const getInitialTheme = (): Theme => {
  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark-theme' || stored === 'light-theme') return stored;
  } catch {
    // storage unavailable
  }
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light-theme' : 'dark-theme';
};

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark-theme' ? 'light-theme' : 'dark-theme'));
  };

  useEffect(() => {
    // The class lives on <html> so body and portals get the theme variables too
    const root = document.documentElement;
    root.classList.remove('dark-theme', 'light-theme');
    root.classList.add(theme);
    root.style.colorScheme = theme === 'dark-theme' ? 'dark' : 'light';
    try {
      localStorage.setItem('theme', theme);
    } catch {
      // storage unavailable
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
