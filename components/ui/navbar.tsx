'use client';

import { usePrivy } from '@privy-io/react-auth';
import { motion } from 'framer-motion';
import ThemeToggle from './theme-toggle';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { login, authenticated, user, logout } = usePrivy();
  const [isHovering, setIsHovering] = useState(false);

  const handleWalletClick = () => {
    if (authenticated) {
      logout();
    } else {
      login();
    }
  };

  const copyAddress = () => {
    if (user?.wallet?.address) {
      navigator.clipboard.writeText(user.wallet.address);
      toast.success('Address copied to clipboard!');
    }
  };

  const formatAddress = (address: string | undefined) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0"
            >
              <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-500 text-transparent bg-clip-text">
                BlogCoin
              </span>
            </motion.div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            <motion.button
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleWalletClick}
              className="flex items-center px-4 py-2 rounded-full text-white font-medium bg-gradient-to-r from-primary-400 to-secondary-500 hover:shadow-md transition-all"
            >
              {authenticated ? (
                <div className="flex items-center" onClick={copyAddress}>
                  <span>{formatAddress(user?.wallet?.address)}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                  </svg>
                </div>
              ) : (
                <span>Connect Wallet</span>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
} 