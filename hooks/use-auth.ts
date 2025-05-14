'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

// Chain IDs
const BASE_MAINNET_CHAIN_ID = '0x2105'; // hex for 8453
const BASE_SEPOLIA_CHAIN_ID = '0x14a34'; // hex for 84532

export interface AuthState {
  isAuthenticated: boolean;
  address: string | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  isConnectedToBaseChain: boolean;
  switchToBaseNetwork: () => Promise<boolean>;
}

export default function useAuth(): AuthState {
  const { 
    ready, 
    authenticated, 
    user, 
    login, 
    logout,
    connectWallet
  } = usePrivy();
  
  const [isConnectedToBaseChain, setIsConnectedToBaseChain] = useState(false);

  // Check if wallet is connected to Base Mainnet network
  useEffect(() => {
    const checkNetwork = async () => {
      if (authenticated && user?.wallet) {
        try {
          const currentChainId = await user.wallet?.getChainId();
          // Check if connected to Base mainnet or Base Sepolia (development)
          setIsConnectedToBaseChain(
            currentChainId === BASE_MAINNET_CHAIN_ID || 
            currentChainId === BASE_SEPOLIA_CHAIN_ID
          );
          
          // Log the current network for debugging
          console.log(`Connected to chain ID: ${currentChainId}, target: ${BASE_MAINNET_CHAIN_ID}`);
          
          // Show a toast if not connected to Base
          if (currentChainId !== BASE_MAINNET_CHAIN_ID && currentChainId !== BASE_SEPOLIA_CHAIN_ID) {
            toast.error('Please switch to Base network to mint coins', {
              id: 'wrong-network',
              duration: 5000
            });
          }
        } catch (error) {
          console.error('Error checking network:', error);
          setIsConnectedToBaseChain(false);
        }
      } else {
        setIsConnectedToBaseChain(false);
      }
    };

    checkNetwork();
  }, [authenticated, user?.wallet]);

  // Function to switch network to Base
  const switchToBaseNetwork = async (): Promise<boolean> => {
    if (!authenticated || !user?.wallet) {
      toast.error('Please connect your wallet first');
      return false;
    }

    try {
      // Request wallet to switch to Base network
      await user.wallet.switchChain(parseInt(BASE_MAINNET_CHAIN_ID, 16));
      
      // Verify the switch was successful
      const chainId = await user.wallet.getChainId();
      const success = chainId === BASE_MAINNET_CHAIN_ID;
      
      if (success) {
        toast.success('Successfully connected to Base network');
        setIsConnectedToBaseChain(true);
      } else {
        toast.error('Failed to switch to Base network');
      }
      
      return success;
    } catch (error: any) {
      console.error('Error switching network:', error);
      
      // Check if the error is because the chain hasn't been added
      if (error.message?.includes('chain hasn\'t been added')) {
        try {
          // Add the Base chain if it's not added
          await user.wallet.addChain({
            chainId: parseInt(BASE_MAINNET_CHAIN_ID, 16),
            chainName: 'Base',
            nativeCurrency: {
              name: 'Ethereum',
              symbol: 'ETH',
              decimals: 18
            },
            rpcUrls: ['https://mainnet.base.org'],
            blockExplorerUrls: ['https://basescan.org']
          });
          
          // Try switching again
          await user.wallet.switchChain(parseInt(BASE_MAINNET_CHAIN_ID, 16));
          
          const chainId = await user.wallet.getChainId();
          const success = chainId === BASE_MAINNET_CHAIN_ID;
          
          if (success) {
            toast.success('Successfully added and connected to Base network');
            setIsConnectedToBaseChain(true);
          }
          
          return success;
        } catch (addError) {
          console.error('Error adding Base chain:', addError);
          toast.error('Failed to add Base network to your wallet');
          return false;
        }
      }
      
      toast.error(`Failed to switch to Base network: ${error.message || 'Unknown error'}`);
      return false;
    }
  };

  return {
    isAuthenticated: authenticated,
    isLoading: !ready,
    address: user?.wallet?.address || null,
    login,
    logout,
    isConnectedToBaseChain,
    switchToBaseNetwork
  };
} 