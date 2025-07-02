import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';
import { getAppTheme } from './theme'; // your theme.ts file that uses getDesignTokens

// Define the allowed theme modes
export type ColorMode = 'light' | 'dark';

// Context value shape
interface ThemeContextValue {
  toggleColorMode: () => void;
  mode: ColorMode;
}

// Create the context with a default value
const ColorModeContext = createContext<ThemeContextValue>({
  toggleColorMode: () => {},
  mode: 'light',
});

// Export the hook to use it in components
export const useColorMode = () => useContext(ColorModeContext);

// ThemeModeProvider component to wrap your app
export const ThemeModeProvider = ({ children }: { children: ReactNode }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<ColorMode>('light');
  const [mounted, setMounted] = useState(false);

  // Mount check for SSR safety
  useEffect(() => {
    setMounted(true);
  }, []);

  // Set initial mode from localStorage or system preference
  useEffect(() => {
    if (mounted) {
      const saved = localStorage.getItem('theme') as ColorMode | null;
      if (saved === 'light' || saved === 'dark') {
        setMode(saved);
      } else {
        setMode(prefersDarkMode ? 'dark' : 'light');
      }
    }
  }, [mounted, prefersDarkMode]);

  // Persist to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme', mode);
    }
  }, [mode, mounted]);

  // Get theme based on current mode
  const theme = useMemo(() => getAppTheme(mode), [mode]);

  // Context value to pass down
  const colorModeValue = useMemo<ThemeContextValue>(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
      mode,
    }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorModeValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
