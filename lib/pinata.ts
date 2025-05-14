/**
 * Pinata API client for IPFS file storage
 * This is a simplified version since we had installation issues with the official SDK
 */

// Define interface for our Pinata client
export interface PinataConfig {
  apiKey: string;
  apiSecret: string;
}

export interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate?: boolean;
}

export class PinataClient {
  private apiKey: string;
  private apiSecret: string;
  private baseUrl = 'https://api.pinata.cloud';

  constructor(config: PinataConfig) {
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
  }

  /**
   * Pin JSON data to IPFS
   * @param jsonData The JSON data to pin
   * @param name Optional name for the file
   */
  async pinJSONToIPFS(jsonData: any, name?: string): Promise<PinataResponse> {
    try {
      const url = `${this.baseUrl}/pinning/pinJSONToIPFS`;
      
      const data = {
        pinataContent: jsonData,
        pinataMetadata: {
          name: name || 'blog-post',
        },
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.apiSecret,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to pin to IPFS: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error pinning to IPFS:', error);
      throw error;
    }
  }

  /**
   * Get the IPFS gateway URL for a pinned hash
   * @param ipfsHash The IPFS hash
   */
  getIPFSGatewayUrl(ipfsHash: string): string {
    return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
  }
}

// Create and export a singleton instance with environment variables
export function createPinataClient(): PinataClient {
  const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY || '';
  const apiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET || '';
  
  if (!apiKey || !apiSecret) {
    console.warn('Pinata API credentials not found. Set NEXT_PUBLIC_PINATA_API_KEY and NEXT_PUBLIC_PINATA_API_SECRET env variables.');
  }
  
  return new PinataClient({ apiKey, apiSecret });
}

export const pinataClient = createPinataClient(); 