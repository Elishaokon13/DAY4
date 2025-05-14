import { NextRequest, NextResponse } from 'next/server';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base, baseSepolia } from 'viem/chains';
import { mintBlogCoin } from '@/utils/zora-client';

// This would typically be stored in a secure environment variable
// Using a dummy private key for demo purposes (DO NOT use in production)
const PRIVATE_KEY = process.env.MINTER_PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000000';

export async function POST(request: NextRequest) {
  try {
    const { name, description, contentUri, imageUri, recipientAddress } = await request.json();

    if (!name || !description || !contentUri || !recipientAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Determine which network to use
    const network = process.env.NEXT_PUBLIC_ZORA_NETWORK || 'base-sepolia';
    const chain = network === 'base' ? base : baseSepolia;

    // Create a wallet client
    const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`);
    const client = createWalletClient({
      account,
      chain,
      transport: http(network === 'base' 
        ? process.env.NEXT_PUBLIC_BASE_MAINNET_RPC_URL 
        : process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL)
    });

    // Mint the coin
    const result = await mintBlogCoin({
      name,
      description,
      contentUri,
      imageUri,
      recipient: recipientAddress as `0x${string}`,
      provider: client
    });

    return NextResponse.json({
      success: true,
      coinAddress: result.coinAddress,
      transactionHash: result.transactionHash
    });
  } catch (error) {
    console.error('Error minting coin:', error);
    return NextResponse.json(
      { error: 'Failed to mint coin' },
      { status: 500 }
    );
  }
} 