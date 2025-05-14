# BlogCoin: Write & Mint Your Blog as a Coin

A Next.js application that allows users to create blog posts and mint them as ERC-20 coins using the Zora Coins SDK on the Base mainnet.

## Features

- Clean, minimalistic text editor for writing blog posts
- Seamless wallet authentication using Privy
- Automatic minting of blog posts as ERC-20 coins
- IPFS storage for blog content using Pinata
- Dark/light mode toggle
- Responsive design optimized for all devices

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Authentication**: Privy for web3 wallet connections
- **Storage**: IPFS via Pinata for content storage
- **Blockchain**: Zora Coins SDK for ERC-20 creation on Base
- **Styling**: Tailwind CSS with dark/light mode

## Getting Started

1. Clone the repository
2. Create a `.env.local` file based on `.env.local.example`
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file with the following:

```
# Privy configuration
NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id

# Pinata configuration (for IPFS storage)
NEXT_PUBLIC_PINATA_API_KEY=your-pinata-api-key
NEXT_PUBLIC_PINATA_API_SECRET=your-pinata-api-secret

# OnchainKit configuration
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your-onchainkit-api-key
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=BlogCoin
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_VERSION=vNext
NEXT_PUBLIC_IMAGE_URL=https://example.com/image.png
NEXT_PUBLIC_SPLASH_IMAGE_URL=https://example.com/splash.png
NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR=ffffff
NEXT_PUBLIC_ICON_URL=https://example.com/icon.png
```

## How It Works

1. **User Authentication**: Connect your wallet using Privy
2. **Content Creation**: Write your blog post using the minimalistic text editor
3. **Minting Process**:
   - Blog content is uploaded to IPFS via Pinata
   - Metadata is created and stored on IPFS
   - An ERC-20 coin is minted using Zora Coins SDK
   - The creator's wallet is set as the payoutRecipient for earnings

## Customization

- **Theme**: Toggle between dark and light mode using the theme switcher
- **Editor**: The text editor supports rich text formatting
- **Coin Symbol**: Choose a custom symbol for your blog coin (up to 5 characters)

## Credits

- Built with [Next.js](https://nextjs.org/)
- Authentication by [Privy](https://privy.io/)
- IPFS storage by [Pinata](https://pinata.cloud/)
- ERC-20 token creation by [Zora Coins SDK](https://github.com/ourzora/coins-sdk)
- Deployed on the [Base](https://base.org/) network 