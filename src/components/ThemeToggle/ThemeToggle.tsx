'use client';

import type { Theme } from '../../context/themeContext.ts';
import { useTheme } from '../../context/useTheme.ts';
import { useTranslations } from 'next-intl';
import './ThemeToggle.scss';

const THEMES: Theme[] = ['light', 'dark'];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations('theme');

  return (
    <div className="theme-toggle" role="group" aria-label={t('ariaLabel')}>
      {THEMES.map((option) => (
        <label key={option} className="theme-toggle__option">
          <input
            type="radio"
            name="app-theme"
            value={option}
            checked={theme === option}
            onChange={() => setTheme(option)}
          />
          <span>{t(option)}</span>
        </label>
      ))}
    </div>
  );
}
