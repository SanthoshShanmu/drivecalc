"use client";

import { useEffect, useState } from 'react';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  // Initialize state but don't set a default value
  const [darkMode, setDarkMode] = useState<boolean | null>(null);

  // Initialize theme state after component mounts - client-side only
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark-mode');
    setDarkMode(isDarkMode);
  }, []);

  // Only attempt to toggle theme when darkMode state is non-null
  const toggleTheme = () => {
    // Only run when we're sure we're on the client and darkMode is initialized
    if (darkMode !== null) {
      const newDarkMode = !darkMode;
      
      if (newDarkMode) {
        document.documentElement.classList.add('dark-mode');
        document.documentElement.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark-mode');
        document.documentElement.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
      }
      
      setDarkMode(newDarkMode);
    }
  };

  // Don't render the button until we know the theme state
  if (darkMode === null) return null;

  return (
    <button 
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={darkMode ? 'Bytt til lys modus' : 'Bytt til mørk modus'}
    >
      {darkMode ? '☀️' : '🌙'}
    </button>
  );
}