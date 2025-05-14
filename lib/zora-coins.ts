/**
 * Zora Coins SDK utility functions
 * Handles creating coins from blog posts
 */
import { type Address } from 'viem';
import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { base } from 'viem/chains';
import { createCoin } from '@zoralabs/coins-sdk';

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
  image: string;
  external_url: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
  content: string;
}

// Create a public client for Base mainnet
const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

/**
 * Create a new ERC-20 coin from a blog post using Zora Coins SDK
 * 
 * This function uses the Zora Coins SDK to create a new coin on Base mainnet.
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
    
    // Check if window.ethereum is available
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('Ethereum provider not available. Please make sure you have a wallet installed.');
    }
    
    // Create a wallet client using the browser's provider
    const walletClient = createWalletClient({
      chain: base,
      transport: custom(window.ethereum)
    });
    
    // Request account access
    const [address] = await walletClient.requestAddresses();
    
    if (address.toLowerCase() !== ownerAddress.toLowerCase()) {
      throw new Error('Connected wallet address does not match the owner address.');
    }
    
    // Prepare the coin creation parameters according to Zora SDK
    const coinParams = {
      name,
      symbol,
      uri: metadataUri,
      payoutRecipient: ownerAddress,
      // Optional parameters for advanced customization
      // initialPurchaseWei: 0n, // No initial purchase
    };
    
    // Direct creation with SDK - this will trigger the wallet transaction
    console.log('Creating coin with Zora SDK...');
    const result = await createCoin(coinParams, walletClient, publicClient);
    
    console.log('Transaction result:', result);
    return {
      hash: result.hash,
      contractAddress: result.address || 'pending',
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
  const { name, symbol, description, metadataUri, imageUrl } = params;
  
  // URL encode the parameters
  const queryParams = new URLSearchParams({
    name,
    symbol,
    description,
    uri: metadataUri,
    ...(imageUrl && { image: imageUrl })
  }).toString();
  
  // Open Zora's coin creation interface with pre-filled parameters (now on mainnet)
  window.open(`https://zora.co/create/coin?${queryParams}`, '_blank');
}

/**
 * Format blog post for IPFS
 * @param post The blog post to format
 * @returns Formatted metadata for IPFS
 */
export function formatBlogPostForIPFS(post: BlogPostMetadata): BlogPostIPFSMetadata {
  // Default placeholder image if none is provided
  const defaultImage = "https://picsum.photos/800/800"; // Random placeholder image
  
  return {
    name: post.title,
    description: post.content.substring(0, 200) + '...',
    image: defaultImage, // Required by Zora
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