import { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { Header } from './components/Header';
import { SideNav } from './components/SideNav';
import { SearchModal } from './components/SearchModal';
import { HomePage } from './components/HomePage';
import { SeriesPage } from './components/SeriesPage';
import { ReaderPage } from './components/ReaderPage';
import { BookmarksPage } from './components/BookmarksPage';

type View = 'home' | 'popular' | 'latest' | 'genres' | 'bookmarks' | 'reading' | 'settings' | 'account';

function App() {
  const { mode, theme, toggle } = useTheme();
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedComic, setSelectedComic] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  const handleComicClick = (slug: string) => {
    setSelectedComic(slug);
    setSelectedChapter(null);
  };

  const handleChapterClick = (chapterSlug: string) => {
    setSelectedChapter(chapterSlug);
  };

  const handleBackFromSeries = () => {
    setSelectedComic(null);
    setSelectedChapter(null);
  };

  const handleBackFromReader = () => {
    setSelectedChapter(null);
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view as View);
    setSelectedComic(null);
    setSelectedChapter(null);
  };

  const renderContent = () => {
    if (selectedChapter) {
      return (
        <ReaderPage
          chapterSlug={selectedChapter}
          theme={theme}
          onBack={handleBackFromReader}
        />
      );
    }

    if (selectedComic) {
      return (
        <SeriesPage
          slug={selectedComic}
          theme={theme}
          onBack={handleBackFromSeries}
          onChapterClick={handleChapterClick}
        />
      );
    }

    switch (currentView) {
      case 'bookmarks':
        return <BookmarksPage theme={theme} onComicClick={handleComicClick} />;
      case 'home':
      case 'popular':
      case 'latest':
      default:
        return <HomePage theme={theme} onComicClick={handleComicClick} />;
    }
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.bg.primary, color: theme.text.primary }}
    >
      <Header
        theme={theme}
        themeMode={mode}
        onMenuClick={() => setNavOpen(true)}
        onSearchClick={() => setSearchOpen(true)}
        onThemeToggle={toggle}
      />

      <SideNav
        isOpen={navOpen}
        onClose={() => setNavOpen(false)}
        theme={theme}
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        theme={theme}
        onSelectComic={handleComicClick}
      />

      <main>{renderContent()}</main>
    </div>
  );
}

export default App;
