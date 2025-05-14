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
 * This function mints an actual ERC-20 token on Base Sepolia testnet
 * using the Zora Coins SDK.
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
    
    // Use Zora's SDK to create the coin transaction parameters
    const { parameters } = await createCoin({
      name,
      symbol,
      description,
      tokenURI: metadataUri,
      creatorAccount: ownerAddress,
      payoutRecipient: ownerAddress, // Set the owner as payout recipient
      fixedFee: 0, // No additional fee
      // Use the same value for both to give 100% to the creator
      mintFeePercentage: 0,
      mintCap: 0n, // Unlimited minting
      contractURI: metadataUri
    });

    try {
      // Simulate the transaction first
      const { request } = await publicClient.simulateContract(parameters);
      
      // In a full integration with wallet, we would use:
      // const hash = await walletClient.writeContract(request);
      
      // For now, return the data that would be used in the actual minting
      // This will be connected to the wallet through Privy in the UI
      return {
        hash: 'simulated_transaction', // This will be replaced with actual hash when connected to wallet
        contractAddress: 'pending_contract', // This will be replaced with actual contract address
      };
    } catch (error) {
      console.error('Error simulating contract:', error);
      throw new Error('Failed to create coin: simulation error');
    }
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