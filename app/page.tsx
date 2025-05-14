'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Navbar from '@/components/ui/navbar';
import BlogEditor from '@/components/ui/blog-editor';
import GradientButton from '@/components/ui/gradient-button';
import CoinDisplay from '@/components/ui/coin-display';
import useAuth from '@/hooks/use-auth';

export default function Home() {
  // Auth state
  const { isAuthenticated, address } = useAuth();
  
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
      // This would be a call to your OpenAI API route
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
      // This would be a call to your Pinata API route
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

  // Mint coin using Zora Coins SDK
  const mintCoin = async () => {
    if (!generatedData) {
      await generateMetadata();
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please connect your wallet first!');
      return;
    }

    try {
      setIsMinting(true);
      toast.loading('Uploading to IPFS...', { id: 'minting' });
      
      // Upload to IPFS first
      const { contentUri, imageUri } = await uploadToIPFS();
      
      toast.loading('Minting your coin...', { id: 'minting' });
      
      // Call minting API
      const response = await fetch('/api/mint-coin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: generatedData.coinName,
          description: generatedData.coinDescription,
          contentUri,
          imageUri,
          recipientAddress: address
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to mint coin');
      }

      const { coinAddress } = await response.json();
      
      setMintedCoin({
        address: coinAddress,
        name: generatedData.coinName,
        description: generatedData.coinDescription,
        imageUri: imageUri
      });
      
      toast.success('Your blog post has been minted as a coin!', { id: 'minting' });
    } catch (error) {
      console.error('Error minting coin:', error);
      toast.error('Failed to mint coin. Please try again.', { id: 'minting' });
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
