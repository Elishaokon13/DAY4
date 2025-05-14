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
      // Get the Ethereum provider from the wallet
      const provider = await user.wallet.getEthereumProvider();
      
      if (!provider) {
        toast.error('Ethereum provider not available');
        return false;
      }
      
      // Request provider to switch to Base network
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: BASE_MAINNET_CHAIN_ID }],
        });
        
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
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to the wallet
        if (switchError.code === 4902 || switchError.message?.includes('chain hasn\'t been added')) {
          try {
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: BASE_MAINNET_CHAIN_ID,
                  chainName: 'Base',
                  nativeCurrency: {
                    name: 'Ethereum',
                    symbol: 'ETH',
                    decimals: 18
                  },
                  rpcUrls: ['https://mainnet.base.org'],
                  blockExplorerUrls: ['https://basescan.org']
                }
              ]
            });
            
            // Try switching again after adding the chain
            await provider.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: BASE_MAINNET_CHAIN_ID }],
            });
            
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
        
        console.error('Error switching network:', switchError);
        toast.error(`Failed to switch to Base network: ${switchError.message || 'Unknown error'}`);
        return false;
      }
    } catch (error: any) {
      console.error('Error accessing Ethereum provider:', error);
      toast.error(`Failed to access wallet provider: ${error.message || 'Unknown error'}`);
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