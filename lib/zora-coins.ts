/**
 * Zora Coins SDK utility functions
 * Handles creating coins from blog posts
 */
import { createCoin } from '@zoralabs/coins-sdk';
import { ethers } from 'ethers';
import { type Address } from 'viem';

// Types for environment
declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface BlogPostMetadata {
  title: string;
  content: string;
  author: string;
  timestamp: number;
  ipfsHash: string;
}

export interface CreateCoinParams {
  name: string;
  symbol: string;
  description: string;
  ownerAddress: Address;
  imageUrl?: string;
  metadataUri: string;
}

// Define blog post metadata type for IPFS
export interface BlogPostIPFSMetadata {
  name: string;
  description: string;
  external_url: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
  content: string;
}

/**
 * Create a new ERC-20 coin from a blog post
 * @param params The parameters for creating the coin
 * @returns The transaction hash and contract address
 */
export async function createBlogCoin(params: CreateCoinParams): Promise<{hash: string, contractAddress: string}> {
  try {
    const { name, symbol, description, ownerAddress, imageUrl, metadataUri } = params;
    
    // The creator gets 100% of earnings (1,000,000 = 100%)
    const creatorFeeBps = 1000000;
    
    // Coin configuration - note the SDK expects 'uri' not 'metadataUri'
    const coinParams = {
      name, 
      symbol,
      description,
      ownerAddress,
      payoutRecipient: ownerAddress, // Set the owner as the payout recipient
      iconUrl: imageUrl,
      uri: metadataUri, // The SDK expects 'uri' not 'metadataUri'
      contractAdmin: ownerAddress,
      creatorFeeBps,
      network: 'base', // Base mainnet
    };
    
    console.log('Creating coin with params:', JSON.stringify(coinParams, null, 2));
    
    // Set up connection to Base
    let provider: ethers.providers.Provider;
    let signer: ethers.Signer;
    
    // Check if window.ethereum exists (i.e., we're in a browser with MetaMask or similar)
    if (typeof window !== 'undefined' && window.ethereum) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      
      // Request account access if needed
      await (provider as ethers.providers.Web3Provider).send('eth_requestAccounts', []);
    } else {
      // Fallback to a JSON RPC provider (mainnet Base)
      provider = new ethers.providers.JsonRpcProvider('https://mainnet.base.org');
      
      // This is just for testing - in production you'd never handle private keys this way
      console.warn('No wallet detected - coin creation will fail without a private key');
      
      // Development-only fallback that won't work in production
      const dummyWallet = ethers.Wallet.createRandom().connect(provider);
      signer = dummyWallet;
    }
    
    // Call the Zora SDK's createCoin function with the required parameters
    const result = await createCoin(
      coinParams as any, // Type casting to avoid SDK type mismatches
      signer,
      { log: true } // Enable logging for debugging
    );
    
    console.log('Coin creation result:', JSON.stringify(result, null, 2));
    
    // Return transaction hash and contract address
    return {
      hash: result.hash,
      contractAddress: result.address || '0x'
    };
  } catch (error) {
    console.error('Error creating coin:', error);
    throw error;
  }
}

/**
 * Format blog post for IPFS
 * @param post The blog post to format
 * @returns Formatted metadata for IPFS
 */
export function formatBlogPostForIPFS(post: BlogPostMetadata): BlogPostIPFSMetadata {
  return {
    name: post.title,
    description: post.content.substring(0, 200) + '...',
    external_url: `ipfs://${post.ipfsHash}`,
    attributes: [
      {
        trait_type: 'Author',
        value: post.author,
      },
      {
        trait_type: 'Created',
        value: new Date(post.timestamp).toISOString(),
      },
    ],
    content: post.content,
  };
} 