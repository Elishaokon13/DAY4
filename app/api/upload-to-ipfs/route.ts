import { NextRequest, NextResponse } from 'next/server';
import pinataSDK from 'pinata-sdk';
import { v4 as uuidv4 } from 'uuid';
import fetch from 'node-fetch';

// Initialize Pinata client
const pinata = pinataSDK(
  process.env.PINATA_API_KEY || '',
  process.env.PINATA_API_SECRET || ''
);

// Helper function to fetch and convert image to File object
async function fetchImageToBuffer(imageUrl: string): Promise<Buffer> {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function POST(request: NextRequest) {
  try {
    const { content, imageUri } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Generate unique identifier for the content
    const uniqueId = uuidv4();
    
    // Upload blog post content to IPFS
    const contentMetadata = {
      name: `BlogPost_${uniqueId}`,
      keyvalues: {
        type: 'blog-post',
        timestamp: Date.now().toString()
      }
    };
    
    const contentResponse = await pinata.pinJSONToIPFS({
      content: content,
      timestamp: new Date().toISOString()
    }, contentMetadata);
    
    const contentUri = `ipfs://${contentResponse.IpfsHash}`;
    
    // Upload image to IPFS if provided
    let imageIpfsUri = '';
    
    if (imageUri) {
      try {
        // Fetch the image from provided URL
        const imageBuffer = await fetchImageToBuffer(imageUri);
        
        // Create a readable stream from the buffer
        const stream = require('stream');
        const imageStream = new stream.PassThrough();
        imageStream.end(imageBuffer);
        
        // Upload image to IPFS
        const imageMetadata = {
          name: `BlogCoinImage_${uniqueId}`,
          keyvalues: {
            type: 'blog-coin-image',
            timestamp: Date.now().toString()
          }
        };
        
        const imageResponse = await pinata.pinFileToIPFS(imageStream, imageMetadata);
        imageIpfsUri = `ipfs://${imageResponse.IpfsHash}`;
      } catch (error) {
        console.error('Error uploading image to IPFS:', error);
        // Continue without image if there's an error
        return NextResponse.json({
          contentUri,
          imageUri: imageUri, // Return original image URI if IPFS upload fails
          error: `Image upload to IPFS failed: ${error.message}`
        });
      }
    }
    
    return NextResponse.json({
      contentUri,
      imageUri: imageIpfsUri || imageUri // Fallback to original URI if IPFS upload fails
    });
    
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    return NextResponse.json(
      { error: `Failed to upload to IPFS: ${error.message}` },
      { status: 500 }
    );
  }
} 