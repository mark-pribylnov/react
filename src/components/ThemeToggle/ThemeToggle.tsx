import type { Theme } from '../../context/themeContext.ts';
import { useTheme } from '../../context/useTheme.ts';
import './ThemeToggle.scss';

const THEMES: Theme[] = ['light', 'dark'];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className="theme-toggle"
      role="group"
      aria-label="Application theme"
    >
      {THEMES.map((option) => (
        <label key={option} className="theme-toggle__option">
          <input
            type="radio"
            name="app-theme"
            value={option}
            checked={theme === option}
            onChange={() => setTheme(option)}
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
}
