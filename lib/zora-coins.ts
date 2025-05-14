/**
 * Zora Coins SDK utility functions
 * Handles creating coins from blog posts
 */
import { createCoin } from '@zoralabs/coins-sdk';
import type { Address } from 'viem';

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

/**
 * Create a new ERC-20 coin from a blog post
 * @param params The parameters for creating the coin
 * @returns The transaction hash
 */
export async function createBlogCoin(params: CreateCoinParams): Promise<string> {
  try {
    const { name, symbol, description, ownerAddress, imageUrl, metadataUri } = params;
    
    // The creator gets 100% of earnings (1,000,000 = 100%)
    const creatorFeeBps = 1000000;
    
    const result = await createCoin({
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
    });
    
    return result.txHash;
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
export function formatBlogPostForIPFS(post: BlogPostMetadata): any {
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