# BlogCoin - Blog Post to ERC-20 Minting App

BlogCoin is a modern web application built with Next.js that allows users to write blog posts and mint them as ERC-20 coins on the Base blockchain network using the Zora Coins SDK. This application features AI-generated metadata, IPFS storage, and a sleek, responsive UI.

## Features

- **Rich Text Editor**: Write and format blog posts using React-Quill
- **Wallet Authentication**: Connect securely with MetaMask via Privy
- **AI Integration**: Generate coin names, descriptions, and images based on blog content using OpenAI
- **IPFS Storage**: Store blog content and images permanently on IPFS via Pinata
- **ERC-20 Minting**: Convert blog posts into cryptocurrency coins with Zora Coins SDK
- **Dark/Light Mode**: Toggle between dark and light themes
- **Responsive Design**: Beautiful UI that works on any device

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **UI/UX**: Framer Motion for animations, React-Hot-Toast for notifications
- **Authentication**: Privy wallet connection
- **Blockchain**: Zora Coins SDK, Viem for blockchain interactions
- **Storage**: Pinata SDK for IPFS uploads
- **AI**: OpenAI API for text and image generation

## Prerequisites

Before you begin, ensure you have:

- Node.js 18 or newer
- npm or yarn
- MetaMask browser extension or another compatible wallet
- API keys for:
  - Privy (wallet authentication)
  - OpenAI (AI generation)
  - Pinata (IPFS storage)

## Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/your-username/blog-coin.git
cd blog-coin
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with the following variables:

```
# Privy API Keys
NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id

# OpenAI API Key
OPENAI_API_KEY=your-openai-api-key

# Pinata IPFS API Keys
PINATA_API_KEY=your-pinata-api-key
PINATA_API_SECRET=your-pinata-api-secret
PINATA_JWT=your-pinata-jwt-token

# Base Network Configuration
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
NEXT_PUBLIC_BASE_MAINNET_RPC_URL=https://mainnet.base.org

# Zora Configuration
NEXT_PUBLIC_ZORA_NETWORK=base-sepolia # or "base" for mainnet

# Optional: Minter Wallet (for server-side minting)
MINTER_PRIVATE_KEY=your-private-key-if-using-server-side-minting
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## Usage

1. Connect your wallet using the button in the navbar
2. Write your blog post in the editor
3. Click "Generate & Mint" to:
   - Generate a unique coin name and description using AI
   - Create a custom image for your coin
   - Upload content to IPFS
   - Mint the blog post as an ERC-20 coin
4. View your minted coin details and share with others

## API Routes

- `/api/generate-coin`: Generates coin name and description using OpenAI
- `/api/generate-image`: Creates a custom image for the coin
- `/api/upload-to-ipfs`: Uploads blog content and images to IPFS
- `/api/mint-coin`: Mints the ERC-20 coin on Base blockchain

## Deployment

The app can be easily deployed to Vercel:

```bash
npm run build
npm run start
# or use Vercel CLI
vercel
```

Don't forget to set all environment variables in your hosting platform.

## Security Notes

- Never commit `.env.local` or any file containing API keys or private keys
- For production, use a secure method to manage private keys for minting
- Consider implementing rate limiting on API routes

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
