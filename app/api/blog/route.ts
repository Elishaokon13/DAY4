import { NextRequest, NextResponse } from 'next/server';
import { pinataClient } from '@/lib/pinata';
import { formatBlogPostForIPFS } from '@/lib/zora-coins';

/**
 * API route for handling blog post uploads to IPFS
 * POST /api/blog
 */
export async function POST(req: NextRequest) {
  try {
    // Get post data from request
    const body = await req.json();
    const { title, content, authorAddress } = body;

    // Validate required fields
    if (!title || !content || !authorAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, or authorAddress' },
        { status: 400 }
      );
    }

    // Initial blog post data
    const blogPostData = {
      title,
      content,
      author: authorAddress,
      timestamp: Date.now(),
      ipfsHash: '' // Will be filled after initial upload
    };

    // Step 1: Upload initial content to IPFS
    const initialIpfsResponse = await pinataClient.pinJSONToIPFS(
      { ...blogPostData, timestamp: new Date().toISOString() },
      `${title}-${Date.now()}`
    );

    // Update the IPFS hash in the data
    blogPostData.ipfsHash = initialIpfsResponse.IpfsHash;

    // Step 2: Format and pin the final metadata
    const formattedMetadata = formatBlogPostForIPFS(blogPostData);
    const finalIpfsResponse = await pinataClient.pinJSONToIPFS(
      formattedMetadata,
      `${title}-metadata-${Date.now()}`
    );

    // Return the IPFS hashes and metadata URI
    return NextResponse.json({
      success: true,
      contentHash: initialIpfsResponse.IpfsHash,
      metadataHash: finalIpfsResponse.IpfsHash,
      metadataUri: `ipfs://${finalIpfsResponse.IpfsHash}`,
    });
  } catch (error: any) {
    console.error('Error processing blog post:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process blog post' },
      { status: 500 }
    );
  }
} 