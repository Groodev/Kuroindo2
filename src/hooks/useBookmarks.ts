import { useState, useEffect } from 'react';

export interface Bookmark {
  slug: string;
  title: string;
  image: string;
  chapter: string;
  addedAt: number;
}

export interface ReadingProgress {
  slug: string;
  chapterSlug: string;
  scrollPosition: number;
  updatedAt: number;
}

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const stored = localStorage.getItem('bookmarks');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = (bookmark: Omit<Bookmark, 'addedAt'>) => {
    setBookmarks(prev => {
      if (prev.some(b => b.slug === bookmark.slug)) return prev;
      return [...prev, { ...bookmark, addedAt: Date.now() }];
    });
  };

  const removeBookmark = (slug: string) => {
    setBookmarks(prev => prev.filter(b => b.slug !== slug));
  };

  const isBookmarked = (slug: string) => {
    return bookmarks.some(b => b.slug === slug);
  };

  return { bookmarks, addBookmark, removeBookmark, isBookmarked };
};

export const useReadingProgress = () => {
  const [progress, setProgress] = useState<Record<string, ReadingProgress>>(() => {
    const stored = localStorage.getItem('readingProgress');
    return stored ? JSON.parse(stored) : {};
  });

  useEffect(() => {
    localStorage.setItem('readingProgress', JSON.stringify(progress));
  }, [progress]);

  const saveProgress = (p: ReadingProgress) => {
    setProgress(prev => ({
      ...prev,
      [p.slug]: { ...p, updatedAt: Date.now() },
    }));
  };

  const getProgress = (slug: string) => progress[slug];

  return { progress, saveProgress, getProgress };
};
