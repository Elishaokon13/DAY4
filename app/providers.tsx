"use client";

import { createContext, type ReactNode } from 'react'
import { baseSepolia } from "wagmi/chains";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { PrivyProvider } from '@/components/PrivyProvider'

// Keep the existing app context if it's used elsewhere
export const AppContext = createContext({})

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AppContext.Provider value={{}}>
      <PrivyProvider>
        <MiniKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={baseSepolia}
          config={{
            appearance: {
              mode: "auto",
              theme: "mini-app-theme",
              name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
              logo: process.env.NEXT_PUBLIC_ICON_URL,
            },
          }}
        >
          {children}
        </MiniKitProvider>
      </PrivyProvider>
    </AppContext.Provider>
  );
}
