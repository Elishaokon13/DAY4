"use client";

import { Header } from '@/components/Header';
import { BlogEditor } from '@/components/BlogEditor';
import { usePrivy } from '@privy-io/react-auth';

export default function Home() {
  const { ready } = usePrivy();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Write & Mint Your Blog as a Coin
            </h1>
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
              Create a blog post and mint it as an ERC-20 token on Base using Zora Coins SDK.
            </p>
          </div>

          {ready ? (
            <BlogEditor />
          ) : (
            <div className="flex justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white py-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Powered by{' '}
            <a
              href="https://zora.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Zora
            </a>{' '}
            and{' '}
            <a
              href="https://privy.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Privy
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
