'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface CoinDisplayProps {
  coinAddress: string;
  coinName: string;
  coinDescription: string;
  imageUri?: string;
}

export default function CoinDisplay({
  coinAddress,
  coinName,
  coinDescription,
  imageUri
}: CoinDisplayProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(coinAddress);
    setIsCopied(true);
    toast.success('Address copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  // Use placeholder image if no image URI
  const displayImage = imageUri || 'https://placehold.co/512x512/3b82f6/ffffff?text=BlogCoin';
  
  // Handle Base mainnet explorer URL
  const explorerUrl = `https://basescan.org/address/${coinAddress}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{coinName}</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{coinDescription}</p>
          </div>
          {imageUri && (
            <div className="relative h-16 w-16 rounded-full overflow-hidden">
              <Image
                src={displayImage}
                alt={coinName}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Coin Address:</div>
          <div 
            onClick={copyToClipboard}
            className="flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <span className="text-sm font-mono">{truncateAddress(coinAddress)}</span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-primary-500 hover:text-primary-600 dark:text-primary-400"
            >
              {isCopied ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                </svg>
              )}
            </motion.button>
          </div>
        </div>
        
        <div className="mt-4">
          <a 
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary-500 hover:text-secondary-600 dark:text-secondary-400 text-sm flex items-center"
          >
            <span>View on Base Explorer</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </div>
      </div>
    </motion.div>
  );
} 