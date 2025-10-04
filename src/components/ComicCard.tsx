import { useState } from 'react';
import { Theme } from '../theme';

interface ComicCardProps {
  title: string;
  image: string;
  chapter: string;
  onClick: () => void;
  theme: Theme;
}

export const ComicCard = ({ title, image, chapter, onClick, theme }: ComicCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      style={{
        backgroundColor: theme.bg.secondary,
        boxShadow: imageLoaded ? `0 0 20px ${theme.accent.primary}40` : 'none',
      }}
    >
      <div className="relative aspect-[2/3] overflow-hidden" style={{ backgroundColor: theme.bg.tertiary }}>
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 animate-pulse" style={{ backgroundColor: theme.bg.tertiary }} />
        )}
        {imageError ? (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: theme.bg.tertiary, color: theme.text.muted }}
          >
            <span className="text-xs">No image</span>
          </div>
        ) : (
          <img
            src={image}
            alt={title}
            loading="lazy"
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
        <div
          className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded text-xs font-semibold text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          style={{ backgroundColor: theme.accent.primary }}
        >
          {chapter}
        </div>
      </div>

      <div className="p-3">
        <h3
          className="text-sm font-medium line-clamp-2 transition-colors duration-200"
          style={{ color: theme.text.primary }}
        >
          {title}
        </h3>
        <p className="text-xs mt-1" style={{ color: theme.text.muted }}>
          {chapter}
        </p>
      </div>
    </div>
  );
};
