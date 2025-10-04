import { useState, useEffect } from 'react';
import { ArrowLeft, Bookmark, BookmarkCheck, Loader, ChevronRight } from 'lucide-react';
import { Theme } from '../theme';
import { ComicDetail, api, extractChapterSegment } from '../api';
import { useBookmarks } from '../hooks/useBookmarks';

interface SeriesPageProps {
  slug: string;
  theme: Theme;
  onBack: () => void;
  onChapterClick: (chapterSlug: string) => void;
}

export const SeriesPage = ({ slug, theme, onBack, onChapterClick }: SeriesPageProps) => {
  const [comic, setComic] = useState<ComicDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();

  useEffect(() => {
    const fetchComic = async () => {
      setLoading(true);
      try {
        const data = await api.fetchComicDetail(slug);
        setComic(data);
      } catch (error) {
        console.error('Error fetching comic:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComic();
  }, [slug]);

  const handleBookmarkToggle = () => {
    if (!comic) return;
    if (isBookmarked(slug)) {
      removeBookmark(slug);
    } else {
      addBookmark({
        slug,
        title: comic.title,
        image: comic.image,
        chapter: comic.chapters?.[0]?.title || 'Chapter 1',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size={40} className="animate-spin" style={{ color: theme.accent.primary }} />
      </div>
    );
  }

  if (!comic) {
    return (
      <div className="flex flex-col items-center justify-center h-96 px-4">
        <p className="text-lg mb-4" style={{ color: theme.text.muted }}>
          Comic not found
        </p>
        <button
          onClick={onBack}
          className="px-6 py-2 rounded-lg transition-all duration-200"
          style={{ backgroundColor: theme.accent.primary, color: 'white' }}
        >
          Go Back
        </button>
      </div>
    );
  }

  const bookmarked = isBookmarked(slug);

  return (
    <div className="pb-8">
      <div className="sticky top-14 z-20 p-4 backdrop-blur-md" style={{ backgroundColor: theme.bg.overlay }}>
        <button
          onClick={onBack}
          className="flex items-center gap-2 transition-colors duration-200"
          style={{ color: theme.text.primary }}
        >
          <ArrowLeft size={22} />
          <span className="font-medium">Back</span>
        </button>
      </div>

      <div className="px-4">
        <div className="flex flex-col sm:flex-row gap-6 mb-8">
          <img
            src={comic.image}
            alt={comic.title}
            className="w-full sm:w-48 h-auto rounded-lg shadow-2xl"
            style={{ boxShadow: `0 10px 40px ${theme.accent.primary}40` }}
          />

          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: theme.text.primary }}>
              {comic.title}
            </h1>

            {comic.author && (
              <p className="text-sm mb-2" style={{ color: theme.text.secondary }}>
                <span className="font-medium">Author:</span> {comic.author}
              </p>
            )}

            {comic.status && (
              <p className="text-sm mb-2" style={{ color: theme.text.secondary }}>
                <span className="font-medium">Status:</span> {comic.status}
              </p>
            )}

            {comic.genres && comic.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {comic.genres.map((genre, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: theme.accent.primary + '20',
                      color: theme.accent.primary,
                    }}
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={handleBookmarkToggle}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: bookmarked ? theme.accent.secondary : theme.accent.primary,
                color: 'white',
              }}
            >
              {bookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
              {bookmarked ? 'Bookmarked' : 'Add Bookmark'}
            </button>
          </div>
        </div>

        {comic.synopsis && (
          <div className="mb-8 p-4 rounded-lg" style={{ backgroundColor: theme.bg.secondary }}>
            <h2 className="text-lg font-bold mb-2" style={{ color: theme.text.primary }}>
              Synopsis
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: theme.text.secondary }}>
              {comic.synopsis}
            </p>
          </div>
        )}

        <div>
          <h2 className="text-lg font-bold mb-4" style={{ color: theme.text.primary }}>
            Chapters
          </h2>

          {comic.chapters && comic.chapters.length > 0 ? (
            <div className="space-y-2">
              {comic.chapters.map((chapter, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const chapterSlug = extractChapterSegment(chapter.link);
                    if (chapterSlug) onChapterClick(chapterSlug);
                  }}
                  className="w-full flex items-center justify-between p-4 rounded-lg transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    backgroundColor: theme.bg.secondary,
                    borderLeft: `3px solid ${theme.accent.primary}`,
                  }}
                >
                  <div className="flex-1 text-left">
                    <p className="font-medium" style={{ color: theme.text.primary }}>
                      {chapter.title}
                    </p>
                    {chapter.date && (
                      <p className="text-xs mt-1" style={{ color: theme.text.muted }}>
                        {chapter.date}
                      </p>
                    )}
                  </div>
                  <ChevronRight size={20} style={{ color: theme.text.muted }} />
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center py-8" style={{ color: theme.text.muted }}>
              No chapters available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
