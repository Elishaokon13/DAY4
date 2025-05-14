/**
 * Zora Coins SDK utility functions
 * Handles creating coins from blog posts
 */
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
 * 
 * This function simply returns a temporary address for testing purposes.
 * In production, this would call the Zora Coins SDK to create a real coin.
 * 
 * @param params The parameters for creating the coin
 * @returns The transaction hash and contract address
 */
export async function createBlogCoin(params: CreateCoinParams): Promise<{hash: string, contractAddress: string}> {
  try {
    const { name, symbol, description, ownerAddress, metadataUri } = params;
    
    console.log('Creating coin with params:', JSON.stringify({
      name,
      symbol,
      description,
      ownerAddress,
      metadataUri
    }, null, 2));
    
    // For demonstration purposes:
    // In a real implementation, this would be connected to the wallet via Privy
    // and would create an actual transaction
    const demoContractAddress = '0x' + Array.from({length: 40}, () => 
      Math.floor(Math.random() * 16).toString(16)).join('');
    
    return {
      hash: 'tx_' + Date.now().toString(),
      contractAddress: demoContractAddress
    };
  } catch (error) {
    console.error('Error creating coin:', error);
    throw error;
  }
}

/**
 * Open Zora's coin creation interface with prefilled parameters
 * @param params The parameters for creating the coin
 */
export function openZoraCoinCreator(params: CreateCoinParams): void {
  const { name, symbol, description, metadataUri } = params;
  
  // URL encode the parameters
  const queryParams = new URLSearchParams({
    name,
    symbol,
    description,
    uri: metadataUri
  }).toString();
  
  // Open Zora's create coin interface on Base Sepolia testnet with pre-filled parameters
  window.open(`https://sepolia.base.org/zora/create/coin?${queryParams}`, '_blank');
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