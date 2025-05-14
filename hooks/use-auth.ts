'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';

export interface AuthState {
  isAuthenticated: boolean;
  address: string | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  isConnectedToBaseChain: boolean;
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

  // Check if wallet is connected to Base Sepolia network
  useEffect(() => {
    const checkNetwork = async () => {
      if (authenticated && user?.wallet) {
        try {
          // For Sepolia testnet, chainId is 84532
          const baseSepoliaChainId = '0x14a34';
          const currentChainId = await user.wallet?.getChainId();
          setIsConnectedToBaseChain(currentChainId === baseSepoliaChainId);
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

  return {
    isAuthenticated: authenticated,
    isLoading: !ready,
    address: user?.wallet?.address || null,
    login,
    logout,
    isConnectedToBaseChain
  };
} 