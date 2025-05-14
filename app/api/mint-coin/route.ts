import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { base, baseSepolia } from 'viem/chains';
import { prepareCoinParams, getNetworkInfo } from '@/utils/zora-client';

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

    // Get network information
    const { network, chain, rpcUrl } = getNetworkInfo();
    
    // Create a public client for querying the blockchain
    const publicClient = createPublicClient({
      chain,
      transport: http(rpcUrl)
    });

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
  } catch (error: any) {
    console.error('Error preparing coin data:', error);
    return NextResponse.json(
      { 
        error: `Failed to prepare coin data: ${error.message || 'Unknown error'}`,
        // Include stack trace in development only
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 