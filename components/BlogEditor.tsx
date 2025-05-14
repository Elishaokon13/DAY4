'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { usePrivy } from '@privy-io/react-auth';
import { pinataClient } from '@/lib/pinata';
import { createBlogCoin, formatBlogPostForIPFS, openZoraCoinCreator } from '@/lib/zora-coins';
import CoinInfo from './CoinInfo';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export function BlogEditor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [symbol, setSymbol] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [coinAddress, setCoinAddress] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { user, authenticated, ready } = usePrivy();

  // Editor toolbar configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  // Handle form submission
  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      setError(null);
      setSuccess(null);
      setCoinAddress(null);
      setTxHash(null);

      // Basic validation
      if (!title.trim()) {
        throw new Error('Please enter a title for your blog post');
      }
      if (!content.trim()) {
        throw new Error('Please enter content for your blog post');
      }
      if (!symbol.trim()) {
        throw new Error('Please enter a token symbol for your coin');
      }
      if (symbol.length > 5) {
        throw new Error('Token symbol should be 5 characters or less');
      }

      // Check if user is authenticated
      if (!authenticated || !user?.wallet?.address) {
        throw new Error('Please connect your wallet to publish');
      }

      // Step 1: Upload blog post content to IPFS
      const blogPostData = {
        title,
        content,
        author: user.wallet.address,
        timestamp: Date.now(),
        ipfsHash: '' // Will be filled after initial upload
      };

      // Pin initial content to IPFS
      const initialIpfsResponse = await pinataClient.pinJSONToIPFS(
        { ...blogPostData, timestamp: new Date().toISOString() },
        `${title}-${Date.now()}`
      );

      // Update the IPFS hash in the data
      blogPostData.ipfsHash = initialIpfsResponse.IpfsHash;

      // Step 2: Format and pin the final metadata to IPFS
      const formattedMetadata = formatBlogPostForIPFS(blogPostData);
      const finalIpfsResponse = await pinataClient.pinJSONToIPFS(
        formattedMetadata,
        `${title}-metadata-${Date.now()}`
      );

      // Generate the metadata URI from the IPFS hash
      const metadataUri = `ipfs://${finalIpfsResponse.IpfsHash}`;

      // Step 3: Create the ERC-20 coin
      const coinParams = {
        name: `${title} Coin`,
        symbol: symbol.toUpperCase(),
        description: `Token for blog post: ${title}`,
        ownerAddress: user.wallet.address as `0x${string}`,
        metadataUri
      };

      setSuccess(`Successfully uploaded to IPFS! Now attempting to mint your blog post as a coin...`);

      try {
        // Try to create coin using Zora SDK
        const result = await createBlogCoin(coinParams);
        
        // If we reached here, either the coin creation was successful or we got a demo result
        if (result.contractAddress === 'pending') {
          setSuccess(`Transaction submitted! Your blog post is being minted as a coin. Transaction details will be available shortly.`);
        } else if (result.hash.startsWith('tx_')) {
          // This is a demo transaction
          setSuccess(`Your content is ready to be minted as a coin. Use the redirect to Zora option to create it on the testnet.`);
        } else {
          // This is a real transaction
          setSuccess(`Successfully minted your blog post as a coin! The transaction is being processed.`);
        }
        
        setCoinAddress(result.contractAddress);
        setTxHash(result.hash);
        
        // Ask if user wants to be redirected to Zora
        const shouldRedirect = window.confirm(
          'Would you like to open Zora\'s coin creation interface with your blog details pre-filled? ' +
          'This allows you to see your coin on the Zora testnet interface.'
        );

        if (shouldRedirect) {
          openZoraCoinCreator(coinParams);
        }
      } catch (mintError: any) {
        console.error('Error minting coin:', mintError);
        
        // If minting fails, we still want to show the metadata and offer redirect option
        setError(`Error minting coin: ${mintError.message}. You can still create your coin using the Zora interface.`);
        
        // Still offer the redirect option
        const shouldRedirect = window.confirm(
          'There was an error creating your coin using the SDK. Would you like to be redirected to ' +
          'Zora\'s coin creation interface to complete the process?'
        );

        if (shouldRedirect) {
          openZoraCoinCreator(coinParams);
        }
      }

      // Reset form after successful upload, regardless of minting result
      setTitle('');
      setContent('');
      setSymbol('');
      
    } catch (err: any) {
      console.error('Error publishing blog post:', err);
      setError(err.message || 'Failed to publish blog post');
    } finally {
      setIsPublishing(false);
    }
  };

  // Show loading state when Privy is initializing
  if (!ready) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8 space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter blog title..."
          className="w-full rounded-lg border border-gray-300 p-4 text-xl font-bold focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />

        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="Enter coin symbol (e.g. POST)"
          maxLength={5}
          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />

        <div className="rounded-lg border border-gray-300 dark:border-gray-700">
          <ReactQuill
            value={content}
            onChange={setContent}
            modules={modules}
            placeholder="Write your blog post..."
            theme="snow"
            className="h-96 rounded-lg dark:text-white"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg bg-green-50 p-4 text-green-600 dark:bg-green-900/20 dark:text-green-400">
          {success}
        </div>
      )}

      {coinAddress && (
        <CoinInfo 
          contractAddress={coinAddress} 
          txHash={txHash || undefined}
          coinName={title ? `${title} Coin` : undefined}
          coinSymbol={symbol || undefined}
        />
      )}

      <button
        onClick={handlePublish}
        disabled={isPublishing || !authenticated}
        className="mt-4 flex w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white shadow-md transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        {isPublishing ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            Minting Post as Coin...
          </>
        ) : (
          'Mint Post as Coin'
        )}
      </button>

      {!authenticated && (
        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Please connect your wallet to publish blog posts
        </p>
      )}
    </div>
  );
} 