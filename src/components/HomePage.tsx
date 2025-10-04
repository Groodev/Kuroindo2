import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { Theme } from '../theme';
import { Comic, api } from '../api';
import { ComicCard } from './ComicCard';

interface HomePageProps {
  theme: Theme;
  onComicClick: (slug: string) => void;
}

export const HomePage = ({ theme, onComicClick }: HomePageProps) => {
  const [featured, setFeatured] = useState<Comic[]>([]);
  const [popular, setPopular] = useState<Comic[]>([]);
  const [latest, setLatest] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [popularData, latestData] = await Promise.all([
          api.fetchPopular(),
          api.fetchLatest(),
        ]);
        setPopular(popularData.comics || []);
        setLatest(latestData.comics || []);
        setFeatured(popularData.comics?.slice(0, 5) || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (featured.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featured.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featured.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featured.length) % featured.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featured.length);
  };

  const handleComicClick = (link: string) => {
    const slug = link.match(/\/manga\/([^\/]+)/)?.[1];
    if (slug) onComicClick(slug);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size={40} className="animate-spin" style={{ color: theme.accent.primary }} />
      </div>
    );
  }

  return (
    <div className="pb-8">
      {featured.length > 0 && (
        <div className="relative mb-8 overflow-hidden rounded-lg mx-4 mt-4">
          <div
            ref={carouselRef}
            className="relative h-64 sm:h-80 md:h-96"
          >
            {featured.map((comic, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={() => handleComicClick(comic.link)}
              >
                <img
                  src={comic.image}
                  alt={comic.title}
                  className="w-full h-full object-cover cursor-pointer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                    {comic.title}
                  </h2>
                  <p className="text-sm text-white/90 drop-shadow-lg">{comic.chapter}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handlePrevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-200 hover:scale-110"
            style={{ backgroundColor: theme.bg.overlay, color: theme.text.primary }}
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-200 hover:scale-110"
            style={{ backgroundColor: theme.bg.overlay, color: theme.text.primary }}
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {featured.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className="w-2 h-2 rounded-full transition-all duration-200"
                style={{
                  backgroundColor: index === currentSlide ? theme.accent.primary : theme.text.muted,
                  opacity: index === currentSlide ? 1 : 0.5,
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      <section className="mb-8 px-4">
        <h2 className="text-xl font-bold mb-4" style={{ color: theme.text.primary }}>
          Popular Manhwa
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {popular.slice(0, 12).map((comic, index) => (
            <ComicCard
              key={index}
              title={comic.title}
              image={comic.image}
              chapter={comic.chapter}
              onClick={() => handleComicClick(comic.link)}
              theme={theme}
            />
          ))}
        </div>
      </section>

      <section className="px-4">
        <h2 className="text-xl font-bold mb-4" style={{ color: theme.text.primary }}>
          Latest Updates
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {latest.slice(0, 12).map((comic, index) => (
            <ComicCard
              key={index}
              title={comic.title}
              image={comic.image}
              chapter={comic.chapter}
              onClick={() => handleComicClick(comic.link)}
              theme={theme}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
