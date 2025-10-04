import { useState, useEffect, useRef } from 'react';
import { X, Search, Loader } from 'lucide-react';
import { Theme } from '../theme';
import { Comic, api } from '../api';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  onSelectComic: (slug: string) => void;
}

export const SearchModal = ({ isOpen, onClose, theme, onSelectComic }: SearchModalProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEscape);
      };
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await api.search(query);
        setResults(data.comics || []);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      <div
        className="fixed inset-0 bg-black opacity-70"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: theme.bg.secondary }}
      >
        <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: theme.border }}>
          <Search size={20} style={{ color: theme.text.muted }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for manhwa, manhua..."
            className="flex-1 bg-transparent outline-none text-base"
            style={{ color: theme.text.primary }}
          />
          {loading && <Loader size={20} className="animate-spin" style={{ color: theme.accent.primary }} />}
          <button
            onClick={onClose}
            className="p-1 rounded-lg transition-colors"
            style={{ color: theme.text.secondary }}
            aria-label="Close search"
          >
            <X size={22} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {results.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 p-4">
              {results.map((comic, index) => (
                <div
                  key={index}
                  onClick={() => {
                    const slug = comic.link.match(/\/manga\/([^\/]+)/)?.[1];
                    if (slug) {
                      onSelectComic(slug);
                      onClose();
                    }
                  }}
                  className="flex gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: theme.bg.tertiary }}
                >
                  <img
                    src={comic.image}
                    alt={comic.title}
                    className="w-16 h-24 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium line-clamp-2" style={{ color: theme.text.primary }}>
                      {comic.title}
                    </h4>
                    <p className="text-xs mt-1" style={{ color: theme.text.muted }}>
                      {comic.chapter}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : query.trim().length >= 2 && !loading ? (
            <div className="p-8 text-center" style={{ color: theme.text.muted }}>
              No results found for "{query}"
            </div>
          ) : query.trim().length < 2 ? (
            <div className="p-8 text-center" style={{ color: theme.text.muted }}>
              Type at least 2 characters to search
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
