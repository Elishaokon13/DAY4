'use client';

import { ZoraCoinsClient } from '@zoralabs/coins-sdk';
import type { Address } from 'viem';

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
 * Create a Zora Coins client based on the current environment
 * @param provider The ethereum provider from the wallet
 * @returns ZoraCoinsClient instance
 */
export function createZoraClient(provider: any) {
  const network = process.env.NEXT_PUBLIC_ZORA_NETWORK || 'base-sepolia';
  const config = network === 'base' ? baseMainnetConfig : baseSepoliaConfig;
  
  return new ZoraCoinsClient({
    chain: {
      id: config.chainId,
      rpcUrl: config.rpcUrl,
    },
    provider,
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
  provider
}: {
  name: string;
  description: string;
  contentUri: string;
  imageUri: string;
  recipient: Address;
  provider: any;
}) {
  try {
    const zoraClient = createZoraClient(provider);
    
    // Craft metadata for the coin
    const metadata = {
      name,
      description,
      symbol: name.replace(/\s+/g, '').slice(0, 5).toUpperCase(),
      animationUri: contentUri, // Use blog content as animation URI
      imageUri,  // Generated image as the coin's image
    };
    
    // Deploy the coin contract
    const deployCoinResponse = await zoraClient.createCoin({
      name: metadata.name,
      description: metadata.description,
      symbol: metadata.symbol,
      initialmintTo: recipient,
      initialSupply: 1000000000000000000n, // 1 token with 18 decimals
      metadataUri: metadata.imageUri,
      animationUri: metadata.animationUri,
      payoutRecipient: recipient
    });
    
    return {
      transactionHash: deployCoinResponse.transactionHash,
      coinAddress: deployCoinResponse.coinContract
    };
  } catch (error) {
    console.error('Error minting coin:', error);
    throw error;
  }
} 