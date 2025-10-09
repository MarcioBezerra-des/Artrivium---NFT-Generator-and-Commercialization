const baseTheme = {
  breakpoints: {
    xs: '0px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1400px'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem'
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.25rem',
      xl: '1.5rem',
      xxl: '2rem'
    },
    fontWeights: {
      light: 300,
      regular: 400,
      medium: 500,
      semiBold: 600,
      bold: 700
    }
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    circle: '50%'
  },
  zIndex: {
    modal: 1000,
    dropdown: 100,
    tooltip: 500,
    navbar: 900
  }
};

export const lightTheme = {
  ...baseTheme,
  colors: {
    primary: '#6C63FF',
    primaryLight: '#8F88FF',
    primaryDark: '#5A52E0',
    secondary: '#FF6584',
    secondaryLight: '#FF89A1',
    secondaryDark: '#E04D69',
    background: '#F8F9FA',
    surface: '#FFFFFF',
    error: '#DC3545',
    errorDark: '#BD2130',
    success: '#28A745',
    warning: '#FFC107',
    info: '#17A2B8',
    text: '#212529',
    textSecondary: '#6C757D',
    textDisabled: '#ADB5BD',
    disabled: '#E9ECEF',
    border: '#DEE2E6',
    divider: '#E9ECEF',
    dark: '#343A40'
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.15)'
  }
};

export const darkTheme = {
  ...baseTheme,
  colors: {
    primary: '#6C63FF',
    primaryLight: '#8F88FF',
    primaryDark: '#5A52E0',
    secondary: '#FF6584',
    secondaryLight: '#FF89A1',
    secondaryDark: '#E04D69',
    background: '#121212',
    surface: '#1E1E1E',
    error: '#DC3545',
    errorDark: '#BD2130',
    success: '#28A745',
    warning: '#FFC107',
    info: '#17A2B8',
    text: '#F8F9FA',
    textSecondary: '#ADB5BD',
    textDisabled: '#6C757D',
    disabled: '#343A40',
    border: '#495057',
    divider: '#343A40',
    dark: '#212529'
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.2)',
    md: '0 4px 6px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.3)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.4)'
  }
};

export type Theme = typeof lightTheme;

export default lightTheme;