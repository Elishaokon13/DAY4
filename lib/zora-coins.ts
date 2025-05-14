/**
 * Zora Coins SDK utility functions
 * Handles creating coins from blog posts
 */
import { type Address } from 'viem';
import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { createCoin } from '@zoralabs/coins-sdk';

// Remove global interface declaration to avoid conflicts
// The window.ethereum property is handled directly in the code

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

// Create a public client for Base Sepolia testnet
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

/**
 * Create a new ERC-20 coin from a blog post
 * 
 * This function prepares the data for minting an ERC-20 token on Base Sepolia testnet
 * using the Zora Coins SDK. The actual minting happens through the wallet in the UI.
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
    
    // This is where Zora SDK would be used in a full implementation
    // We're returning placeholder data for now since the actual transaction
    // will be executed through the wallet provider (Privy) in the UI
    
    return {
      hash: 'tx_' + Date.now().toString(),
      contractAddress: 'contract_' + Date.now().toString(),
    };
  } catch (error) {
    console.error('Error creating coin:', error);
    throw error;
  }
}

/**
 * Open Zora's coin creation interface with prefilled parameters
 * This is a practical approach that delegates the actual coin creation
 * to Zora's interface for better user experience
 * 
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
  
  // Open Zora's create coin interface with pre-filled parameters
  window.open(`https://zora.co/create/coin?${queryParams}`, '_blank');
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