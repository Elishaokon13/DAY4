'use client';

import { createCoin } from '@zoralabs/coins-sdk';
import { type Address, createPublicClient, http } from 'viem';
import { getNetworkInfo, prepareCoinParams } from '@/utils/zora-client';

/**
 * Mint a coin using the user's wallet via Privy
 */
export async function mintCoinWithWallet({
  name,
  description,
  contentUri,
  imageUri,
  recipientAddress,
  userWallet
}: {
  name: string;
  description: string;
  contentUri: string;
  imageUri: string;
  recipientAddress: Address;
  userWallet: any;
}) {
  try {
    // Get the network information
    const { chain } = getNetworkInfo();
    
    // Prepare the coin parameters
    const coinParams = prepareCoinParams({
      name,
      description,
      contentUri,
      imageUri,
      recipient: recipientAddress
    });
    
    // Create public client for the chain
    const publicClient = createPublicClient({
      chain,
      transport: http()
    });
    
    // Custom wallet client compatible with Zora's createCoin
    const walletClient = {
      async signTypedData({ account, domain, types, primaryType, message }: any) {
        // Use Privy to sign
        const signature = await userWallet.signTypedData({
          domain,
          types,
          primaryType,
          message,
        });
        
        return signature as `0x${string}`;
      },
      account: {
        address: userWallet.address as `0x${string}`
      },
      chain
    };
    
    // Create and deploy the coin
    const result = await createCoin(coinParams, walletClient, publicClient);
    
    return {
      transactionHash: result.hash,
      coinAddress: result.address
    };
  } catch (error: any) {
    console.error('Error minting coin with wallet:', error);
    
    // Enhanced error reporting
    if (error.message?.includes('insufficient funds')) {
      throw new Error('Your wallet has insufficient funds to mint the coin');
    } else if (error.message?.includes('rejected')) {
      throw new Error('Transaction was rejected by your wallet');
    } else if (error.message?.includes('user denied')) {
      throw new Error('You declined to sign the transaction');
    } else {
      throw new Error(`Failed to mint coin: ${error.message || 'Unknown error'}`);
    }
  }
} 