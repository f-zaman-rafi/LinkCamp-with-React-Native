export type ThemeName = 'light' | 'dark';

export type Theme = {
  name: ThemeName;
  isDark: boolean;
  colors: {
    background: string;
    surface: string;
    text: string;
    subtext: string;
    primary: string;
    border: string;
    muted: string;
    danger: string;
  };
};

export const themes: Record<ThemeName, Theme> = {
  light: {
    name: 'light',
    isDark: false,
    colors: {
      background: '#ffffff',
      surface: '#ffffff',
      text: '#000000',
      subtext: '#475569',
      primary: '#000000', // “blue” becomes black in light mode
      border: '#e2e8f0',
      muted: '#94a3b8',
      danger: '#ef4444',
    },
  },
  dark: {
    name: 'dark',
    isDark: true,
    colors: {
      background: '#0b0b0b',
      surface: '#111827',
      text: '#ffffff',
      subtext: '#cbd5e1',
      primary: '#ff3b30', // vibrant red in dark mode
      border: '#1f2937',
      muted: '#94a3b8',
      danger: '#ff3b30',
    },
  },
};
