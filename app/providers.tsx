"use client";

import { type ReactNode } from "react";
import { base } from "wagmi/chains";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { createContext } from 'react'
import { PrivyProvider } from '@/components/PrivyProvider'
import { PropsWithChildren } from 'react'

// Keep the existing app context if it's used elsewhere
export const AppContext = createContext({})

export function Providers({ children }: PropsWithChildren) {
  return (
    <AppContext.Provider value={{}}>
      <PrivyProvider>
        <MiniKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={base}
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
