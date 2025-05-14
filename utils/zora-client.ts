import { createCoin } from '@zoralabs/coins-sdk';
import { type Address, createPublicClient, http } from 'viem';
import { base, baseSepolia } from 'viem/chains';

// Base configuration constants
const BASE_MAINNET_CHAIN_ID = 8453;
const BASE_SEPOLIA_CHAIN_ID = 84532;

// Base Sepolia configuration
const baseSepoliaConfig = {
  rpcUrl: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org',
  chainId: BASE_SEPOLIA_CHAIN_ID,
};

// Base Mainnet configuration
const baseMainnetConfig = {
  rpcUrl: process.env.NEXT_PUBLIC_BASE_MAINNET_RPC_URL || 'https://mainnet.base.org',
  chainId: BASE_MAINNET_CHAIN_ID,
};

/**
 * Get network information for Zora Coins minting
 * This function can be used on both client and server
 */
export function getNetworkInfo() {
  // Default to Base mainnet (instead of Sepolia)
  const network = process.env.NEXT_PUBLIC_ZORA_NETWORK || 'base';
  const chain = network === 'base-sepolia' ? baseSepolia : base;
  const rpcUrl = network === 'base-sepolia' 
    ? process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org'
    : process.env.NEXT_PUBLIC_BASE_MAINNET_RPC_URL || 'https://mainnet.base.org';
  
  return { network, chain, rpcUrl };
}

/**
 * Create a public client for the given network
 * This function can be used on both client and server
 */
export function createBasePublicClient() {
  const { chain, rpcUrl } = getNetworkInfo();
  
  return createPublicClient({
    chain,
    transport: http(rpcUrl),
  });
}

/**
 * Prepare coin creation parameters (used for both server and client side minting)
 * This function can be used on both client and server
 */
export function prepareCoinParams({
  name,
  description,
  contentUri,
  imageUri,
  recipient,
}: {
  name: string;
  description: string;
  contentUri: string;
  imageUri: string;
  recipient: Address;
}) {
  // Generate a 3-5 character symbol from the name
  const symbol = name
    .replace(/[^A-Z0-9]/gi, '') // Remove non-alphanumeric
    .toUpperCase()
    .slice(0, 5) || 'BLOG';
  
  // If symbol is less than 3 chars, pad it to make it valid
  const validSymbol = symbol.length < 3 ? symbol.padEnd(3, 'X') : symbol;
  
  // Define coin parameters
  return {
    name: name.trim(),
    symbol: validSymbol,
    description: description.trim(),
    uri: imageUri || '', // Use generated image as the coin's metadata URI
    animationUri: contentUri || '', // Use blog content as animation URI
    payoutRecipient: recipient,
    initialPurchaseWei: BigInt(0) // No initial purchase required
  };
}

/**
 * Mint a new ERC-20 coin on Base using Zora Coins SDK (server-side)
 * This function can be used on both client and server
 */
export async function mintBlogCoin({
  name,
  description,
  contentUri,
  imageUri,
  recipient,
  walletClient
}: {
  name: string;
  description: string;
  contentUri: string;
  imageUri: string;
  recipient: Address;
  walletClient: any;
}) {
  try {
    const publicClient = createBasePublicClient();
    const coinParams = prepareCoinParams({
      name,
      description,
      contentUri,
      imageUri,
      recipient
    });
    
    console.log('Creating coin with params:', {
      ...coinParams,
      initialPurchaseWei: '0' // Convert BigInt to string for logging
    });
    
    // Create and deploy the coin
    const result = await createCoin(coinParams, walletClient, publicClient);
    
    console.log('Coin created successfully:', result);
    
    return {
      transactionHash: result.hash,
      coinAddress: result.address
    };
  } catch (error: any) {
    console.error('Error in mintBlogCoin:', error);
    
    // Enhanced error reporting
    if (error.message?.includes('insufficient funds')) {
      throw new Error('Wallet has insufficient funds to mint the coin');
    } else if (error.message?.includes('rejected')) {
      throw new Error('Transaction was rejected by the blockchain');
    } else {
      throw new Error(`Failed to mint coin: ${error.message || 'Unknown error'}`);
    }
  }
} 