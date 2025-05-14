import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import FormData from 'form-data';

// Helper function to fetch and convert image to Buffer
async function fetchImageToBuffer(imageUrl: string): Promise<Buffer> {
  const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  return Buffer.from(response.data);
}

// Direct Pinata API functions
async function pinJSONToIPFS(jsonBody: any, metadata: any) {
  const pinataApiKey = process.env.PINATA_API_KEY || '';
  const pinataApiSecret = process.env.PINATA_API_SECRET || '';
  
  const response = await axios.post(
    'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    {
      pinataMetadata: metadata,
      pinataContent: jsonBody
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataApiSecret
      }
    }
  );
  
  return response.data;
}

async function pinFileToIPFS(fileBuffer: Buffer, metadata: any) {
  const pinataApiKey = process.env.PINATA_API_KEY || '';
  const pinataApiSecret = process.env.PINATA_API_SECRET || '';
  
  const formData = new FormData();
  
  // Add the file to form data
  formData.append('file', fileBuffer, {
    filename: metadata.name,
    contentType: 'image/png' // Assuming PNG for simplicity
  });
  
  // Add metadata
  formData.append('pinataMetadata', JSON.stringify(metadata));
  
  const response = await axios.post(
    'https://api.pinata.cloud/pinning/pinFileToIPFS',
    formData,
    {
      maxBodyLength: Infinity,
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataApiSecret
      }
    }
  );
  
  return response.data;
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
    
    const contentResponse = await pinJSONToIPFS({
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
        
        // Upload image to IPFS
        const imageMetadata = {
          name: `BlogCoinImage_${uniqueId}`,
          keyvalues: {
            type: 'blog-coin-image',
            timestamp: Date.now().toString()
          }
        };
        
        const imageResponse = await pinFileToIPFS(imageBuffer, imageMetadata);
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