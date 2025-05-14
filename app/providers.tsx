'use client';

import { PrivyProvider } from "@privy-io/react-auth";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import React, { useState, useEffect } from "react";

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

  return (
    <>
      {mounted ? (
        <PrivyProvider
          appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
          config={{
            loginMethods: ["wallet", "email"],
            appearance: {
              theme: "light",
              accentColor: "#14b8a6",
              logo: "https://yourdomain.com/logo.png",
            },
            embeddedWallets: {
              createOnLogin: "users-without-wallets",
            },
          }}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Toaster position="bottom-right" />
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