'use client';

import { createCoin } from '@zoralabs/coins-sdk';
import { type Address, createPublicClient, http } from 'viem';
import { base, baseSepolia } from 'viem/chains';

// Base Sepolia configuration
const baseSepoliaConfig = {
  rpcUrl: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org',
  chainId: 84532,
};

// Base Mainnet configuration
const baseMainnetConfig = {
  rpcUrl: process.env.NEXT_PUBLIC_BASE_MAINNET_RPC_URL || 'https://mainnet.base.org',
  chainId: 8453,
};

/**
 * Create a public client for the given network
 */
export function createBasePublicClient() {
  const network = process.env.NEXT_PUBLIC_ZORA_NETWORK || 'base-sepolia';
  const chain = network === 'base' ? base : baseSepolia;
  const rpcUrl = network === 'base' 
    ? process.env.NEXT_PUBLIC_BASE_MAINNET_RPC_URL || 'https://mainnet.base.org'
    : process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org';
  
  return createPublicClient({
    chain,
    transport: http(rpcUrl),
  });
}

/**
 * Mint a new ERC-20 coin on Base using Zora Coins SDK
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
    
    // Generate a 3-5 character symbol from the name
    const symbol = name
      .replace(/[^A-Z0-9]/gi, '') // Remove non-alphanumeric
      .toUpperCase()
      .slice(0, 5) || 'BLOG';
    
    // If symbol is less than 3 chars, pad it to make it valid
    const validSymbol = symbol.length < 3 ? symbol.padEnd(3, 'X') : symbol;
    
    // Define coin parameters
    const coinParams = {
      name: name.trim(),
      symbol: validSymbol,
      description: description.trim(),
      uri: imageUri || '', // Use generated image as the coin's metadata URI
      animationUri: contentUri || '', // Use blog content as animation URI
      payoutRecipient: recipient,
      initialPurchaseWei: BigInt(0) // No initial purchase required
    };
    
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
  } catch (error) {
    console.error('Error in mintBlogCoin:', error);
    
    // Enhanced error reporting
    if (error.message?.includes('insufficient funds')) {
      throw new Error('Wallet has insufficient funds to mint the coin');
    } else if (error.message?.includes('rejected')) {
      throw new Error('Transaction was rejected by the blockchain');
    } else {
      throw new Error(`Failed to mint coin: ${error.message}`);
    }
  }
} 