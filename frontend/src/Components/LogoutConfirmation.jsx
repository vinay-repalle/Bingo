import React from 'react';
import { useTheme } from '../App';

function LogoutConfirmation({ isOpen, onConfirm, onCancel }) {
  const { isDarkMode } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className={`relative max-w-md w-full mx-4 p-6 rounded-2xl shadow-2xl transform transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-800 border border-gray-600' 
          : 'bg-white border border-gray-200'
      }`}>
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className={`text-xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Confirm Logout
          </h3>
          <p className={`mt-2 text-sm ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Are you sure you want to logout? You'll need to sign in again to access your account.
          </p>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutConfirmation;
