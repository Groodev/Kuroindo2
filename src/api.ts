const API_BASE = (import.meta as any).env?.VITE_API_BASE || '';

// If VITE_API_BASE is not set, warn developer
if (!API_BASE) {
  console.warn('VITE_API_BASE is not defined. API requests may fail — set VITE_API_BASE in your Netlify environment variables and rebuild the site.');
}

export interface Comic {
  title: string;
  link: string;
  image: string;
  chapter: string;
}

export interface ComicDetail {
  title: string;
  image: string;
  synopsis?: string;
  author?: string;
  status?: string;
  genres?: string[];
  chapters?: Chapter[];
}

export interface Chapter {
  title: string;
  link: string;
  date?: string;
}

export interface ChapterImages {
  images: string[];
  title?: string;
}

export interface ApiResponse {
  comics: Comic[];
  pagination?: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    hasMore: boolean;
  };
}

export const api = {
  async fetchLatest(page = 1): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE}/api/terbaru?page=${page}`);
    return response.json();
  },

  async fetchPopular(page = 1): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE}/api/populer?page=${page}`);
    return response.json();
  },

  async search(query: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}`);
    return response.json();
  },

  async fetchComicDetail(slug: string): Promise<ComicDetail> {
    const response = await fetch(`${API_BASE}/api/comic/${slug}`);
    return response.json();
  },

  async fetchChapter(segment: string): Promise<ChapterImages> {
    const response = await fetch(`${API_BASE}/api/chapter/${segment}`);
    return response.json();
  },
};

export const extractSlug = (link: string): string => {
  const match = link.match(/\/manga\/([^\/]+)/);
  return match ? match[1] : '';
};

export const extractChapterSegment = (link: string): string => {
  const match = link.match(/\/chapter\/([^\/]+)/);
  return match ? match[1] : '';
};
