import React, { createContext, useState, useContext, ReactNode } from 'react';

// Definição do tema
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
    border: string;
    error: string;
    success: string;
  };
  fonts: {
    body: string;
    heading: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// Tema claro (padrão)
const lightTheme: Theme = {
  colors: {
    primary: '#3498db',
    secondary: '#2ecc71',
    background: '#ffffff',
    text: '#333333',
    accent: '#9b59b6',
    border: '#e0e0e0',
    error: '#e74c3c',
    success: '#27ae60'
  },
  fonts: {
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px'
  }
};

// Tema escuro
const darkTheme: Theme = {
  colors: {
    primary: '#3498db',
    secondary: '#2ecc71',
    background: '#121212',
    text: '#f5f5f5',
    accent: '#9b59b6',
    border: '#333333',
    error: '#e74c3c',
    success: '#27ae60'
  },
  fonts: {
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px'
  }
};

// Interface do contexto
interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// Criação do contexto
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider do tema
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = isDarkMode ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar o tema
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};