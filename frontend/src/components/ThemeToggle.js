'use client';

import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { key: 'light', label: 'Light', icon: '☀️' },
    { key: 'dark', label: 'Dark', icon: '🌙' },
  ];

  return (
    <div className="flex items-center bg-gray-700/50 rounded-lg p-1 gap-1">
      {themes.map((t) => (
        <button
          key={t.key}
          onClick={() => setTheme(t.key)}
          title={t.label}
          className={`p-1.5 rounded-md text-sm transition-colors ${
            theme === t.key
              ? 'bg-gray-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-600/50'
          }`}
          aria-label={`Switch to ${t.label} theme`}
        >
          <span className="text-base leading-none">{t.icon}</span>
        </button>
      ))}
    </div>
  );
}
