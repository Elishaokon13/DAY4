import { NextRequest, NextResponse } from 'next/server';
import { base, baseSepolia } from 'viem/chains';
import { prepareCoinParams } from '@/utils/zora-client';

export async function POST(request: NextRequest) {
  try {
    const { name, description, contentUri, imageUri, recipientAddress } = await request.json();

    if (!name || !description || !contentUri || !recipientAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate the recipient address format
    if (!recipientAddress.startsWith('0x') || recipientAddress.length !== 42) {
      return NextResponse.json(
        { error: 'Invalid recipient address format' },
        { status: 400 }
      );
    }

    // Determine which network to use (duplicating logic instead of using the client function)
    // Default to Base mainnet (instead of Sepolia)
    const network = process.env.NEXT_PUBLIC_ZORA_NETWORK || 'base';
    const chain = network === 'base-sepolia' ? baseSepolia : base;
    
    // Prepare the coin parameters
    const coinParams = prepareCoinParams({
      name,
      description,
      contentUri,
      imageUri,
      recipient: recipientAddress as `0x${string}`
    });

    // Return the prepared parameters to be used for client-side signing
    return NextResponse.json({
      success: true,
      coinParams,
      network,
      chainId: chain.id,
      message: 'Use these parameters with client-side wallet to sign and create the coin'
    });
  } catch (error) {
    console.error('Error preparing coin data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        error: `Failed to prepare coin data: ${errorMessage}`,
        // Include stack trace in development only
        details: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    );
  }
} 