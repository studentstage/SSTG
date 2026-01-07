// Utility to ensure dark mode classes are applied consistently
export const darkModeClasses = {
  // Backgrounds
  bg: {
    light: 'bg-white',
    dark: 'dark:bg-gray-900',
    card: {
      light: 'bg-white',
      dark: 'dark:bg-gray-800'
    }
  },
  
  // Text
  text: {
    primary: {
      light: 'text-gray-900',
      dark: 'dark:text-white'
    },
    secondary: {
      light: 'text-gray-700',
      dark: 'dark:text-gray-300'
    },
    muted: {
      light: 'text-gray-600',
      dark: 'dark:text-gray-400'
    }
  },
  
  // Borders
  border: {
    light: 'border-gray-200',
    dark: 'dark:border-gray-700'
  },
  
  // Common component classes
  input: 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white',
  card: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
  button: {
    primary: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
  }
};

// Helper to apply dark mode classes
export const applyDarkMode = (baseClass, isDark = true) => {
  return isDark ? `${baseClass} dark:${baseClass.replace(':', '-dark:')}` : baseClass;
};
