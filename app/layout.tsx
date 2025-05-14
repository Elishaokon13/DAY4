import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PrivyProvider } from "@privy-io/react-auth";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BlogCoin - Mint Your Blog as ERC-20",
  description: "Write blog posts and mint them as ERC-20 coins on the Base Mainnet using Zora Coins SDK",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
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
              noPromptOnSignature: true,
            },
          }}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Toaster position="bottom-right" />
            {children}
          </ThemeProvider>
        </PrivyProvider>
      </body>
    </html>
  );
}
