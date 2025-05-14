/**
 * Zora Coins SDK utility functions
 * Handles creating coins from blog posts
 */
import { createCoin, CreateCoinOptions } from '@zoralabs/coins-sdk';
import { type Address } from 'viem';

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
    
    // Real implementation using Zora Coins SDK
    const coinParams: CreateCoinOptions = {
      name, 
      symbol,
      description,
      ownerAddress,
      payoutRecipient: ownerAddress, // Set the owner as the payout recipient
      iconUrl: imageUrl,
      metadataUri,
      contractAdmin: ownerAddress,
      creatorFeeBps,
      network: 'base', // Base mainnet
    };
    
    console.log('Creating coin with params:', JSON.stringify(coinParams, null, 2));
    
    // Call the Zora SDK's createCoin function
    const result = await createCoin(coinParams);
    
    console.log('Coin creation result:', JSON.stringify(result, null, 2));
    
    // Return transaction hash and contract address (if available)
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