'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GradientButtonProps {
  onClick: () => void;
  children: ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function GradientButton({
  onClick,
  children,
  isLoading = false,
  disabled = false,
  className = '',
  type = 'button'
}: GradientButtonProps) {
  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`px-6 py-3 rounded-full font-medium text-white bg-gradient-to-r from-primary-400 to-secondary-500 transition-all shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Processing...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
} 