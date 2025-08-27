import React from 'react';
import { useTheme } from '../App';

function Footer() {
  const { isDarkMode } = useTheme();

  return (
    <footer className={isDarkMode ? 'bg-gray-900 border-t border-gray-700' : 'bg-gray-100 border-t border-gray-200'}>
      <div className="max-w-7xl mx-auto px-4 py-6 text-center">
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
          © 2024 BingoV. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;