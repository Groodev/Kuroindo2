import { Menu, Search, Sun, Moon } from 'lucide-react';
import { Theme, ThemeMode } from '../theme';

interface HeaderProps {
  theme: Theme;
  themeMode: ThemeMode;
  onMenuClick: () => void;
  onSearchClick: () => void;
  onThemeToggle: () => void;
}

export const Header = ({ theme, themeMode, onMenuClick, onSearchClick, onThemeToggle }: HeaderProps) => {
  return (
    <header
      className="sticky top-0 z-30 backdrop-blur-md"
      style={{
        backgroundColor: theme.bg.overlay,
        borderBottom: `1px solid ${theme.border}`,
      }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg transition-all duration-200 hover:scale-110 md:hidden"
          style={{ color: theme.text.primary }}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>

        <div className="flex-1 flex justify-center md:justify-start md:ml-4">
          <h1 className="text-xl font-bold" style={{ color: theme.text.primary }}>
            <span className="font-bold">Kuro</span>
            <span className="font-light">Indo</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSearchClick}
            className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
            style={{ color: theme.text.primary }}
            aria-label="Search"
          >
            <Search size={22} />
          </button>
          <button
            onClick={onThemeToggle}
            className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
            style={{ color: theme.text.primary }}
            aria-label="Toggle theme"
          >
            {themeMode === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
};
