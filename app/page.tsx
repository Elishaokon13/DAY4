'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Navbar from '@/components/ui/navbar';
import BlogEditor from '@/components/ui/blog-editor';
import GradientButton from '@/components/ui/gradient-button';
import CoinDisplay from '@/components/ui/coin-display';
import useAuth from '@/hooks/use-auth';
import { usePrivy } from '@privy-io/react-auth';
import { mintCoinWithWallet } from '@/utils/zora-client-side';

export default function Home() {
  // Auth state
  const { isAuthenticated, address, isConnectedToBaseChain, switchToBaseNetwork } = useAuth();
  const { user } = usePrivy();
  
  // Blog content state
  const [blogContent, setBlogContent] = useState('');
  
  // Minting state
  const [isMinting, setIsMinting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<{
    coinName: string;
    coinDescription: string;
    imageUri: string;
  } | null>(null);
  
  // Minted coin state
  const [mintedCoin, setMintedCoin] = useState<{
    address: string;
    name: string;
    description: string;
    imageUri: string;
  } | null>(null);

  // Prompt user to switch to Base network if connected to the wrong network
  useEffect(() => {
    if (isAuthenticated && !isConnectedToBaseChain) {
      toast.error(
        'Please connect to Base network to mint coins',
        { 
          id: 'network-check',
          duration: 5000,
          icon: '🔄'
        }
      );
    }
  }, [isAuthenticated, isConnectedToBaseChain]);

  // Handle blog content change
  const handleContentChange = (content: string) => {
    setBlogContent(content);
  };

  // Generate coin metadata with AI
  const generateMetadata = async () => {
    if (!blogContent || blogContent === '<p><br></p>') {
      toast.error('Please write something in your blog post first!');
      return;
    }

    try {
      setIsGenerating(true);
      const response = await fetch('/api/generate-coin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: blogContent }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate metadata');
      }

      const data = await response.json();
      setGeneratedData({
        coinName: data.name,
        coinDescription: data.description,
        imageUri: data.imageUri, 
      });

      toast.success('Metadata generated! Ready to mint!');
    } catch (error) {
      console.error('Error generating metadata:', error);
      toast.error('Failed to generate metadata. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Upload content to IPFS
  const uploadToIPFS = async () => {
    try {
      const response = await fetch('/api/upload-to-ipfs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content: blogContent,
          imageUri: generatedData?.imageUri || ''
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to upload to IPFS');
      }

      const { contentUri, imageUri } = await response.json();
      return { contentUri, imageUri };
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw error;
    }
  };

  // Mint coin using Zora Coins SDK with client wallet
  const mintCoin = async () => {
    if (!generatedData) {
      await generateMetadata();
      return;
    }

    if (!isAuthenticated || !user?.wallet) {
      toast.error('Please connect your wallet first!');
      return;
    }

    // Check if connected to Base network, if not, prompt to switch
    if (!isConnectedToBaseChain) {
      toast.loading('Switching to Base network...', { id: 'network-switch' });
      const switched = await switchToBaseNetwork();
      toast.dismiss('network-switch');
      
      if (!switched) {
        toast.error('You need to be connected to Base network to mint coins');
        return;
      }
    }

    try {
      setIsMinting(true);
      toast.loading('Uploading to IPFS...', { id: 'minting' });
      
      // Upload to IPFS first
      const { contentUri, imageUri } = await uploadToIPFS();
      
      toast.loading('Preparing transaction...', { id: 'minting' });
      
      // Mint the coin directly using the client-side wallet
      toast.loading('Please confirm the transaction in your wallet...', { id: 'minting' });
      
      const result = await mintCoinWithWallet({
        name: generatedData.coinName,
        description: generatedData.coinDescription,
        contentUri,
        imageUri,
        recipientAddress: address as `0x${string}`,
        userWallet: user.wallet
      });
      
      setMintedCoin({
        address: result.coinAddress,
        name: generatedData.coinName,
        description: generatedData.coinDescription,
        imageUri: imageUri
      });
      
      toast.success('Your blog post has been minted as a coin!', { id: 'minting' });
    } catch (error) {
      console.error('Error minting coin:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to mint coin: ${errorMessage}`, { id: 'minting' });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-center mb-2">
            Mint Your Blog Post as an ERC-20 Coin
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Write your blog post, generate metadata with AI, and mint it as an ERC-20 coin on Base
          </p>
          
          <div className="space-y-8">
            {/* Network Status Alert */}
            {isAuthenticated && !isConnectedToBaseChain && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded" role="alert">
                <div className="flex items-center">
                  <div className="py-1">
                    <svg className="h-6 w-6 text-yellow-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold">Wrong Network</p>
                    <p className="text-sm">You need to be connected to Base network to mint coins.</p>
                  </div>
                  <div className="ml-auto">
                    <button 
                      onClick={switchToBaseNetwork}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-4 rounded text-sm"
                    >
                      Switch Network
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Blog Editor */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Write Your Blog Post</h2>
              <BlogEditor 
                value={blogContent} 
                onChange={handleContentChange} 
              />
              
              <div className="mt-6 flex justify-end">
                <GradientButton
                  onClick={mintCoin}
                  isLoading={isMinting || isGenerating}
                  disabled={!blogContent || blogContent === '<p><br></p>'}
                >
                  {generatedData ? 'Mint as ERC-20' : 'Generate & Mint'}
                </GradientButton>
              </div>
            </div>
            
            {/* Generated Metadata Preview (conditional) */}
            {generatedData && !mintedCoin && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
              >
                <h2 className="text-xl font-semibold mb-4">Generated Metadata</h2>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Coin Name:</span> {generatedData.coinName}
                  </div>
                  <div>
                    <span className="font-medium">Description:</span> {generatedData.coinDescription}
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Minted Coin Display (conditional) */}
            {mintedCoin && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Your Minted Coin</h2>
                <CoinDisplay
                  coinName={mintedCoin.name}
                  coinDescription={mintedCoin.description}
                  coinAddress={mintedCoin.address}
                  imageUri={mintedCoin.imageUri}
                />
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
