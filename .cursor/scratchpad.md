# BlogCoin - Next.js ERC-20 Blog Post Minting App

## Background and Motivation
This project aims to create a modern web application where users can write blog posts and mint them as ERC-20 coins on the Base Mainnet using Zora Coins SDK. The application will feature a sleek UI with Tailwind CSS, wallet connection via Privy, AI integration for content generation, IPFS storage with Pinata, and coin minting functionality.

## Key Challenges and Analysis
- Integration of multiple technologies: Next.js, Tailwind CSS, Privy wallet, OpenAI, Pinata IPFS, and Zora Coins SDK
- Ensuring smooth user experience across the writing, AI generation, IPFS upload, and minting workflow
- Building a responsive and aesthetically pleasing UI with dark/light mode functionality
- Handling blockchain interactions securely and efficiently
- Managing asynchronous operations (AI generation, IPFS uploads, blockchain transactions)
- Proper error handling for API calls and blockchain transactions

## High-level Task Breakdown

### 1. Project Setup and Initialization
- [ ] 1.1 Initialize a new Next.js project with App Router
- [ ] 1.2 Install required dependencies (Tailwind CSS, React-Quill, Privy, Zora SDK, Pinata SDK, OpenAI, Framer Motion, React-Hot-Toast)
- [ ] 1.3 Configure Tailwind CSS with Inter font
- [ ] 1.4 Create .env.local for API keys and configuration
- [ ] 1.5 Set up project structure (components, hooks, utils, api)
   
   **Success Criteria**: Project builds without errors, all dependencies installed, folder structure established.

### 2. UI Components Implementation
- [ ] 2.1 Create light/dark theme toggle with next-themes
- [ ] 2.2 Implement responsive Navbar with logo and wallet connect button
- [ ] 2.3 Build main editor card component with React-Quill integration
- [ ] 2.4 Create "Mint Post" button with animations
- [ ] 2.5 Implement toast notifications system
- [ ] 2.6 Add minted coin display section with copy-to-clipboard functionality
- [ ] 2.7 Add loading states and animations with Framer Motion

   **Success Criteria**: All UI components render correctly, responsive layout works, animations function as expected.

### 3. Wallet Connection with Privy
- [ ] 3.1 Set up Privy provider in app layout
- [ ] 3.2 Implement wallet connect/disconnect button
- [ ] 3.3 Create auth state hook for accessing wallet info
- [ ] 3.4 Configure Privy for Base Sepolia network
- [ ] 3.5 Display connected wallet address in UI

   **Success Criteria**: Users can connect their wallet, wallet address displays correctly, authentication state persists.

### 4. AI Integration
- [ ] 4.1 Create API route for OpenAI text generation (coin name & description)
- [ ] 4.2 Create API route for image generation
- [ ] 4.3 Implement client-side functions to call these APIs
- [ ] 4.4 Add error handling and loading states for AI operations
- [ ] 4.5 Display generated content with preview options

   **Success Criteria**: AI APIs successfully generate coin name, description, and image based on blog content.

### 5. IPFS Upload with Pinata
- [ ] 5.1 Set up Pinata SDK with API keys
- [ ] 5.2 Create API route for text content upload
- [ ] 5.3 Create API route for image upload
- [ ] 5.4 Implement client functions to manage uploads
- [ ] 5.5 Store and display IPFS URIs for uploaded content

   **Success Criteria**: Blog content and images successfully upload to IPFS, returning valid URIs.

### 6. ERC-20 Coin Minting with Zora
- [ ] 6.1 Configure Zora Coins SDK with Base Mainnet
- [ ] 6.2 Create minting function using collected metadata (name, description, image URI)
- [ ] 6.3 Implement transaction handling and confirmation
- [ ] 6.4 Display transaction status and coin address
- [ ] 6.5 Add link to view minted coin on blockchain explorer

   **Success Criteria**: ERC-20 coin mints successfully with correct metadata, transaction completes, coin address displays.

### 7. Testing and Refinement
- [ ] 7.1 Test complete user flow from writing to minting
- [ ] 7.2 Test responsive design across devices
- [ ] 7.3 Test wallet connection edge cases
- [ ] 7.4 Optimize API calls and error handling
- [ ] 7.5 Add final polish to animations and UI/UX

   **Success Criteria**: Full application flow works seamlessly, responsive on all devices, error handling works correctly.

### 8. Documentation and Deployment
- [ ] 8.1 Create comprehensive README with setup instructions
- [ ] 8.2 Document .env requirements and API key setup
- [ ] 8.3 Add inline code comments for complex operations
- [ ] 8.4 Prepare for deployment (Vercel or similar)
- [ ] 8.5 Final testing on deployed version

   **Success Criteria**: Documentation is clear and complete, deployment is successful.

## Project Status Board
- [ ] Project setup and initialization
- [ ] UI implementation
- [ ] Wallet connection with Privy
- [ ] AI integration
- [ ] IPFS upload functionality
- [ ] ERC-20 coin minting
- [ ] Final testing and refinement

## Current Status / Progress Tracking
Not started - awaiting initial planning.

## Executor's Feedback or Assistance Requests
No feedback yet - project not started.

## Lessons
- Include info useful for debugging in the program output.
- Read the file before you try to edit it.
- If there are vulnerabilities that appear in the terminal, run npm audit before proceeding.
- Always ask before using the -force git command. 