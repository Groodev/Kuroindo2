import { Theme } from '../theme';
import { useBookmarks } from '../hooks/useBookmarks';
import { ComicCard } from './ComicCard';
import { BookmarkX } from 'lucide-react';

interface BookmarksPageProps {
  theme: Theme;
  onComicClick: (slug: string) => void;
}

export const BookmarksPage = ({ theme, onComicClick }: BookmarksPageProps) => {
  const { bookmarks } = useBookmarks();

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 px-4">
        <BookmarkX size={64} style={{ color: theme.text.muted }} className="mb-4" />
        <p className="text-lg text-center" style={{ color: theme.text.muted }}>
          No bookmarks yet
        </p>
        <p className="text-sm text-center mt-2" style={{ color: theme.text.muted }}>
          Start adding your favorite manhwa to bookmarks!
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <h1 className="text-2xl font-bold mb-6" style={{ color: theme.text.primary }}>
        My Bookmarks
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {bookmarks.map((bookmark) => (
          <ComicCard
            key={bookmark.slug}
            title={bookmark.title}
            image={bookmark.image}
            chapter={bookmark.chapter}
            onClick={() => onComicClick(bookmark.slug)}
            theme={theme}
          />
        ))}
      </div>
    </div>
  );
};
