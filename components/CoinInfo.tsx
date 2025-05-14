import React from 'react';
import { Button } from './ui/button';
import { ExternalLink } from 'lucide-react';

interface CoinInfoProps {
  contractAddress: string;
  txHash?: string;
  coinName?: string;
  coinSymbol?: string;
}

/**
 * Component that displays information about a minted coin
 * including contract address and links to view on blockchain explorers
 */
export default function CoinInfo({ contractAddress, txHash, coinName, coinSymbol }: CoinInfoProps) {
  // Always display for testing purposes
  if (!contractAddress) {
    return null;
  }

  const isPending = contractAddress === 'pending';

  const truncateAddress = (address: string) => {
    if (!address || address === 'pending') return 'Pending...';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Generate external links
  const baseScanUrl = `https://basescan.org/address/${contractAddress}`;
  const dexScreenerUrl = `https://dexscreener.com/base/${contractAddress}`;
  const zoraUrl = `https://zora.co/token/${contractAddress}`; 

  return (
    <div className="w-full mt-6 p-6 border rounded-lg bg-slate-50 dark:bg-slate-900 shadow-sm">
      <h3 className="text-lg font-medium mb-2">Minted Coin Details</h3>
      
      {coinName && coinSymbol && (
        <div className="mb-4">
          <p className="font-semibold">{coinName} ({coinSymbol})</p>
        </div>
      )}
      
      <div className="mb-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">Contract Address:</p>
        <div className="flex items-center mt-1">
          <code className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-sm font-mono flex-1 overflow-x-auto">
            {isPending ? "Pending creation..." : contractAddress}
          </code>
          {!isPending && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigator.clipboard.writeText(contractAddress)}
              className="ml-2"
            >
              Copy
            </Button>
          )}
        </div>
      </div>
      
      {txHash && (
        <div className="mb-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Transaction:</p>
          <div className="flex items-center mt-1">
            <code className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-sm font-mono flex-1 overflow-x-auto">
              {txHash.startsWith('tx_') ? 'Pending transaction' : truncateAddress(txHash)}
            </code>
          </div>
        </div>
      )}
      
      {!isPending && (
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.open(baseScanUrl, '_blank')}
            className="flex items-center justify-center"
          >
            View on BaseScan
            <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.open(dexScreenerUrl, '_blank')}
            className="flex items-center justify-center"
          >
            View on DexScreener
            <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.open(zoraUrl, '_blank')}
            className="flex items-center justify-center"
          >
            View on Zora
            <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
        </div>
      )}
      
      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 text-sm rounded-lg">
        <p>
          <strong>Note:</strong> Your coin is being created on Base mainnet. If your transaction is pending or hasn't been confirmed yet, 
          you can click the "Redirect to Zora" option when prompted after minting to view your coin on Zora's interface.
        </p>
      </div>
    </div>
  );
} 