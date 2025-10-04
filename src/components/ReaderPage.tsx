import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Loader, ZoomIn, ZoomOut, Maximize, Minimize } from 'lucide-react';
import { Theme } from '../theme';
import { ChapterImages, api } from '../api';

interface ReaderPageProps {
  chapterSlug: string;
  theme: Theme;
  onBack: () => void;
}

export const ReaderPage = ({ chapterSlug, theme, onBack }: ReaderPageProps) => {
  const [chapter, setChapter] = useState<ChapterImages | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUI, setShowUI] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const uiTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const fetchChapter = async () => {
      setLoading(true);
      try {
        const data = await api.fetchChapter(chapterSlug);
        setChapter(data);
      } catch (error) {
        console.error('Error fetching chapter:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [chapterSlug]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleContainerClick = () => {
    setShowUI(true);
    if (uiTimeoutRef.current) {
      clearTimeout(uiTimeoutRef.current);
    }
    uiTimeoutRef.current = setTimeout(() => {
      setShowUI(false);
    }, 3000);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 50));
  };

  const handleFullscreen = async () => {
    if (!containerRef.current) return;

    if (isFullscreen) {
      await document.exitFullscreen();
    } else {
      await containerRef.current.requestFullscreen();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size={40} className="animate-spin" style={{ color: theme.accent.primary }} />
      </div>
    );
  }

  if (!chapter || !chapter.images || chapter.images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4">
        <p className="text-lg mb-4" style={{ color: theme.text.muted }}>
          Chapter not available
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

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen"
      style={{ backgroundColor: theme.bg.primary }}
      onClick={handleContainerClick}
    >
      <div
        className={`fixed top-0 left-0 right-0 z-30 backdrop-blur-md transition-transform duration-300 ${
          showUI ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{ backgroundColor: theme.bg.overlay }}
      >
        <div className="flex items-center justify-between p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBack();
            }}
            className="flex items-center gap-2 transition-colors duration-200"
            style={{ color: theme.text.primary }}
          >
            <ArrowLeft size={22} />
            <span className="font-medium">Back</span>
          </button>

          {chapter.title && (
            <h1 className="text-sm font-medium truncate max-w-xs" style={{ color: theme.text.primary }}>
              {chapter.title}
            </h1>
          )}
        </div>
      </div>

      <div
        className={`fixed bottom-0 left-0 right-0 z-30 backdrop-blur-md transition-transform duration-300 ${
          showUI ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ backgroundColor: theme.bg.overlay }}
      >
        <div className="flex items-center justify-center gap-4 p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleZoomOut();
            }}
            className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
            style={{ backgroundColor: theme.bg.secondary, color: theme.text.primary }}
            aria-label="Zoom out"
          >
            <ZoomOut size={20} />
          </button>

          <span className="text-sm font-medium" style={{ color: theme.text.primary }}>
            {zoom}%
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleZoomIn();
            }}
            className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
            style={{ backgroundColor: theme.bg.secondary, color: theme.text.primary }}
            aria-label="Zoom in"
          >
            <ZoomIn size={20} />
          </button>

          <div className="w-px h-6" style={{ backgroundColor: theme.border }} />

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleFullscreen();
            }}
            className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
            style={{ backgroundColor: theme.bg.secondary, color: theme.text.primary }}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center pt-20 pb-20">
        {chapter.images.map((image, index) => (
          <div key={index} className="relative w-full flex justify-center">
            <img
              src={image}
              alt={`Page ${index + 1}`}
              loading="lazy"
              className="transition-all duration-300"
              style={{
                width: `${zoom}%`,
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          </div>
        ))}
      </div>

      <div
        className="text-center py-8"
        style={{ color: theme.text.muted }}
      >
        <p className="text-sm">End of Chapter</p>
      </div>
    </div>
  );
};
