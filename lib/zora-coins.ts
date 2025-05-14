/**
 * Zora Coins SDK utility functions
 * Handles creating coins from blog posts
 */
import { type Address } from 'viem';
import { createPublicClient, http, createWalletClient, custom } from 'viem';
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
 * Create a new ERC-20 coin from a blog post using Zora Coins SDK
 * 
 * This function creates an actual transaction to mint an ERC-20 token
 * on Base Sepolia testnet.
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
      chain: baseSepolia,
      transport: custom(window.ethereum)
    });
    
    // Request account access
    const [address] = await walletClient.requestAddresses();
    
    if (address.toLowerCase() !== ownerAddress.toLowerCase()) {
      throw new Error('Connected wallet address does not match the owner address.');
    }
    
    // Use Zora's SDK to create the coin
    const { request } = await createCoin({
      name,
      symbol,
      description,
      tokenURI: metadataUri,
      creatorAccount: ownerAddress,
      payoutRecipient: ownerAddress, // Set the owner as payout recipient
      fixedFee: BigInt(0), // No additional fee
      mintFeePercentage: 0,
      mintCap: BigInt(0), // Unlimited minting
      contractURI: metadataUri
    }, publicClient);
    
    // Send the transaction
    const hash = await walletClient.writeContract(request);
    console.log('Transaction hash:', hash);
    
    // For demo purposes, we're returning the hash immediately
    // In production, you would wait for transaction confirmation
    // and extract the contract address from the receipt
    return {
      hash: hash,
      contractAddress: 'pending_contract' // This would be extracted from transaction receipt in production
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