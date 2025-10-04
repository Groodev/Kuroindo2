import { useState, useEffect } from 'react';
import { Search, BookOpen, TrendingUp, Clock, ChevronRight } from 'lucide-react';

interface Comic {
  title: string;
  link: string;
  image: string;
  chapter: string;
}

interface ApiResponse {
  comics: Comic[];
  pagination?: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    hasMore: boolean;
  };
}

function App() {
  const [activeTab, setActiveTab] = useState<'terbaru' | 'populer'>('terbaru');
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Comic[]>([]);
  const [searching, setSearching] = useState(false);

  const API_BASE = 'https://komik-api-six.vercel.app';

  useEffect(() => {
    fetchComics();
  }, [activeTab]);

  const fetchComics = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'terbaru' ? '/api/terbaru' : '/api/populer';
      const response = await fetch(`${API_BASE}${endpoint}`);
      const data: ApiResponse = await response.json();
      setComics(data.comics || []);
    } catch (error) {
      console.error('Error fetching comics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const response = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data: ApiResponse = await response.json();
      setSearchResults(data.comics || []);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setSearching(false);
    }
  };

  const getSlugFromLink = (link: string) => {
    const match = link.match(/\/manga\/([^\/]+)/);
    return match ? match[1] : '';
  };

  const handleComicClick = (link: string) => {
    const slug = getSlugFromLink(link);
    if (slug) {
      window.open(`${API_BASE}/api/comic/${slug}`, '_blank');
    }
  };

  const displayComics = searchResults.length > 0 ? searchResults : comics;
  const showingSearch = searchResults.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-cyan-400" />
              <h1 className="text-2xl font-bold text-white">KuroIndo</h1>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari komik..."
              className="w-full bg-slate-800 text-white placeholder-slate-400 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            {searching && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </form>
        </div>
      </header>

      {/* Tabs */}
      {!showingSearch && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="flex space-x-2 bg-slate-800/50 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('terbaru')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'terbaru'
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-5 h-5" />
              <span>Terbaru</span>
            </button>
            <button
              onClick={() => setActiveTab('populer')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'populer'
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span>Populer</span>
            </button>
          </div>
        </div>
      )}

      {/* Search Results Header */}
      {showingSearch && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Hasil pencarian untuk "{searchQuery}"
            </h2>
            <button
              onClick={() => {
                setSearchResults([]);
                setSearchQuery('');
              }}
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Kembali
            </button>
          </div>
        </div>
      )}

      {/* Comics Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {displayComics.map((comic, index) => (
              <div
                key={index}
                onClick={() => handleComicClick(comic.link)}
                className="group cursor-pointer bg-slate-800/50 rounded-lg overflow-hidden hover:ring-2 hover:ring-cyan-500 transition-all duration-300 hover:scale-105"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-700">
                  <img
                    src={comic.image}
                    alt={comic.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center justify-between text-xs text-white">
                      <span className="bg-cyan-500 px-2 py-1 rounded">{comic.chapter}</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-white line-clamp-2 group-hover:text-cyan-400 transition-colors">
                    {comic.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{comic.chapter}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && displayComics.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">Tidak ada komik ditemukan</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
