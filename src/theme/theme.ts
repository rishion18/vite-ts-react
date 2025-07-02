import { createTheme } from '@mui/material/styles';

// Module augmentation for MUI's theme typings
declare module '@mui/material/styles' {
  interface Palette {
    custom: {
      heading: string;
      cardBg: string;
      textSecondary: string;
      headingPrimary: string;
      headingWeight: number;
    };
  }

  interface PaletteOptions {
    custom?: {
      heading?: string;
      cardBg?: string;
      textSecondary?: string;
      headingPrimary?: string;
      headingWeight?: number;
    };
  }
}

export const getDesignTokens = (mode: 'light' | 'dark') => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          custom: {
            heading: '#000000',
            cardBg: '#ffffff',
            textSecondary: '#555555',
            headingPrimary: '#000000',
            headingWeight: 500,
          },
          text: {
            primary: '#000000',
            secondary: '#555555',
            disabled: '#aaaaaa',
          },
          background: {
            default: '#f5f5f5',
            paper: '#ffffff',
            card: '#ffffff',
            section: '#11171D',
          },
        }
      : {
          custom: {
            heading: '#ffffff',
            cardBg: '#1a1a1a',
            textSecondary: '#cccccc',
            headingPrimary: '#ffffff',
            headingWeight: 600,
          },
          text: {
            primary: '#ffffff',
            secondary: '#cccccc',
            disabled: '#888888',
          },
          background: {
            default: '#121212',
            paper: '#1e1e1e',
            card: '#1a1a1a',
            section: '#2a2a2a',
          },
        }),
  },
});

export const getAppTheme = (mode: 'light' | 'dark') =>
  createTheme(getDesignTokens(mode));
