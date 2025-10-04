export const themes = {
  dark: {
    bg: {
      primary: '#0b0710',
      secondary: '#1a0f1f',
      tertiary: '#2a1a35',
      overlay: 'rgba(11, 7, 16, 0.85)',
    },
    text: {
      primary: '#eae6f8',
      secondary: '#b8b0cc',
      muted: '#7d7388',
    },
    accent: {
      primary: '#7b5cff',
      secondary: '#6f42c1',
      glow: '#b794ff',
      magenta: '#e879f9',
    },
    border: 'rgba(123, 92, 255, 0.2)',
  },
  light: {
    bg: {
      primary: '#f5f3f7',
      secondary: '#ffffff',
      tertiary: '#e9e5f0',
      overlay: 'rgba(255, 255, 255, 0.85)',
    },
    text: {
      primary: '#1a0f1f',
      secondary: '#4a3f55',
      muted: '#7d7388',
    },
    accent: {
      primary: '#7b5cff',
      secondary: '#6f42c1',
      glow: '#9f7aff',
      magenta: '#d946ef',
    },
    border: 'rgba(111, 66, 193, 0.2)',
  },
};

export type Theme = typeof themes.dark;
export type ThemeMode = 'dark' | 'light';
