import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.body.className = dark ? 'bg-dark text-white' : 'bg-light text-dark';
  }, [dark]);

  return (
    <ThemeContext.Provider value={{ dark, toggleDark: () => setDark((prev) => !prev) }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);