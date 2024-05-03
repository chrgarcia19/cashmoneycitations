"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 p-8">
      <button 
        className={`p-2 rounded-lg transition-colors duration-300 ${
          theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-orange-600 text-gray-200'
        }`}
        onClick={() => setTheme('light')}
      >
        <FaSun className="text-lg"/> Light
      </button>
      <button 
        className={`p-2 rounded-lg transition-colors duration-300 ${
          theme === 'dark' ? 'bg-gray-200 text-gray-800' : 'bg-indigo-800 text-gray-200'
        }`}
        onClick={() => setTheme('dark')}
      >
        <FaMoon className="text-lg"/> Dark
      </button>
      
    </div>
  );
};

export default ThemeSwitcher;
