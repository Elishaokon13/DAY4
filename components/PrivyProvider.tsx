'use client';

import { PrivyProvider as BasePrivyProvider } from '@privy-io/react-auth';
import { PropsWithChildren } from 'react';

/**
 * Privy authentication provider component
 * Wraps the application to provide authentication functionality
 */
export function PrivyProvider({ children }: PropsWithChildren) {
  // Get Privy app ID from environment variables
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  if (!privyAppId) {
    console.error('Missing NEXT_PUBLIC_PRIVY_APP_ID environment variable');
    return (
      <div className="flex h-screen items-center justify-center bg-red-50 p-4 text-center">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-red-500">Configuration Error</h2>
          <p>
            Privy App ID is missing. Please set the NEXT_PUBLIC_PRIVY_APP_ID environment variable.
          </p>
        </div>
      </div>
    );
  }

  return (
    <BasePrivyProvider
      appId={privyAppId}
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#3b82f6', // Blue
          logo: '/logo.png', // Add your logo to the public directory
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      {children}
    </BasePrivyProvider>
  );
} 