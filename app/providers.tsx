'use client';

import { PrivyProvider } from "@privy-io/react-auth";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import React, { useState, useEffect } from "react";
import { base } from "viem/chains";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  // Only render client-side components after the component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Base mainnet configuration
  const baseChain = {
    id: base.id, // 8453
    name: "Base",
    iconUrl: "https://raw.githubusercontent.com/cosmic-inquisitor/crypto-icons/2c5f70daefa77447db681304cbba6ae94e4f393b/svg/base.svg",
    rpcUrls: {
      default: { 
        http: ["https://mainnet.base.org"]
      }
    },
    blockExplorers: {
      default: {
        name: "BaseScan",
        url: "https://basescan.org"
      }
    },
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18
    }
  };

  return (
    <>
      {mounted ? (
        <PrivyProvider
          appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
          config={{
            loginMethods: ["wallet", "email"],
            appearance: {
              theme: "dark",
              accentColor: "#3b82f6", // More vibrant blue
              logo: "https://raw.githubusercontent.com/cosmic-inquisitor/crypto-icons/2c5f70daefa77447db681304cbba6ae94e4f393b/svg/base.svg",
              showWalletLoginFirst: true,
            },
            embeddedWallets: {
              ethereum: {
                createOnLogin: "users-without-wallets",
                requireUserPasswordOnCreate: true,
              },
            },
            defaultChain: baseChain,
            supportedChains: [baseChain]
          }}
        >
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <Toaster 
              position="bottom-center"
              toastOptions={{
                style: {
                  background: '#2d3748',
                  color: '#ffffff',
                  borderRadius: '10px',
                  padding: '16px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                },
                success: {
                  iconTheme: {
                    primary: '#3b82f6',
                    secondary: '#ffffff'
                  }
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#ffffff'
                  }
                }
              }}
            />
            {children}
          </ThemeProvider>
        </PrivyProvider>
      ) : (
        // Render a simple placeholder during SSR
        <div style={{ visibility: "hidden" }}>{children}</div>
      )}
    </>
  );
} 