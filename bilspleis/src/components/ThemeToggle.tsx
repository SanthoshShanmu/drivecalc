"use client";

import { useEffect, useState } from 'react';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Initialize based on system preference or saved value
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      setDarkMode(true);
    } else if (savedTheme === 'light') {
      setDarkMode(false);
    } else {
      setDarkMode(isDarkMode);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-mode');
      document.documentElement.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <button 
      className={styles.toggle}
      onClick={() => setDarkMode(!darkMode)}
      aria-label={darkMode ? 'Bytt til lys modus' : 'Bytt til mørk modus'}
    >
      {darkMode ? '☀️' : '🌙'}
    </button>
  );
}