import { useEffect } from 'react';
import { X, Home, TrendingUp, Clock, Grid, Bookmark, BookMarked, Settings, User } from 'lucide-react';
import { Theme } from '../theme';

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  currentView: string;
  onNavigate: (view: string) => void;
}

export const SideNav = ({ isOpen, onClose, theme, currentView, onNavigate }: SideNavProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'popular', label: 'Popular', icon: TrendingUp },
    { id: 'latest', label: 'Latest', icon: Clock },
    { id: 'genres', label: 'Genres', icon: Grid },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { id: 'reading', label: 'Reading List', icon: BookMarked },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'account', label: 'Account', icon: User },
  ];

  const handleNavigate = (view: string) => {
    onNavigate(view);
    onClose();
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-60' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      <nav
        className={`fixed top-0 left-0 h-full w-[80%] max-w-[320px] transition-transform duration-300 ease-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: theme.bg.secondary }}
        aria-hidden={!isOpen}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: theme.border }}>
            <h2 className="text-2xl font-bold" style={{ color: theme.text.primary }}>
              <span className="font-bold">Kuro</span>
              <span className="font-light">Indo</span>
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-opacity-10 transition-all"
              style={{ color: theme.text.secondary, backgroundColor: theme.accent.primary + '20' }}
              aria-label="Close navigation"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className="w-full flex items-center gap-4 px-6 py-4 transition-all duration-200"
                  style={{
                    color: isActive ? theme.accent.primary : theme.text.secondary,
                    backgroundColor: isActive ? theme.accent.primary + '15' : 'transparent',
                    borderLeft: isActive ? `3px solid ${theme.accent.primary}` : '3px solid transparent',
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon size={22} />
                  <span className="text-base font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-6 border-t" style={{ borderColor: theme.border }}>
            <p className="text-xs" style={{ color: theme.text.muted }}>
              KuroIndo v1.0
            </p>
            <p className="text-xs mt-1" style={{ color: theme.text.muted }}>
              Read manhwa & manhua anytime
            </p>
          </div>
        </div>
      </nav>
    </>
  );
};
