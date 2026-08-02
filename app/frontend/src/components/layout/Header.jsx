import { useTheme } from '../../hooks/useTheme';
import ThemeToggle from './ThemeToggle';

function Header({ townSelect }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-100 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-lg font-black text-white">
            H
          </span>
          <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            HDB Resale <span className="text-brand-600">Explorer</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          {townSelect}
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </div>
    </header>
  );
}

export default Header;
